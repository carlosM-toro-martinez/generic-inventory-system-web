import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const loteAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/lote`, payload);
};
export default loteAddService;
