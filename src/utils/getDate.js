export const getLocalDateTime = () => {
  const now = new Date();
  return now.toLocaleString("en-CA", { hour12: false }).replace(", ", " ");
};
