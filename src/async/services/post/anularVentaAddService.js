import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const anularVentaAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/ventas/anular-venta`, payload);
};
export default anularVentaAddService;
