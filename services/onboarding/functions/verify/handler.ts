export const handler = async (event) => {
  console.log("👾 ~ handler ~ event:", event);
  return {
    ping: "pong",
  };
};
