import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cajaOpenAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/caja/abrir`, payload);
};
export default cajaOpenAddService;
