import { remove } from "../../api";
import buildApiUri from "../../utils/buildApiUri";

const trabajadorDeleteServices = async (idTrabajador) => {
  return await remove(`${buildApiUri()}/v1/trabajadores/${idTrabajador}`);
};
export default trabajadorDeleteServices;
