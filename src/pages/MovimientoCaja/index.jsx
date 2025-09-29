import React, { useContext } from "react";
import DrawerComponent from "../../components/DrawerComponent";
import DashboardCajaComponent from "../../components/DashboardCajaComponent";
import { MainContext } from "../../context/MainContext";
import { useQuery } from "react-query";
import cajaService from "../../async/services/get/cajaService";
import { CircularProgress } from "@mui/material";

function MovimientoCaja() {
  const { data, isLoading, error, refetch } = useContext(MainContext);

  return (
    <>
      <DrawerComponent>
        {!isLoading ? (
          <DashboardCajaComponent
            caja={data?.caja?.fecha_cierre ? null : data}
            refetch={refetch}
          />
        ) : (
          <CircularProgress color="inherit" />
        )}
      </DrawerComponent>
    </>
  );
}

export default MovimientoCaja;
