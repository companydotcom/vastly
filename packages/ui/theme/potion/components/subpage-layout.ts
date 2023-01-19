const parts = ["layout", "content", "logo", "header", "footer"];

const baseStyle = {
  layout: { minHeight: "100vh", backgroundColor: "gray.50" },
  content: {
    flexGrow: 1,
    px: 4,
    marginY: ["3rem", "5rem"],
  },
  header: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "full",
    minH: [14, "68px"],
    bgColor: "white",
    paddingLeft: [4, 10],
    shadow: "md",
  },
  logo: { maxH: [10, 12] },
  footer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: ["column", null, "row"],
    mt: "auto",
    width: "full",
    maxW: "5xl",
    mx: "auto",
    pb: [4, 8, 14],
    px: 4,
  },
};

export default {
  parts,
  baseStyle,
};
