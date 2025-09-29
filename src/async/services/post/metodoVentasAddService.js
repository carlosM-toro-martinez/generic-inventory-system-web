import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const metodoVentasAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/metodo-ventas`, payload);
};
export default metodoVentasAddService;
