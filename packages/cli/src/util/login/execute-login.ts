import { Client } from "../client"

interface LoginResponse {
  message: string
}

export default async function executeLogin(client: Client, email: string) {
  const { fetch } = client
  try {
    const login = await fetch(`https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com/dev/login`, {
      method: "POST",
      body: {
        email,
      },
    })
    return login.json()
  } catch (err: unknown) {
    console.log("👾 ~ executeLogin ~ err:", err)
    throw new Error(`Error executing login: ${err}`)
  }
}
