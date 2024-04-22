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
      extension: 'css',
    },
  },
  storybook: {
    middleName: 'stories',
  },
  prettier: true,
  // eslint: true,
  exportImage: {
    path: './src/assets/images',
    codePrefix: 'app/src/assets/images',
  },
  exportSvg: {
    path: './src/assets/svg',
    codePrefix: 'app/src/assets/svg',
  },
  exportSvgComponent: {
    path: './src/components/icons',
    codePrefix: 'app/src/components/icons',
    middleName: 'icon',
  },
  exportComponent: {
    path: './src/components/',
    codePrefix: 'app/src/components/',
    middleName: 'component',
  },
};
