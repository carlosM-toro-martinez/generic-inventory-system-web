import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const clientDeleteServices = async (idCliente) => {
  return await remove(`${buildApiUri()}/v1/clientes/${idCliente}`);
};
export default clientDeleteServices;
