import React from "react";
import { DocsThemeConfig } from "nextra-theme-docs";

// For more information on doc theme config, see: https://nextra.site/docs/docs-theme/start

const config: DocsThemeConfig = {
  logo: <span>Company.com Docs</span>,
  project: {
    link: "https://github.com/companydotcom/wave",
  },
  chat: {
    link: "https://discord.com",
  },
  docsRepositoryBase: "https://github.com/companydotcom/wave/tree/main/apps/docs",
  footer: {
    text: "Company.com Docs",
  },
};

export default config;
