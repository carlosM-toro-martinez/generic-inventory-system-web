import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const trabajadoresService = async () => {
  return await get(`${buildApiUri()}/v1/trabajadores`);
};
export default trabajadoresService;
