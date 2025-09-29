import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportClientsSalesResumeServices = async (id_cliente) => {
  return await get(`${buildApiUri()}/v1/reportes/ventas/cliente/${id_cliente}`);
};
export default reportClientsSalesResumeServices;
