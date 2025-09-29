import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const categoriasService = async () => {
  return await get(`${buildApiUri()}/v1/categorias`);
};
export default categoriasService;
