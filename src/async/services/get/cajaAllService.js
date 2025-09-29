import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cajaAllService = async () => {
  return await get(`${buildApiUri()}/v1/caja/all`);
};
export default cajaAllService;
