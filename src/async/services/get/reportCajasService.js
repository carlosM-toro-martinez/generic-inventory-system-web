import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportCajasService = async (idInicio, idFinal) => {
  return await get(`${buildApiUri()}/v1/reportes/caja/${idInicio}/${idFinal}`);
};
export default reportCajasService;
