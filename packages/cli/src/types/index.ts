export interface Config {
  token?: string;
}

export interface EnvResult {
  message: string;
}
export interface EnvVariable {
  environment?: string;
  keyName?: string;
  keyValue?: string;
  projects?: string;
  environment_keyName?: string;
}
