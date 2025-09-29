import React, { useContext } from "react";
import DrawerComponent from "../../../components/DrawerComponent";
import { useQuery } from "react-query";
import { Paper } from "@mui/material";
import permisosService from "../../../async/services/get/permisosService.js";
import rolService from "../../../async/services/get/rolService.js";
import { MainContext } from "../../../context/MainContext.js";
import DashboardTrabajadoresComponent from "../../../components/DashboardTrabajadoresComponent/index.jsx";

function CreateTrabajadores() {
  const {
    data: permisosData,
    isLoading: isLoadingPermiso,
    error: errorPermiso,
    refetch: refetchPermisos,
  } = useQuery(`permisos`, permisosService);

  const {
    data: rolData,
    isLoading: isLoadingRol,
    error: errorRol,
    refetch: refetchRol,
  } = useQuery(`rol`, rolService);

  return (
    <DrawerComponent>
      {!isLoadingPermiso && !isLoadingRol && (
        <Paper
          elevation={3}
          style={{
            padding: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "1rem",
          }}
        >
          <DashboardTrabajadoresComponent
            permisos={permisosData}
            refetchPermisos={refetchPermisos}
            rol={rolData}
            refetchRol={refetchRol}
          />
        </Paper>
      )}
    </DrawerComponent>
  );
}

export default CreateTrabajadores;
