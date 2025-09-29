import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productoDeleteServices = async (idProduct) => {
  return await remove(`${buildApiUri()}/v1/productos/${idProduct}`);
};
export default productoDeleteServices;
