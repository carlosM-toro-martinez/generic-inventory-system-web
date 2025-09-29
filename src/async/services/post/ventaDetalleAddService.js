import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ventaDetalleAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/ventas/procesar-venta`, payload);
};
export default ventaDetalleAddService;
