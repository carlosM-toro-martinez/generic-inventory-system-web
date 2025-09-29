import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const permisosService = async () => {
  return await get(`${buildApiUri()}/v1/permisos`);
};
export default permisosService;
