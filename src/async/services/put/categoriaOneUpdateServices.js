import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const categoriaOneUpdateServices = async (idCategorie, payload) => {
  return await put(`${buildApiUri()}/v1/categorias/${idCategorie}`, payload);
};
export default categoriaOneUpdateServices;
