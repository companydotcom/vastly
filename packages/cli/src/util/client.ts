import { Command } from "commander";
import { JSONObject } from "@companydotcom/types";
import fetch, { BodyInit, Headers, RequestInit } from "node-fetch";
import { Output } from "./output/index.js";

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | JSONObject;
  method?: string;
}

export const isJSONObject = (v: any): v is JSONObject => {
  return v && typeof v == "object" && v.constructor === Object;
};

export interface ClientOptions {
  program: Command;
  output: Output;
}

export default function makeClient(opts: ClientOptions) {
  // A wrapper around node-fetch that handles JSON bodies and type safety
  function _fetch(_url: string, options: FetchOptions = {}) {
    const headers = new Headers(options.headers);
    const method = options?.method;

    let body;
    if (isJSONObject(options.body)) {
      body = JSON.stringify(options.body);
      headers.set("content-type", "application/json; charset=utf-8");
    } else {
      body = options.body;
    }

    return fetch(_url, { ...opts, headers, body, method });
  }

  async function request<T>(url: string, opts?: FetchOptions): Promise<T>;
  async function request(url: string, opts: FetchOptions = {}) {
    const res = await _fetch(url, opts);

    const contentType = res.headers.get("content-type");

    if (!contentType) {
      return null;
    }

    return contentType.includes("application/json") ? res.json() : res;
  }

  return {
    program: opts.program,
    output: opts.output,
    fetch: request,
  };
}

export type Client = ReturnType<typeof makeClient>;
