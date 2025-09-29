import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const trabajadorAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/trabajadores`, payload);
};
export default trabajadorAddService;
