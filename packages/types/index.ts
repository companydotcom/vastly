export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export type JSONArray = JSONValue[];

export type JSONValue = Primitive | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}
export interface ConfigContent {
  token?: string;
}

export interface WaveConfig {
  name?: string;
  accountId?: string;
  stage?: string;
}

export type Config = ConfigContent | Record<string, any>;
