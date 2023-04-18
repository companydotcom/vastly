import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";

const { KMS_KEY_ID, AWS_REGION } = process.env;

const client = new KMSClient({ region: AWS_REGION });

export const encrypt = async (input: string) => {
  try {
    const command = new EncryptCommand({
      KeyId: KMS_KEY_ID,
      Plaintext: Buffer.from(input, "base64"),
    });
    const resp = await client.send(command);

    return resp.CiphertextBlob;
  } catch (error) {
    console.log("Error encrypting:", error);
  }
};

export const decrypt = async (ciphertext: string) => {
  try {
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(ciphertext, "base64"),
    });
    const resp = await client.send(command);

    return resp.Plaintext;
  } catch (error) {
    console.log("Error decrypting:", error);
  }
};
