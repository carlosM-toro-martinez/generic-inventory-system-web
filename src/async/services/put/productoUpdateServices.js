import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productoUpdateServices = async (idProducto, payload) => {
  return await put(`${buildApiUri()}/v1/productos/${idProducto}`, payload);
};
export default productoUpdateServices;
