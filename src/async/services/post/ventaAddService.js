import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ventaAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/ventas/registrar-venta`, payload);
};
export default ventaAddService;
