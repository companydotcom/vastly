import { errorToString } from "@vastly/utils";
import { Account } from "../../types/index.js";
import { Client } from "../client.js";

export interface VerifyResult {
  token: string;
  accounts?: Account[];
}

export default async function executeVerify(
  client: Client,
  email: string | string[],
  token: string,
): Promise<VerifyResult | number> {
  const { output } = client;
  try {
    return await client.fetch<VerifyResult>(`${client.apiUrl}/onboarding/verify`, {
      method: "POST",
      body: {
        email,
        token,
      },
    });
  } catch (err) {
    return 1;
  }
}
