// async/services/post/ventaCompletaService.js
import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";
export const ventaCompletaService = async ({
  ventaData,
  detalles,
  id_caja,
  denominaciones,
}) => {
  const payload = { ventaData, detalles, id_caja, denominaciones };
  return post(`${buildApiUri()}/v1/ventas/venta-completa`, payload);
};

export default ventaCompletaService;
