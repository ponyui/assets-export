import Bluebird from 'bluebird';
import axios from 'axios';
import fs from 'fs';
import groupBy from 'lodash/groupBy.js';
import pascalCase from 'just-pascal-case';
import { Command } from 'commander';
import { cosmiconfigSync } from 'cosmiconfig';
import { v4 as uuidv4 } from 'uuid';
import { transform } from '@svgr/core';

import { ESLint } from 'eslint';
import * as prettierModule from 'prettier';

export interface AssetNode {
  nodeId: string;
  exportAs: string;
  name: string;
  path?: string;
  scale?: number;

  updatedAt: Date;
  publishedAt?: Date;

  content?: string | Buffer;
}

const maxRetries = 5;
const maxDelay = 2000;
const sep = '----------------------------------------';

export default () => {
  const command = new Command('import');

  command
    .description('Import one or more Figma nodes as asset files.')
    .argument(
      '[nodeId]',
      'Figma Node Id. You can find it in PonyUI Assets Export Plugin.',
    )
    .option('-v, --verbose', 'Verbose mode', false)
    .action(async (nodeId: string, { verbose }: any) => {
      console.log('Loading config file...');

      const explorer = cosmiconfigSync('ponyui-assets');
      let config = null;
      try {
        const configRef = explorer.load('.ponyui/assets.json');
        config = configRef?.config;
      } catch (e) {
        // do nothing
      }

      if (!config) {
        console.error('Config file not found. Run `npx pa init` first.');
        process.exit(1);
      }

      if (!config.token) {
        config.token = uuidv4();
        fs.writeFileSync(
          '.ponyui/assets.json',
          JSON.stringify(config, null, 2),
        );
      }

      const figmaFile = config.figmaFile || process.env.FIGMA_FILE;
      const figmaToken = config.figmaToken || process.env.FIGMA_TOKEN;

      if (!figmaFile || !figmaToken) {
        console.error(
          'Figma File ID or Token not found. Run `npx pa init` first.',
        );
        process.exit(1);
      }

      console.log('Loading configured assets from Figma file...');

      const figmaClient = axios.create({
        withCredentials: true,
        baseURL: 'https://api.figma.com',
        timeout: 5000,
        headers: { 'X-FIGMA-TOKEN': figmaToken },
      });

      let assets = null;
      try {
        const { data } = await figmaClient.get(
          `/v1/files/${figmaFile}?plugin_data=shared&depth=1`,
        );

        const assetsString = data.document.sharedPluginData['ponyui.assets'];
        if (verbose) {
          console.log('Figma Plugin Data:', assetsString);
        }

        assets = assetsString && JSON.parse(assetsString.nodes);
        if (!assetsString || !assets) {
          console.error(
            'Nothing to import: no configured assets found in the Figma file. ',
            'Please use PonyUI Assets Export Plugin to configure assets.',
          );
          process.exit(1);
        }
      } catch (e) {
        console.error('Could not fetch data from the Figma file.');
        if (verbose) {
          console.error(e);
        }
        process.exit(1);
      }

      if (nodeId) {
        const asset = assets.find(
          (asset: AssetNode) => asset.nodeId === nodeId,
        );
        if (!asset) {
          console.error(
            `Asset with ID '${nodeId}' not found. Nothing to import.`,
          );
          process.exit(1);
        }

        assets = [asset];
      }

      console.log('Loading assets links from Figma...');

      const staticGroups = groupBy(assets, (asset: AssetNode) => {
        const { exportAs } = asset;

        if (['jpg', 'png'].indexOf(exportAs) >= 0) {
          const { scale = 2 } = asset;
          return `${exportAs}-${scale}`;
        }

        if (exportAs === 'react-icon-component') {
          return 'svg';
        }

        return exportAs;
      });

      const staticUrlsMap = await Bluebird.map(
        Object.keys(staticGroups),
        async group => {
          const nodes = staticGroups[group];
          const nodeIds = nodes
            .map((asset: AssetNode) => asset.nodeId)
            .join(',');

          const [type, scale] = group.split('-');
          const url = `/v1/images/${figmaFile}?ids=${nodeIds}&format=${type}${
            scale ? `&scale=${scale}` : ''
          }`;

          if (verbose) {
            console.log('Loading: ', url);
          }

          const {
            data: { images },
          } = await figmaClient.get(url);

          return images;
        },
      );

      const staticUrls = staticUrlsMap.reduce(
        (acc: any, item: any) => ({ ...acc, ...item }),
        {},
      );

      console.log('Loading assets content from Figma...');

      const files = await Bluebird.mapSeries(
        Object.keys(staticUrls),
        async (nodeId: string) => {
          const node = assets.find(
            (asset: AssetNode) => asset.nodeId === nodeId,
          );

          const { exportAs } = node;
          const isBinary = ['png', 'jpg'].indexOf(exportAs) >= 0;

          let data: any;
          let retry = true;
          let retries = 0;

          while (retry && retries < maxRetries) {
            try {
              // eslint-disable-next-line no-await-in-loop
              const response = await figmaClient.get(staticUrls[nodeId], {
                responseType: isBinary ? 'arraybuffer' : 'text',
              });
              data = response.data;
              retry = false;
            } catch (error) {
              if (verbose) {
                console.error('Network request failed:', error);
              }

              retries += 1;
              const delay = Math.random() * maxDelay; // Random delay between 0 and 2000 milliseconds
              // eslint-disable-next-line no-await-in-loop
              await new Promise(resolve => {
                setTimeout(resolve, delay);
              });
            }
          }

          if (data) {
            node.content = data;
          }

          return node;
        },
      );

      console.log('Generating files...');
      console.log(sep);

      const { language, eslint, prettier, exportImage, exportSvg, exportSvgr } =
        config;

      await Bluebird.mapSeries(files, async (asset: AssetNode) => {
        const { exportAs, name, path } = asset;

        const isImage = ['png', 'jpg'].indexOf(exportAs) >= 0;
        const isSvgr = exportAs === 'react-icon-component';

        let filePath = path;
        let middleName = '';
        let ext = ''; // png, jpg & svg already have extensions in name

        if (isImage) {
          filePath = path || exportImage.path;
        } else if (exportAs === 'svg') {
          filePath = path || exportSvg.path;
        } else if (isSvgr) {
          filePath = path || exportSvgr.path;
          middleName = exportSvgr.middleName;
          ext = language === 'typescript' ? 'tsx' : 'js';
        }

        filePath = filePath
          .split('/')
          .filter(t => !!t)
          .join('/');

        // let's create filePath if doesn't exist
        fs.mkdirSync(filePath, { recursive: true });

        filePath = [`${filePath}/${name}`, middleName, ext]
          .filter(t => !!t)
          .join('.');

        if (isSvgr) {
          let code = transform.sync(
            asset.content as string,
            {
              plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
              icon: true,
              typescript: language === 'typescript',
            },
            { componentName: pascalCase(name) },
          );

          try {
            if (prettier) {
              // https://stevenklambert.com/writing/getting-prettier-api-format-code-same-as-cli/
              const prettierConfig =
                await prettierModule.resolveConfig(filePath);
              if (prettierConfig) {
                code = await prettierModule.format(code, {
                  ...prettierConfig,
                  filepath: filePath,
                });
              }
            }
          } catch (e) {
            // prettier or eslint couldn't fix the code, so just skip this step
            if (verbose) {
              console.error(e);
            }
          }

          try {
            if (eslint) {
              const eslint = new ESLint({
                fix: true,
                useEslintrc: true,
              });
              const results = await eslint.lintText(code, {
                filePath,
              });

              code = results[0].output || code;
            }
          } catch (e) {
            // prettier or eslint couldn't fix the code, so just skip this step
            if (verbose) {
              console.error(e);
            }
          }

          // eslint-disable-next-line no-param-reassign
          asset.content = code;
        }

        if (isImage) {
          fs.writeFileSync(filePath, Buffer.from(asset.content as any));
        } else {
          fs.writeFileSync(filePath, asset.content as string);
        }

        console.log(`${filePath}... Created.`);
      });

      const ponyUI = process.env.API_URL || 'https://assets.ponyui.com';
      let importCTA = null;
      try {
        const { data } = await axios.get(
          `${ponyUI}/cta?app=assets-cli&name=importCTA`,
        );

        importCTA = data;
      } catch (e) {
        if (verbose) {
          console.error(e);
        }
      }

      console.log(
        [sep, 'All done. Please take a look at the files.', sep].join('\n'),
      );

      if (importCTA) {
        console.log([importCTA, sep].join('\n'));
      }
    });

  return command;
};
