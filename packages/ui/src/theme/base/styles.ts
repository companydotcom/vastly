import { Styles } from "@chakra-ui/theme-tools"

const styles: Styles = {
  global: () => ({
    body: {
      fontFamily: "body",
      color: "gray.800",
      bg: "white",
      transitionProperty: "background-color",
      transitionDuration: "normal",
      lineHeight: "base",
      overflow: "auto",
    },
    "*::placeholder": {
      color: "gray.400",
    },
    "*, *::before, &::after": {
      borderColor: "gray.200",
      wordWrap: "break-word",
    },
    ".no-bg-scrollbar": {
      scrollbarColor: "rgba(0, 0, 0, 0.2) transparent",
    },
    ".no-bg-scrollbar::-webkit-scrollbar, .no-bg-scrollbar::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
    ".no-bg-scrollbar:hover::-webkit-scrollbar-thumb, .no-bg-scrollbar:focus::-webkit-scrollbar-thumb, .no-bg-scrollbar:focus-within::-webkit-scrollbar-thumb, .no-bg-scrollbar:active::-webkit-scrollbar-thumb":
      {
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        border: "4px solid transparent",
        backgroundClip: "content-box",
        borderRadius: "10px",
      },
    ".no-bg-scrollbar::-webkit-scrollbar-thumb:hover, .no-bg-scrollbar::-webkit-scrollbar-thumb:active":
      {
        backgroundColor: "rgba(0, 0, 0, 0.35) !important",
      },
  }),
}

export default styles
