import { copyTemplate } from "../src/utils/copy-template";
import child_process from "child_process";

vi.mock("fs-extra", () => {
  const mock = {
    copySync: vi.fn(() => void 0),
    existsSync: vi.fn(() => true),
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
    vi.mocked(console.error).mockImplementationOnce(() => void 0);

    await copyTemplate("pnpm");

    expect(consoleSpy).toBeCalledWith(new Error("Unsupported package manager version."));
  });

  it("does not throw error when package manager version is supported", async () => {
    expect(copyTemplate("npm")).not.toThrowError;
  });
});
