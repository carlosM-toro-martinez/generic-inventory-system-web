import { post } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const loginAddService = async (payload) => {
  return await post(`${buildApiUri()}/v1/login/login`, payload);
};
export default loginAddService;
