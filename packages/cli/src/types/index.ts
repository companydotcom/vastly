export interface ConfigContent {
  token?: string;
}

export type Config = ConfigContent | Record<string, any>;

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
