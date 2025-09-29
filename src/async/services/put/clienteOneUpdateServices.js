import { put } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const clienteOneUpdateServices = async (idCliente, payload) => {
  return await put(`${buildApiUri()}/v1/clientes/${idCliente}`, payload);
};
export default clienteOneUpdateServices;
