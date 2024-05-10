module.exports = {
  serverURL: 'https://k.ponyui.com',
  ponyuiToken: '6625d8998fb5e25223302c4b',
  engine: {
    debug: true,
    language: 'typescript',
    framework: 'react',
    importReact: true,
    exportComponentAsDefault: true,
    eol: '\n',
    tabSpaces: 2,
    defaultTag: 'div',
    globalCss: './src/index.css',
    css: {
      processor: 'css-modules',
      unit: 'px',
      middleName: 'module',
      extension: 'scss',
    },
  },
  storybook: null,
  prettier: true,
  // eslint: true,
  exportImage: {
    path: './src/app/assets/images',
    codePrefix: 'app/app/src/assets/images',
  },
  exportSvg: {
    path: './src/app/assets/svg',
    codePrefix: 'app/src/app/assets/svg',
  },
  exportSvgComponent: {
    path: './src/app/components/icons',
    codePrefix: 'app/src/app/components/icons',
    middleName: 'icon',
  },
  exportComponent: {
    path: './src/app/components/',
    codePrefix: 'app/src/app/components/',
    middleName: 'component',
  },
};
