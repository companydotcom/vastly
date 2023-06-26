import { Client } from "../util/client.js";
import { MockClient } from "../../__tests__/mocks/client.js";

export default async function whoami(client: Client | MockClient) {
  const { output, apiUrl, config } = client;

  console.log("🫵 ----------------------------🫵");
  console.log("🫵 : whoami : apiUrl", apiUrl);
  console.log("🫵 ----------------------------🫵");

  try {
    const t = await client.fetch(`${apiUrl}/dev/onboarding/user`, {
      method: "GET",
    });

    console.log(t);
  } catch (e) {
    console.log(e);
  }
}
