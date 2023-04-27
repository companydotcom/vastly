import { errorToString } from "@companydotcom/utils";
import { Client } from "../client.js";
import executeLogin from "./execute-login.js";
import { startHttpListener } from "../httpListener.js";

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client;
  try {
    output.spinner.color = "yellow";
    output.spinner.start("Sending you an email...\n");

    try {
      await executeLogin(client, email);

      output.spinner.succeed("Sent you an email!");
      output.spinner.start("Waiting for verification");

      const tokens = await startHttpListener();

      output.spinner.succeed("Verification Success");

      console.log("TOKENS:", tokens);
    } catch (err) {
      output.error(errorToString(err));
    }
  } catch (err: unknown) {
    console.log("👾 ~ doEmailLogin ~ err:", err);
    output.error(err as string);
  }
}
