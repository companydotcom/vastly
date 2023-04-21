import { errorToString } from "@companydotcom/utils";
import http from "http";
import { Client } from "../client.js";
import executeLogin from "./execute-login.js";

export default async function doEmailLogin(client: Client, email: string) {
  const { output } = client;
  try {
    output.spinner.color = "yellow";
    output.spinner.start("Sending you an email...\n");

    try {
      const data = await executeLogin(client, email);
      output.spinner.text = JSON.stringify(data);
      output.spinner.succeed("Sent you an email!");
    } catch (err) {
      output.error(errorToString(err));
    }

    const server = http.createServer((req, res) => {
      // handle incoming requests
      output.log(`We sent an email to ${email}. Please follow the steps in that email.\n`);

      output.spinner.start("Waiting for your email confirmation\n");

      console.log("REQ:", req);

      server.listen(5001, () => {
        console.log("Server listening on port 3000");
      });
    });

    // spinner.succeed(chalk.green("waiting for verification"));
  } catch (err: unknown) {
    output.error(err as string);
  }
}
