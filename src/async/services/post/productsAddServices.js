import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productsAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/productos`, payload);
};
export default productsAddService;
