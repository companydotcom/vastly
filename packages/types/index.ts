export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export type JSONArray = JSONValue[];

export type JSONValue = Primitive | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}
export interface ConfigContent {
  token?: {
    accessToken?: string;
    idToken?: string;
  };
  accounts?: Account[];
}

export interface Account {
  account_alias: string;
  account_id: number;
}

export interface WaveConfig {
  name?: string;
  accountId?: string;
  stage?: string;
  hostedZone: "vastly.tech";
}

export type Config = ConfigContent | Record<string, any>;
