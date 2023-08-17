export const getTokenFromBearer = (token: string) => {
  return token?.includes("Bearer") ? token?.split?.(" ")[1] : token;
};
