import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const proveedoresService = async () => {
  return await get(`${buildApiUri()}/v1/proveedores`);
};
export default proveedoresService;
