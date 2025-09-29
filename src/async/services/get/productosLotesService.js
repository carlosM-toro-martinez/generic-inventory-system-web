import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productosLotesService = async () => {
  return await get(`${buildApiUri()}/v1/lote`);
};
export default productosLotesService;
