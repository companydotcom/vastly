import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { v4 as uuid } from "uuid";

/**
 * TODO: this needs initial credentials to run. Configure the cognito token claims. https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/iam/command/CreateAccessKeyCommand/
 *  */

/**
 *
 * @param roleName
 * @param accountId
 * @param newCredentials
 * @returns
 */
export const assumeRole = async (roleName: string, accountId: string, newCredentials?: any) => {
  try {
    let stsClient;
    if (newCredentials) {
      stsClient = new STSClient({
        region: "us-east-1",
        credentials: {
          accessKeyId: newCredentials?.AccessKeyId,
          secretAccessKey: newCredentials?.SecretAccessKey,
          sessionToken: newCredentials?.SessionToken,
          expiration: newCredentials?.Expiration,
        },
      });
    } else {
      stsClient = new STSClient({
        region: "us-east-1",
      });
    }

    const input = {
      RoleArn: `arn:aws:iam::${accountId}:role/${roleName}`,
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
    throw Error(`${err}: Unable to assume role`);
  }
};
