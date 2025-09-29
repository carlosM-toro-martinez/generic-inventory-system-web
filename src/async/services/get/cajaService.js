import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const cajaService = async () => {
  return await get(`${buildApiUri()}/v1/caja`);
};
export default cajaService;
