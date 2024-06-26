export interface ExportTypeConfig {
  path: string;
  middleName?: string;
}

export interface Config {
  token?: string;
  figmaFile?: string;
  figmaToken?: string;
  language: string;
  eslint: boolean;
  prettier: boolean;
  exportImage: ExportTypeConfig;
  exportSvg: ExportTypeConfig;
  exportSvgr: ExportTypeConfig;
}
