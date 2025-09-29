import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const moveInventarioAddServices = async (payload) => {
  return await post(`${buildApiUri()}/v1/movimiento-inventario`, payload);
};
export default moveInventarioAddServices;
