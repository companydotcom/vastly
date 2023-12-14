import { STSClient, AssumeRoleCommand, AssumeRoleCommandInput, GetCallerIdentityCommand, AssumeRoleCommandOutput } from "@aws-sdk/client-sts";
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { v4 as uuid } from "uuid";
import { jwtDecode } from "jwt-decode";

export type UseAssumeRoleResponse =
  | AssumeRoleCommandOutput
  | { error: string; success?: never };

/**
 *
 * @param roleName
 * @param token
 * @param client
 * @returns - AssumeRoleCommandOutput
 */
export const UseAssumeRole = async (token: string, client?: string, roleName?: string ): Promise<UseAssumeRoleResponse> => {
  try {
    if (!token) {
      throw Error("Missing or invalid ID token! Sign into vastly to refresh")
    }

    let input: AssumeRoleCommandInput;

    let ASSUME_ROLE_IDENTITY_POOL = `ASSUME_ROLE_IDENTITY_POOL_${client}`
    const { iss } = jwtDecode(token);

    let COGNITO_ID = `${iss?.split("//")[1]}`;
    const loginData = {
      [COGNITO_ID]: token,
    };
    console.log("LOGIN DATA: ", loginData)

    const stsClient = new STSClient({
      region: "us-east-1",
      credentials: fromCognitoIdentityPool({
        clientConfig: { region: "us-east-1" },
        identityPoolId: `${process.env[ASSUME_ROLE_IDENTITY_POOL]}`,
        logins: loginData
      })
    });


    const callerInput = new GetCallerIdentityCommand({});
    const { Account } = await stsClient.send(callerInput);

   input = {
      RoleArn: `arn:aws:iam::${Account}:role/${roleName}`,
      RoleSessionName: `${roleName}Session-${uuid().split("-")[1]}`,
      DurationSeconds: 900, // minimum 15 minutes
    };

    const command = new AssumeRoleCommand(input);
    const response = await stsClient.send(command);
    console.log("----- STS Assume Role Response ------", response);
    if (response?.$metadata?.httpStatusCode === 200) {
      return response;
    }
    throw Error();
  } catch (err) {
    return { error: `${err}: Unable to assume role`};
  }
};
