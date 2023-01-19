import * as React from "react";

import {
  Center,
  Spinner,
  Box,
  HTMLChakraProps,
  useStyleConfig,
  Text,
  SpinnerProps,
} from "@chakra-ui/react";
import { Global, keyframes } from "@emotion/react";
import { isEmptyObject } from "../../utils";

export interface AppSpinnerProps extends SpinnerProps {
  /** Optional line of text that appears below the spinner */
  description?: string;
  containerStyles?: HTMLChakraProps<"div">;
}

export const AppSpinner: React.FC<AppSpinnerProps> = props => {
  const { className, containerStyles, description, ...rest } = props;
  const styles = useStyleConfig("AppSpinner", { ...rest });

  return (
    <Center className={className || "app-spinner"} flexDirection="column" {...containerStyles}>
      {isEmptyObject(styles) ? (
        <>
          <UnThemedSpinner sx={styles} {...rest} />
          {description && <Text>{description}</Text>}
        </>
      ) : (
        <>
          <Spinner sx={styles} {...rest} />
          {description && <Text mt={2}>{description}</Text>}
        </>
      )}
    </Center>
  );
};

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const UnThemedSpinner = () => (
  <>
    <Global
      styles={{
        "*": { boxSizing: "border-box" },
        body: { margin: 0, minHeight: "100%", width: "100%" },
      }}
    />

    <Box
      sx={{
        display: "inline-block",
        borderTop: "4px solid currentcolor",
        borderRight: "4px solid currentcolor",
        borderBottomStyle: "solid",
        borderLeftStyle: "solid",
        borderRadius: "99999px",
        borderBottomWidth: "4px",
        borderLeftWidth: "4px",
        borderBottomColor: "#E2E8F0",
        borderLeftColor: "#E2E8F0",
        animation: `0.65s linear 0s infinite normal none running ${spin}`,
        width: "3rem",
        height: "3rem",
        color: "#A0AEC0",
      }}
    >
      <Box
        as="span"
        sx={{
          border: "0px",
          clip: "rect(0px, 0px, 0px, 0px)",
          height: "1px",
          width: "1px",
          margin: "-1px",
          padding: "0px",
          overflow: "hidden",
          whiteSpace: "nowrap",
          position: "absolute",
        }}
      >
        Loading...
      </Box>
    </Box>
  </>
);
