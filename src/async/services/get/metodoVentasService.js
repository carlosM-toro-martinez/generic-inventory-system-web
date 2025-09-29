import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const metodoVentasService = async (idProducto) => {
  return await get(`${buildApiUri()}/v1/metodo-ventas/producto/${idProducto}`);
};
export default metodoVentasService;
