import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const topLoteService = async () => {
  return await get(`${buildApiUri()}/v1/lote/proximos_vencidos`);
};
export default topLoteService;
