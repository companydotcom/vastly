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
): Promise<VerifyResult> {
  return await client.fetch<VerifyResult>(`${client.apiUrl}/onboarding/verify`, {
    method: "POST",
    body: {
      email,
      token,
    },
  });
}
