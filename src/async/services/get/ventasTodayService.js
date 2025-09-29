import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const ventasTodayService = async () => {
  return await get(`${buildApiUri()}/v1/ventas/hoy`);
};
export default ventasTodayService;
