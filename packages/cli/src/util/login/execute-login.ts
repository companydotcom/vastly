import fetch from "node-fetch"

export default async function executeLogin(email: string) {
  try {
    return await fetch(`https://gxmblcgqcb.execute-api.us-east-1.amazonaws.com/dev/login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
      }),
    })
  } catch (err: unknown) {
    throw new Error(`Error executing login: ${err}`)
  }
}
