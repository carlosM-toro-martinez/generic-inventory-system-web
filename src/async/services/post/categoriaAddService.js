import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const categoriaAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/categorias`, payload);
};
export default categoriaAddService;
