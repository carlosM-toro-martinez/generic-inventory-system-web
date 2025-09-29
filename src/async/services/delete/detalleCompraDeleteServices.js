import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const detalleCompraDeleteServices = async (idDetalle, payload) => {
  return await remove(`${buildApiUri()}/v1/detalle-compra/${idDetalle}`, payload);
};
export default detalleCompraDeleteServices;
