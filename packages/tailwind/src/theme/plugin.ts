import plugin from "tailwindcss/plugin";
import { animations } from "./animations";

const corePlugin = () => {
  return plugin(
    ({ addBase, addUtilities, addVariant }) => {},
    // extend the colors config
    {
      theme: {
        extend: {
          ...animations,
        },
      },
    },
  );
};

export const vastlyui = (config: any): ReturnType<typeof plugin> => {
  return corePlugin();
};
