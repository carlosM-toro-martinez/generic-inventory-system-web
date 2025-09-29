import React from "react";
import DrawerComponent from "../../components/DrawerComponent";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import clientesService from "../../async/services/get/clientesService";
import DashboardClientesComponent from "../../components/DashboardClientesComponent";

function Clientes() {
  const {
    data: clientsData,
    isLoading: isLoadingClient,
    error: errorCliente,
    refetch: refetchClients,
  } = useQuery(`clients`, clientesService);

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/clientes/crear");
  };

  if (isLoadingClient) {
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

  if (errorCliente) {
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

  if (clientsData) {
    return (
      <DrawerComponent>
        <Box
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            marginTop: "2rem",
          }}
        >
          Clientes
        </Box>
        <DashboardClientesComponent
          clients={clientsData}
          refetchClients={refetchClients}
        />
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

export default Clientes;
