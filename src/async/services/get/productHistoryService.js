import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const productHistoryService = async (id_product) => {
  return await get(
    `${buildApiUri()}/v1/reportes/producto/${id_product}/historial`
  );
};
export default productHistoryService;
