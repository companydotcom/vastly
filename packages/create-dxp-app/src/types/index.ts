export type PackageManagerName = "yarn" | "pnpm" | "npm";
export interface GenerateAnswers {
  repoName: string;
  repoDescription: string;
  email: string;
  username: string;
  token: string;
  generate: boolean;
  packageManager: PackageManagerName;
  linkToGithub: boolean;
}

export type PackageManager = {
  name: string;
  template: string;
  command: PackageManagerName;
  installArgs: string[];
  version: string;
  executable: string;
  semver: string;
};

export const PACKAGE_MANAGERS: Record<PackageManagerName, PackageManager[]> = {
  npm: [
    {
      name: "npm",
      template: "npm",
      command: "npm",
      installArgs: ["install"],
      version: "latest",
      executable: "npx",
      semver: "*",
    },
  ],
  pnpm: [
    {
      name: "pnpm6",
      template: "pnpm",
      command: "pnpm",
      installArgs: ["install"],
      version: "latest-6",
      executable: "pnpx",
      semver: "6.x",
    },
    {
      name: "pnpm",
      template: "pnpm",
      command: "pnpm",
      installArgs: ["install"],
      version: "latest",
      executable: "pnpm dlx",
      semver: ">=7",
    },
  ],
  yarn: [
    {
      name: "yarn",
      template: "yarn",
      command: "yarn",
      installArgs: ["install"],
      version: "1.x",
      executable: "npx",
      semver: "<2",
    },
    {
      name: "berry",
      template: "berry",
      command: "yarn",
      installArgs: ["install", "--no-immutable"],
      version: "stable",
      executable: "yarn dlx",
      semver: ">=2",
    },
  ],
};
