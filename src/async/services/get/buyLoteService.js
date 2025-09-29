import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const buyLoteService = async (numLote) => {
  return await get(`${buildApiUri()}/v1/detalle-compra/${numLote}`);
};
export default buyLoteService;
//condensada 14  gloria 24
