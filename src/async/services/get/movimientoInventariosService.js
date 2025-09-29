import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const movimientoInventariosService = async () => {
  return await get(`${buildApiUri()}/v1/movimiento-inventario`);
};
export default movimientoInventariosService;
