import { Command } from "commander"
import { JSONObject } from "@companydotcom/types"
import fetch, { BodyInit, Headers, RequestInit, Response } from "node-fetch"
import { Output } from "./output"

export interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: BodyInit | JSONObject
}

export const isJSONObject = (v: any): v is JSONObject => {
  return v && typeof v == "object" && v.constructor === Object
}

export interface Client {
  program: Command
  output: Output
  fetch: (url: string, options?: FetchOptions) => Promise<Response>
}

export default function makeClient(opts: Client) {
  // A wrapper around node-fetch that handles JSON bodies and type safety
  const request = (_url: string, options: FetchOptions = {}) => {
    const headers = new Headers(options.headers)

    let body
    if (isJSONObject(options.body)) {
      body = JSON.stringify(options.body)
      headers.set("content-type", "application/json; charset=utf-8")
    } else {
      body = options.body
    }

    return fetch(_url, { ...opts, headers, body })
  }

  return {
    program: opts.program,
    output: opts.output,
    fetch: request,
  }
}
