import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const metodoVentaServices = async (idMetodo) => {
  return await remove(`${buildApiUri()}/v1/metodo-ventas/${idMetodo}`);
};
export default metodoVentaServices;
