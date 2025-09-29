import React, { useContext, useEffect } from "react";
import DrawerComponent from "../../../components/DrawerComponent";
import { useQuery } from "react-query";
import productosService from "../../../async/services/get/productosService";
import DashboardVentaComponent from "../../../components/DashboardVentaComponent";
import { Paper, Typography } from "@mui/material";
import clientesService from "../../../async/services/get/clientesService";
import { MainContext } from "../../../context/MainContext.js";
import productosLotesService from "../../../async/services/get/productosLotesService.js";
import inventarioService from "../../../async/services/get/inventarioService.js";
import { Navigate, Outlet, useNavigate } from "react-router-dom";

function CreateVenta({ movimientoInventario }) {
  const { data, isLoading, error, refetch, openCaja, user } =
    useContext(MainContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);
  if (!openCaja) {
    return <Navigate to="/movimiento-caja" />;
  }

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useQuery(`products-inventario`, inventarioService);

  const {
    data: clientsData,
    isLoading: isLoadingClient,
    error: errorCliente,
    refetch: refetchClients,
  } = useQuery(`clients`, clientesService);

  if (isLoadingProducts || isLoadingClient) {
    return (
      <DrawerComponent>
        <Paper
          elevation={3}
          style={{
            padding: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "1rem",
          }}
        >
          <Typography>Cargando datos...</Typography>
        </Paper>
      </DrawerComponent>
    );
  }

  if (errorProducts || errorCliente) {
    return (
      <DrawerComponent>
        <Paper
          elevation={3}
          style={{
            padding: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "1rem",
          }}
        >
          <Typography>
            Error al cargar los datos. Por favor, intenta de nuevo.
          </Typography>
        </Paper>
      </DrawerComponent>
    );
  }

  if (clientsData && productsData) {
    return (
      <DrawerComponent>
        <Paper
          elevation={3}
          style={{
            padding: "1rem",
            backgroundColor: "#fff",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            marginTop: "1rem",
          }}
        >
          <DashboardVentaComponent
            products={productsData}
            refetchProducts={refetchProducts}
            clients={clientsData}
            refetchClients={refetchClients}
            caja={data}
            refetchCaja={refetch}
            movimientoInventario={movimientoInventario}
          />
        </Paper>
      </DrawerComponent>
    );
  }

  return (
    <DrawerComponent>
      <Paper
        elevation={3}
        style={{
          padding: "1rem",
          backgroundColor: "#fff",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          marginTop: "1rem",
        }}
      >
        <Typography>No hay datos disponibles.</Typography>
      </Paper>
    </DrawerComponent>
  );
}

export default CreateVenta;
