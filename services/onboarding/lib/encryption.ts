import { KMSClient, EncryptCommand, DecryptCommand } from "@aws-sdk/client-kms"

const client = new KMSClient({ region: "REGION" })

const { KMS_KEY_ID } = process.env

export const encrypt = async (input: string) => {
  try {
    const command = new EncryptCommand({
      KeyId: KMS_KEY_ID,
      Plaintext: Buffer.from(input, "base64"),
    })
    const resp = await client.send(command)

    return resp.CiphertextBlob
  } catch (error) {
    console.log("🚀  encrypt ~ error:", error)
  }
}

export const decrypt = async (ciphertext: string) => {
  try {
    const command = new DecryptCommand({
      CiphertextBlob: Buffer.from(ciphertext, "base64"),
    })
    const resp = await client.send(command)

    return resp.Plaintext
  } catch (error) {
    console.log("🚀 ~  decrypt ~ error:", error)
  }
}
