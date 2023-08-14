import { create } from "@storybook/theming/create";
import brandImage from "./storybook-logo.svg";

export default create({
  base: "dark",
  brandTitle: "Vastly",
  brandUrl: "https://vastly.is",
  brandTarget: "_self",
  brandImage,
});
