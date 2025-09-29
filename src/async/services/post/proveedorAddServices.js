import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const proveedorAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/proveedores`, payload);
};
export default proveedorAddService;
