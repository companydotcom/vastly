export interface Config {
  token?: string;
}

export interface SecretResult {
  message: string;
}
export interface Secret {
  environment?: string;
  secretKey?: string;
  secretValue?: string;
  workspace?: string;
}
