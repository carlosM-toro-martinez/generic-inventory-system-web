import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const clienteAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/clientes`, payload);
};
export default clienteAddService;
