import { validate } from "email-validator";
import login from "../src/commands/login";
import { mockClient } from "./mocks/client";
import doEmailLogin, { LoginResult } from "../src/util/login/email";
import executeLogin from "../src/util/login/execute-login";

describe("login", async () => {
  afterEach(() => {
    vi.resetAllMocks;
  });
  const validEmail = "abc123@gmail.com";
  it("should ask for a users email", async () => {
    const spy = vi.spyOn(mockClient, "prompt");
    // @ts-ignore
    await login(mockClient);

    expect(spy).toHaveBeenCalledWith([
      { message: "What is your email address?", name: "email", type: "text" },
    ]);
  });

  it("should validate a users email", async () => {
    expect(validate(validEmail)).toBe(true);

    expect(validate("some")).toBe(false);
  });

  it("should return an error when provided with an invalid email", async () => {
    const mockClient = {
      output: {
        spinner: {
          color: "",
          start: vi.fn(),
          fail: vi.fn(),
        },
        print: vi.fn(),
        error: vi.fn(),
      },
    };

    // @ts-ignore
    const result = await doEmailLogin(mockClient, "invalid-email");

    expect(result).toBe(1);
    expect(mockClient.output.error).toHaveBeenCalled();
  });
});

describe("executeLogin function", () => {
  const loginResultSuccess = {
    status: true,
    message: "Login successful",
  };

  beforeEach(() => {
    // reset the mock implementation of the fetch function before each test
    mockClient.fetch.mockReset();
  });

  it("should return login result on a successful login", async () => {
    // mock implementation of the fetch function to return successful response
    mockClient.fetch.mockResolvedValue(loginResultSuccess);

    const email = "test@example.com";
    // @ts-ignore
    const loginResult = await executeLogin(mockClient, email);

    expect(mockClient.fetch).toHaveBeenCalledWith(`${mockClient.apiUrl}/dev/onboarding/login`, {
      method: "POST",
      body: {
        email,
      },
    });
    expect(loginResult).toEqual(loginResultSuccess);
  });

  it("should throw an error on unsuccessful login", async () => {
    // mock implementation of the fetch function to throw an error
    mockClient.fetch.mockRejectedValue(new Error("Invalid email"));

    const email = "test@example.com";

    // @ts-ignore
    await expect(executeLogin(mockClient, email)).rejects.toThrow(
      "Unexpected error: Error: Invalid email",
    );
  });
});
