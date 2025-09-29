import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const salidaInventarioAddService = async (payload) => {
  return await post(
    `${buildApiUri()}/v1/ventas/movimiento-inventario`,
    payload
  );
};
export default salidaInventarioAddService;
