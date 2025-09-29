import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const buyAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/productos/buy`, payload);
};
export default buyAddService;
