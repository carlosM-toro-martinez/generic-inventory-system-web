import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportClientsSalesServices = async (id_cliente) => {
  return await get(`${buildApiUri()}/v1/reportes/cliente/${id_cliente}/total`);
};
export default reportClientsSalesServices;
