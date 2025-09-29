import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const clientesService = async () => {
  return await get(`${buildApiUri()}/v1/clientes`);
};
export default clientesService;
