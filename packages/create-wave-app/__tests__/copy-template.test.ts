import { copyTemplate } from "../src/utils/copy-template";
import child_process from "child_process";

vi.mock("fs-extra", () => {
  const mock = {
    copy: vi.fn(() => void 0),
    exists: vi.fn(() => true),
    readFile: vi.fn(() => "<%= appName %>, <%= description %>"),
    writeFile: vi.fn(() => void 0),
  };
  return {
    ...mock,
    default: mock,
  };
});

vi.mock("child_process", async (importOriginal: () => Promise<typeof child_process>) => {
  const mod = await importOriginal();

  return {
    ...mod,
    execSync: vi.fn(() => "1.0.0"),
  };
});

describe("copyTemplate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("throws an error when packageManagerConfig does not exist", async () => {
    const consoleSpy = vi.spyOn(console, "error");
    consoleSpy.mockImplementationOnce(vi.fn(() => void 0));

    const actual = await copyTemplate("pnpm", {
      repoName: "testRepo",
      repoDescription: "testRepoDescription",
    });
    const mockError = {
      success: false,
      message: "Something went wrong: Error: Unsupported package manager version.",
    };
    expect(consoleSpy).toBeCalledTimes(1);
    expect(actual).toEqual(mockError);
  });

  it("does not throw error when package manager version is supported", async () => {
    expect(copyTemplate("npm", { repoName: "testRepo", repoDescription: "testRepoDescription" }))
      .not.toThrowError;
  });
});
