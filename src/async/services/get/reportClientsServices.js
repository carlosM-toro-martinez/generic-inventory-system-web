import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportClientsService = async () => {
  return await get(`${buildApiUri()}/v1/reportes/ventas/clientes/`);
};
export default reportClientsService;
