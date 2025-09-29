import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const moveCashAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/movimiento-caja`, payload);
};
export default moveCashAddService;
