import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";

const helpers = createMultiStyleConfigHelpers(["container", "header", "title", "day", "navIcon"]);

export const DatePicker = helpers.defineMultiStyleConfig({
  baseStyle: ({ colorScheme: c }) => ({
    container: {
      border: "1px solid",
      borderColor: "gray.100",
      shadow: "md",
    },
    header: {
      backgroundColor: "white",
      borderBottom: "none",
    },
    title: {
      fontWeight: "bold",
    },
    day: {
      _selected: {
        backgroundColor: `${c}.500`,
        _hover: {
          backgroundColor: `${c}.600`,
        },
      },
    },
    navIcon: { color: "black" },
  }),
  sizes: {
    sm: {
      title: { fontSize: "md" },
      day: { width: "1.7rem", lineHeight: "1.7rem" },
    },
    md: {
      title: { fontSize: "lg" },
      day: { width: "2.625rem", lineHeight: "2.625rem", fontSize: "lg" },
    },
  },
  defaultProps: {
    size: "sm",
    colorScheme: "blue",
  },
});
