import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportProveedoresServices = async () => {
  return await get(`${buildApiUri()}/v1/reportes/almacenes/compras/1`);
};
export default reportProveedoresServices;
