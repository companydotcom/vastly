import { errorToString } from "@companydotcom/utils";
import { Client } from "../util/client.js";
import { writeToConfigFile } from "../util/config/files.js";

export default async function logout(client: Client) {
  const { output, apiUrl, config } = client;

  if (!config.token) {
    output.print(`Not currently logged in or token missing from config file`);
    return 0;
  }

  output.spinner.start("Logging you out...");

  try {
    await client.fetch(`${apiUrl}/dev/onboarding/logout`, {
      method: "POST",
      body: {
        token: config.token,
      },
    });
  } catch (err: unknown) {
    output.debug(errorToString(err));
  }

  delete config.token;

  try {
    writeToConfigFile(config);
    output.debug("Config file deleted");
  } catch (err: unknown) {
    output.debug(errorToString(err));
  }

  output.print("Successfully logged out!");
}
