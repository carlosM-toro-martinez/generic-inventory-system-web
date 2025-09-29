import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productoOneUpdateServices = async (idProducto, payload) => {
  return await put(
    `${buildApiUri()}/v1/productos/updateOne/${idProducto}`,
    payload
  );
};
export default productoOneUpdateServices;
