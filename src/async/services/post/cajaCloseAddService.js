import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cajaCloseAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/caja/cerrar`, payload);
};
export default cajaCloseAddService;
