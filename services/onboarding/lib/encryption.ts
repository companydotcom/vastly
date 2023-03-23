import {
  KMSClient,
  EncryptCommand,
  EncryptCommandInput,
  DecryptCommand,
  DecryptCommandInput,
} from "@aws-sdk/client-kms"

const client = new KMSClient({ region: "REGION" })

export const encrypt = async (input: EncryptCommandInput) => {
  try {
    const command = new EncryptCommand(input)
    const resp = await client.send(command)

    return resp.CiphertextBlob
  } catch (error) {
    console.log("🚀  encrypt ~ error:", error)
  }
}

export const decrypt = async (ciphertext: DecryptCommandInput) => {
  try {
    const command = new DecryptCommand(ciphertext)
    const resp = await client.send(command)

    return resp.Plaintext
  } catch (error) {
    console.log("🚀 ~  decrypt ~ error:", error)
  }
}
