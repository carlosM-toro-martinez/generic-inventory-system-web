import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productosService = async () => {
  return await get(`${buildApiUri()}/v1/productos`);
};
export default productosService;
