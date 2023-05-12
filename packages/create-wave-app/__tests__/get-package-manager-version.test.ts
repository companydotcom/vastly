import { getPackageManagerVersion } from "../src/utils/get-package-manager-version.js";

describe("getPackageManagerVersion", () => {
  it("returns a non-empty string", async () => {
    const version = getPackageManagerVersion("npm");
    expect(typeof version).toBe("string");
    expect(version).not.toBe("");
  });
});
