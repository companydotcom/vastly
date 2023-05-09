import child_process, { spawnSync } from "child_process";
import { Octokit } from "@octokit/rest";
import { GenerateAnswers } from "../src/types";
import { generateGithubRepo } from "../src/utils/generate-github-repo";

vi.mock("@octokit/rest", async (importOriginal: () => Promise<typeof Octokit>) => {
  const mod = await importOriginal();
  return {
    ...mod,
    Octokit: vi.fn(() => ({
      repos: {
        createForAuthenticatedUser: vi.fn(() => ({
          data: {
            name: "repo",
            clone_url: "https://github.com/testuser/my-repo",
          },
        })),
      },
    })),
  };
});

vi.mock("child_process", async (importOriginal: () => Promise<typeof child_process>) => {
  const mod = await importOriginal();

  return {
    ...mod,
    spawnSync: vi.fn(),
  };
});

describe("generateGithubRepo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it.skip("runs correct git commands", async () => {
    await generateGithubRepo(mockAnswers as GenerateAnswers);
    expect(vi.mocked(spawnSync).mock.calls).toEqual([
      ["git", ["clone", "https://github.com/testuser/my-repo"]],
    ]);
    expect(vi.mocked(spawnSync).mock.calls.length).toBe(1);
  });
});
