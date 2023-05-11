import child_process, { spawnSync } from "child_process";
import { generateLocalRepo } from "../src/utils/generate-local-repo";
import { GenerateAnswers } from "../src/types";

describe("generateLocalRepo", () => {
  vi.mock("child_process", async (importOriginal: () => Promise<typeof child_process>) => {
    const mod = await importOriginal();

    return {
      ...mod,
      spawnSync: vi.fn(),
    };
  });

  const mockAnswers = {
    repoName: "repo",
    repoDescription: "description",
    userEmail: "test@test.com",
    userName: "username",
    userAccessToken: "token",
    generate: true,
    packageManager: "npm",
    linkToGithub: true,
  };

  it.skip("creates a local repo with the specified name and copies template files", async () => {
    await generateLocalRepo(mockAnswers as GenerateAnswers);
  });
});
