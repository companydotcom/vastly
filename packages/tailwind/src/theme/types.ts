import { ThemeConfig } from "tailwindcss/types/config";

/**
 * The theme object from Tailwind
 */
export type TailwindThemeConfig = Partial<ThemeConfig & { extend: Partial<ThemeConfig> }>;

/**
 * The Vastly Tailwind UI config.
 */
export type VastlyUIPluginConfig = {
  theme?: TailwindThemeConfig;
};
