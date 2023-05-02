import child_process, { spawnSync } from "child_process";
import { Octokit } from "@octokit/rest";
import { GenerateAnswers } from "../src/types";
import { generateGithubRepo } from "../src/utils/generate-github-repo";

vi.mock("@octokit/rest", async (importOriginal: () => Promise<typeof Octokit>) => {
  const mod = await importOriginal();

  return {
    ...mod,
    Octokit: vi.fn(
      () =>
        new Promise((resolve, reject) => {
          resolve({
            status: 302,
            headers: { location: "https://github.com/testuser/my-repo" },
            repos: {
              createForAuthenticatedUser: "https://github.com/testuser/my-repo",
            },
          });
        }),
    ),
    octokit: vi.fn(() => {
      const mock = {
        repos: {
          createForAuthenticatedUser: "https://github.com/testuser/my-repo",
        },
      };
      return { ...mock };
    }),
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

  it.skip("", async () => {
    await generateGithubRepo(mockAnswers as GenerateAnswers);
    expect(vi.mocked(spawnSync).mock.calls).toEqual([
      ["git", "clone", "https://github.com/testuser/my-repo"],
      ["git", "branch", "--unset-upstream"],
      ["git", "add", "."],
      ["git", "commit", ".", "-m", "Initial commit"],
      ["git", "push", "--set-upstream", "origin", "master"],
    ]);
    // expect(vi.mocked(spawnSync).mock.calls[0][0]).toBe(["git", "clone"]);
  });
});
