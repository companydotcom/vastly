import { Command } from "commander"
import { Output } from "./output"
export interface Client {
  program: Command
  output: Output
}

export default function makeClient(opts: Client) {
  return {
    program: opts.program,
    output: opts.output,
  }
}
