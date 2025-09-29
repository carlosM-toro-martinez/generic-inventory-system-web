import getEnvVariables from "../../config/config";

const buildApiUri = () => {
  const { miniMarketApiServer, miniMarketApiServerService } = getEnvVariables();
  return `${miniMarketApiServer}/${miniMarketApiServerService}`;
};
export default buildApiUri;
