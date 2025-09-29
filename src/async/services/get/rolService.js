import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const rolService = async () => {
  return await get(`${buildApiUri()}/v1/rol`);
};
export default rolService;
