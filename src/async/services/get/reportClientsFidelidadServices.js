import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportClientsFidelidadServices = async () => {
  return await get(`${buildApiUri()}/v1/reportes/ventas/clientes_por_puntos/`);
};
export default reportClientsFidelidadServices;
