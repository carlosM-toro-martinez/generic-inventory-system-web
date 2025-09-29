import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const detalleCompraUpdateServices = async (idDetalleCompra, payload) => {
  return await put(`${buildApiUri()}/v1/detalle-compra/${idDetalleCompra}`, payload);
};
export default detalleCompraUpdateServices;
