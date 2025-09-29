import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const detalleCompraAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/detalle-compra`, payload);
};
export default detalleCompraAddService;
