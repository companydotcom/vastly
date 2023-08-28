export interface ConfigContent {
  token?: string;
  accounts?: Account[];
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

export interface Account {
  account_id: number;
  account_alias: string;
}
