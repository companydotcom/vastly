const parts = ["activeStep", "inactiveStep", "container", "label"];

function getDefaults(props: Record<string, any>) {
  const { inactiveColor: ic, activeColor: ac } = props;
  return {
    inactiveColor: ic || "gray.300",
    activeColor: ac || "blackAlpha.800",
  };
}

const baseStyle = (props: Record<string, any>) => {
  const { activeColor, inactiveColor } = getDefaults(props);

  return {
    label: {
      color: "black",
    },
    activeStep: {
      color: activeColor,
      backgroundColor: activeColor,
    },
    inactiveStep: {
      color: inactiveColor,
      backgroundColor: inactiveColor,
    },
    container: {
      alignItems: "flex-end",
    },
  };
};

const defaultProps = {
  activeColor: "blue.500",
  inactiveColor: "blue.100",
};

export default {
  defaultProps,
  baseStyle,
  parts,
};
