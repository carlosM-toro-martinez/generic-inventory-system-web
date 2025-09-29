import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const rolAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/rol`, payload);
};
export default rolAddService;
