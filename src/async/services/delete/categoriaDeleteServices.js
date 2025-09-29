import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const categoriaDeleteServices = async (idCategorie) => {
  return await remove(`${buildApiUri()}/v1/categorias/${idCategorie}`);
};
export default categoriaDeleteServices;
