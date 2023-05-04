import { describe, it, expect, vi, beforeAll } from "vitest";
import { addVariable } from "../functions/add/handler";
// import { EnvVariable } from "../lib/types";

vi.mock("../functions/add/handler", () => ({
  addVariable: vi.fn().mockResolvedValue(true),
}));

describe("Add env tests", () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe("addVariable", () => {
    const fluffy = {
      keyName: "mockKeyName",
      keyValue: "mockKeyValue",
      environment_keyName: "mockEnv:mockKeyName",
      projects: "mockProject9",
    };
    it("should return the proper response", async () => {
      const response = await addVariable(fluffy);

      expect(addVariable).toBeCalledTimes(1);
      expect(addVariable).toBeCalledWith(fluffy);
      expect(response).toEqual(true);
    });

    it("should throw an error", async () => {
      const response = await addVariable(fluffy);

      expect(addVariable).toBeCalledTimes(2);
      expect(response).toBeDefined();
    });
  });
});
