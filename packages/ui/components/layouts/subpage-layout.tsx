import React, { ReactNode } from "react";
import {
  Flex,
  Image,
  Stack,
  useMultiStyleConfig,
  useStyles,
  StylesProvider,
  Box,
  FlexProps,
} from "@chakra-ui/react";
import { Maybe } from "@companydotcom/types";

export const SubpageLayout: React.FC<FlexProps> = props => {
  const { children, ...rest } = props;
  const styles = useMultiStyleConfig("SubpageLayout", props);

  const rootStyles = {
    flexDirection: "column",
    ...styles.layout,
  };

  return (
    <StylesProvider value={styles}>
      <Flex
        width="100%"
        flexDirection="column"
        className="subpageLayout__container"
        sx={rootStyles}
        {...rest}
      >
        {children}
      </Flex>
    </StylesProvider>
  );
};

export const SubpageContent: React.FC<FlexProps> = ({ children, ...rest }) => {
  const styles = useStyles();

  const contentStyles = {
    flexDirection: "column",
    ...styles.content,
  };

  return (
    <Flex as="main" className="subpageLayout__content" {...rest} sx={contentStyles}>
      {children}
    </Flex>
  );
};

export const SubpageHeader: React.FC<{ logo?: any }> = ({ logo }) => {
  const styles = useStyles();
  return (
    <Flex as="header" className="subpageLayout__header" sx={styles.header}>
      <Image
        src={logo ?? ""}
        alt="logo"
        fallback={<Box height={[14, "68px"]} />}
        sx={styles.logo}
      />
    </Flex>
  );
};

export const SubpageFooter: React.FC<{
  children: ReactNode;
  footerLogo?: Maybe<string>;
}> = ({ children, footerLogo }) => {
  const styles = useStyles();

  return (
    <Stack as="footer" className="subpageLayout__footer" sx={styles.footer}>
      <Image src={footerLogo ?? ""} alt="footer logo" maxHeight={["34px"]} mb={[6, null, "0px"]} />
      <Stack direction={["column-reverse", null, "row"]} spacing={[1, 3]} alignItems="center">
        {children}
      </Stack>
    </Stack>
  );
};
