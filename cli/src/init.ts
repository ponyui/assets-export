import { Command } from 'commander';
import { v4 as uuidv4 } from 'uuid';
import { cosmiconfigSync } from 'cosmiconfig';
import inquirer from 'inquirer';
import fs from 'fs';
import axios from 'axios';

import { type Config, ExportTypeConfig } from './config.js';

const figmaSecurity = {
  FILE: 'Save them in config file',
  ENV: "I'll use env variables",
};

const assetsTypes = {
  IMAGES: 'png and jpg images',
  SVG: 'svg files',
  SVGR: 'svg react icon components',
};

const defaultImageConfig: ExportTypeConfig = {
  path: 'src/assets/images',
};

const defaultSvgConfig: ExportTypeConfig = {
  path: 'src/assets/svg',
};

const defaultSvgrConfig: ExportTypeConfig = {
  path: 'src/components/icons',
  middleName: 'icon',
};

export default () => {
  const command = new Command('init');

  command.description('init command will create a config file').action(() => {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'selectedFigmaSecurity',
          message: [
            'Thanks for using out tools. On the next step we will ask you to provide Figma File ID & Token. ',
            'We only save this information in your local machine. ',
            'If you don`t know how to get it, watch these youtube videos: ',
            'https://www.youtube.com/watch?v=uUv-IZX4KYg & https://www.youtube.com/watch?v=uUv-IZX4KYg',
          ].join(''),
          choices: [figmaSecurity.FILE, figmaSecurity.ENV],
          default: figmaSecurity.FILE,
        },
        {
          type: 'input',
          name: 'figmaFile',
          message: 'Figma File ID:',
          when: (answers: any) =>
            answers['selectedFigmaSecurity'] === 'Save them in config file',
        },
        {
          type: 'input',
          name: 'figmaToken',
          message: 'Figma Token:',
          when: (answers: any) =>
            answers['selectedFigmaSecurity'] === 'Save them in config file',
        },
        {
          type: 'checkbox',
          name: 'selectedAssetTypes',
          message: 'What types of assets you are going to import?',
          choices: [assetsTypes.IMAGES, assetsTypes.SVG, assetsTypes.SVGR],
        },
        {
          type: 'input',
          name: 'imagesPath',
          message: 'Please specify path to save png & jpg images:',
          default: defaultImageConfig.path,
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.IMAGES),
        },
        {
          type: 'input',
          name: 'svgPath',
          message: 'Please specify path to save svg files:',
          default: defaultSvgConfig.path,
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.SVG),
        },
        {
          type: 'input',
          name: 'svgrPath',
          message: 'Please specify path to save svg react icon components:',
          default: defaultSvgrConfig.path,
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.SVGR),
        },
        {
          type: 'list',
          name: 'language',
          message: 'What language you are using?',
          choices: ['javascript', 'typescript'],
          default: 'typescript',
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.SVGR),
        },
        {
          type: 'input',
          name: 'svgrMiddleName',
          message:
            'If you want to have middle name for react icons (like trash.icon.tsx), type it:',
          default: defaultSvgrConfig.middleName,
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.SVGR),
        },
        {
          type: 'list',
          name: 'eslint',
          message: 'Do you use eslint?',
          choices: ['Yes', 'No'],
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.SVGR),
        },
        {
          type: 'list',
          name: 'prettier',
          message: 'Do you use prettier?',
          choices: ['Yes', 'No'],
          when: (answers: any) =>
            answers['selectedAssetTypes'].includes(assetsTypes.SVGR),
        },
        {
          type: 'input',
          name: 'newsletter',
          message: [
            'At PonyUI we are hard working on the tool ',
            'that automates the conversion of Figma designs into React/React Native code. ',
            'If you are interested, please type your email ',
            'and join our newsletter and waitlist. Email: ',
          ].join(''),
          validate: input => {
            if (!input) {
              return true;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(input)) {
              return true;
            } else {
              return 'Please enter a valid email address.';
            }
          },
        },
        {
          type: 'input',
          name: 'username',
          message: ['Your name: '].join(''),
          when: (answers: any) => !!answers['newsletter'],
        },
      ])
      .then(
        async ({
          selectedFigmaSecurity,
          figmaFile,
          figmaToken,
          selectedAssetTypes,
          imagesPath,
          svgPath,
          svgrPath,
          language,
          svgrMiddleName,
          eslint,
          prettier,
          newsletter,
          username,
        }: any) => {
          if (newsletter) {
            try {
              const baseUrl =
                process.env.API_URL || 'https://assets.ponyui.com';
              await axios.put(`${baseUrl}/subscribe`, {
                app: 'assets-cli',
                name: username,
                email: newsletter,
              });
            } catch (e) {
              console.error(
                [
                  '----------------------------------------',
                  '!!! Failed to subscribe to newsletter.',
                  'Please subscribe at https://ponyui.com',
                ].join('\n'),
              );
              console.log(e);
            }
          }

          const explorer = cosmiconfigSync('ponyui-assets');
          let oldConfig = null;
          try {
            const configRef = explorer.load('.ponyui/assets.json');
            oldConfig = configRef?.config;
          } catch (e) {
            // do nothing
          }

          const hasSvgr = selectedAssetTypes.indexOf(assetsTypes.SVGR) >= 0;

          console.log(
            'figmaSecurity: ',
            selectedFigmaSecurity,
            '|',
            selectedFigmaSecurity === figmaSecurity.FILE,
            selectedFigmaSecurity.indexOf(figmaSecurity.FILE) >= 0,
            figmaFile,
            figmaToken,
          );

          const config: Config = {
            token: oldConfig?.token || uuidv4(),
            ...(selectedFigmaSecurity === figmaSecurity.FILE &&
            figmaFile &&
            figmaToken
              ? {
                  figmaFile,
                  figmaToken,
                }
              : {}),
            language: language || 'typescript',
            eslint: hasSvgr && eslint === 'Yes',
            prettier: hasSvgr && prettier === 'Yes',
            exportImage: selectedAssetTypes.includes(assetsTypes.IMAGES)
              ? {
                  ...defaultImageConfig,
                  path: imagesPath,
                }
              : defaultImageConfig,
            exportSvg: selectedAssetTypes.includes(assetsTypes.SVG)
              ? {
                  ...defaultSvgConfig,
                  path: svgPath,
                }
              : defaultSvgConfig,
            exportSvgr: selectedAssetTypes.includes(assetsTypes.SVGR)
              ? {
                  ...defaultSvgrConfig,
                  path: svgrPath,
                  middleName: svgrMiddleName,
                }
              : defaultSvgrConfig,
          };

          console.log('writeConfig: ', config);

          // let's create `.ponyui` folder
          fs.mkdirSync('.ponyui', { recursive: true });
          fs.writeFileSync(
            '.ponyui/assets.json',
            JSON.stringify(config, null, 2),
          );

          console.log(
            [
              '----------------------------------------',
              'Your `./ponyui/assets.json` file has been created. 🎉 ',
              "It's time to import assets with command `npx pa import`",
            ].join('\n'),
          );
        },
      );
  });

  return command;
};
