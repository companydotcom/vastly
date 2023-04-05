import { Command } from "commander"

export interface ClientOptions {
  output: Command
}

export default function client(opts: ClientOptions) {
  return {
    output: opts.output,
  }
}
