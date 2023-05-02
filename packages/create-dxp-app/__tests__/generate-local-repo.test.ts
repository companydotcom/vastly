import child_process, { spawnSync } from "child_process";
import { generateLocalRepo } from "../src/utils/generate-local-repo";
import { GenerateAnswers } from "../src/types";

describe("generateLocalRepo", () => {
  // vi.mock("child_process", async (importOriginal: () => Promise<typeof child_process>) => {
  //   const module = await importOriginal();

  //   return {
  //     ...module,
  //     spawnSync: vi.fn(),
  //   };
  // });

  const mockAnswers = {
    repoName: "repo",
    repoDescription: "description",
    email: "test@test.com",
    username: "username",
    token: "token",
    generate: true,
    packageManager: "npm",
    linkToGithub: true,
  };

  it.skip("creates a local repo with the specified name and copies template files", async () => {
    await generateLocalRepo(mockAnswers as GenerateAnswers);
  });
});

// https://github.com/vitest-dev/vitest/pull/2772
