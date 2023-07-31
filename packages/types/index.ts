export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export type JSONArray = JSONValue[];

export type JSONValue = Primitive | JSONObject | JSONArray;

export interface JSONObject {
  [key: string]: JSONValue;
}

export interface WaveOptions {
  name?: string;
  stage?: string;
  accountId?: string;
}

export interface ConfigContent {
  token?: string;
  wave?: WaveOptions;
}

export type Config = ConfigContent | Record<string, any>;
