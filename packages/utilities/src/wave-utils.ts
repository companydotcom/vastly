export interface WaveOptions {
  name?: string;
  accountId?: string;
  stage?: string;
}

export const defineConfig = (options: WaveOptions) => options;
