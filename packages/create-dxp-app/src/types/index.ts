export interface generateAnswers {
  repoName: string
  repoDescription: string
  email: string
  username: string
  token: string
  generate: boolean
  packageManager: packageManager
}

enum packageManager {
  npm = "npm",
  yarn = "yarn",
  pnpm = "pnpm",
}
