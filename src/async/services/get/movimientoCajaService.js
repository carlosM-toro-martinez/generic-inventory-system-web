import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const movimientoCajaService = async () => {
  return await get(`${buildApiUri()}/v1/detalle-compra`);
};
export default movimientoCajaService;
