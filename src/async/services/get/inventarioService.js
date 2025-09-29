import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const inventarioService = async () => {
  return await get(`${buildApiUri()}/v1/inventario`);
};
export default inventarioService;
