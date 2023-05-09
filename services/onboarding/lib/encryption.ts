import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms";
import { fromBase64, toBase64 } from "@aws-sdk/util-base64";

const { KMS_KEY_ID, AWS_REGION } = process.env;

const client = new KMSClient({ region: AWS_REGION });

export const encrypt = async (input: string) => {
  try {
    const plaintext = Buffer.from(input);
    const command = new EncryptCommand({
      KeyId: KMS_KEY_ID,
      Plaintext: plaintext,
    });

    const { CiphertextBlob } = await client.send(command);

    if (!CiphertextBlob) {
      throw new Error("Failed to encrypt token: CiphertextBlob is undefined");
    }

    return toBase64(CiphertextBlob);
  } catch (error) {
    console.log("Error encrypting:", error);
  }
};

export const decrypt = async (ciphertext: string) => {
  try {
    const encryptedToken = fromBase64(ciphertext);
    const command = new DecryptCommand({
      CiphertextBlob: encryptedToken,
    });

    const { Plaintext } = await client.send(command);

    if (!Plaintext) {
      throw new Error("Failed to decrypt token: Plaintext is undefined");
    }

    return Buffer.from(Plaintext).toString();
  } catch (error) {
    console.log("Error decrypting:", error);
  }
};
