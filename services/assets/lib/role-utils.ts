import { UseAssumeRole } from "@vastly/utils";
import { RoleChainingResponse } from "../types";

/**
 * Assumes two IAM roles in a chain and returns the credentials and role information.
 *
 * @returns {Promise<RoleChainingResponse>}
 */
export const roleChaining = async (): Promise<RoleChainingResponse> => {
  const roleChainCreds = await UseAssumeRole("AssetServiceRole", "908170539157");
  const response = await UseAssumeRole(
    "CrossAccountAssetServiceRole",
    "229258319284",
    roleChainCreds?.Credentials,
  );

  return {
    credentials: response.Credentials,
    role: response.AssumedRoleUser,
  };
};
