import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const MoreSalesService = async () => {
  return await get(`${buildApiUri()}/v1/reportes/mas-vendidos`);
};
export default MoreSalesService;
