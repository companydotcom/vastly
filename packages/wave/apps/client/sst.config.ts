import { SSTConfig } from "sst";
import { NextjsSite } from "sst/constructs";
import WAVE_CONFIG from "../../wave.config";

export default {
  config(_input) {
    return {
      name: WAVE_CONFIG.name,
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const site = new NextjsSite(stack, "site", {
        customDomain: {
          // this terinary will likely change depending on the --account input
          domainName: stack.stage.includes("prod")
            ? `${WAVE_CONFIG.name}.${WAVE_CONFIG.hostedZone}`
            : `${WAVE_CONFIG.name}-${stack.stage}.${WAVE_CONFIG.hostedZone}`,
          hostedZone: WAVE_CONFIG.hostedZone,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
