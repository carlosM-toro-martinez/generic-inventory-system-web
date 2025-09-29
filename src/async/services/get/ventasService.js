import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ventasService = async () => {
  return await get(`${buildApiUri()}/v1/ventas`);
};
export default ventasService;
