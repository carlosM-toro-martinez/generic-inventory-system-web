import { get } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const reportVentasService = async (idInicio, idFinal) => {
  console.log(`${buildApiUri()}/v1/reportes/ventas/${idInicio}/${idFinal}`);

  return await get(
    `${buildApiUri()}/v1/reportes/ventas/${idInicio}/${idFinal}`
  );
};
export default reportVentasService;
