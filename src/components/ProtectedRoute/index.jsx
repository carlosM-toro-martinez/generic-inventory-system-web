import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { MainContext } from "../../context/MainContext";

const ProtectedRoute = ({ allowedPermissions = [] }) => {
  const { token, user, superAdmin } = useContext(MainContext);

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (superAdmin) {
    return <Outlet />;
  }
  if (user) {
    const userPermissions = user.rol.permisos.map((permiso) => permiso.nombre);

    const hasPermission = allowedPermissions.some((permiso) =>
      userPermissions.includes(permiso)
    );

    if (hasPermission) {
      return <Outlet />;
    } else {
      return <Navigate to="/" />;
    }
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
