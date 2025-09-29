import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const inventarioAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/inventario`, payload);
};
export default inventarioAddService;
