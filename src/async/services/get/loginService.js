import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const loginService = async (token) => {
  return await get(`${buildApiUri()}/v1/login/token-status`, token);
};
export default loginService;
