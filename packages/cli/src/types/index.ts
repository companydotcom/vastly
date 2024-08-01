export interface ConfigContent {
  token?: string;
  accounts?: Account[];
}

export type Config = ConfigContent | Record<string, any>;

export interface EnvResult {
  message: string;
}
export interface EnvVariable {
  app: string;
  keyName: string;
  keyValue: string;
  stage: string;
}

export interface Account {
  account_id: number;
  account_alias: string;
}

export type Stage = "sandbox" | "local" | "uat" | "production";
