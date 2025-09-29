import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productosInventarioService = async (idProduct) => {
  return await get(`${buildApiUri()}/v1/productos/${idProduct}/inventarios`);
};
export default productosInventarioService;
