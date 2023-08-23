import { execSync } from "child_process";
import { Account } from "@vastly/types";
import { Client } from "../../../util/client.js";

export default async function deployFrontend(client: Client, stage: string) {
  const { output } = client;

  try {
    execSync(`npx sst deploy --stage ${stage}`, { stdio: "inherit" });
  } catch (err: unknown) {
    output.error(err as string);
  }
}
