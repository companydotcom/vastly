import chalk from "chalk";
import createFetchMock from "vitest-fetch-mock";
import { defaultConfig } from "../../src/util/config/defaults";

const fetchMocker = createFetchMock(vi);
fetchMocker.enableMocks();

// Disable colors in `chalk` so that tests don't need
// to worry about ANSI codes
chalk.level = 0;

export const makeMockClient = (): any => {
  const stdin = vi.fn();
  const stdout = vi.fn();
  const stderr = vi.fn();
  const fetch = fetchMocker;
  const apiUrl = "https://my.api.com";
  const config = defaultConfig;
  const output = {
    spinner: {
      color: "",
      start: vi.fn(),
      fail: vi.fn(),
    },
    log: vi.fn(),
    print: vi.fn(),
    debug: vi.fn(),
    error: vi.fn(),
  };

  function reset() {
    vi.resetAllMocks();
    fetchMocker.doMock();
  }

  return {
    stdin,
    stdout,
    stderr,
    reset,
    fetch,
    config,
    apiUrl,
    output,
    prompt: vi.fn(),
  };
};

export const mockClient = makeMockClient() as any;

export type MockClient = ReturnType<typeof makeMockClient>;

beforeEach(() => {
  mockClient.reset();
});
