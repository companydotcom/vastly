export interface Config {
  token?: string;
}

export interface EnvResult {
  message: string;
}
export interface EnvVariable {
  environment?: string;
  key?: string;
  value?: string;
  project?: string;
  project_environment?: string;
}
