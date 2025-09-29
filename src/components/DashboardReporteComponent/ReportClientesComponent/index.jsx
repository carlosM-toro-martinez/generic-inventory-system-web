import React, { useState } from "react";
import DrawerComponent from "../../DrawerComponent";
import { useQuery } from "react-query";
import {
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import TableClientsComponent from "./TableClientsComponent";
import reportClientsService from "../../../async/services/get/reportClientsServices";
import reportClientsFidelidadServices from "../../../async/services/get/reportClientsFidelidadServices";
import TableClientesPorFidelidad from "./TableClientesPorFidelidad";
import TableClientsSalesTotal from "./TableClientsSalesTotal";
import TableClientsSalesResume from "./TableClientsSalesResume";

function ReportClientesComponent() {
  const [selectedReport, setSelectedReport] = useState(null); // Estado para controlar qué tabla mostrar

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
  } = useQuery(
    ["reporteClientes"],
    () => reportClientsService(),
    {
      enabled: false,
    }
  );

  const {
    data: reportDataClients,
    refetch: fetchReportClients,
    isLoading: isLoadingReportClients,
  } = useQuery(
    ["reporteClientesFidelidad"],
    () => reportClientsFidelidadServices(),
    {
      enabled: false,
    }
  );

  const handleGenerateReport = () => {
    setSelectedReport("clientes");
    fetchReport();
  };

  const handleGenerateReportForFidelidad = () => {
    setSelectedReport("fidelidad");
    fetchReportClients();
  };

  const handleGenerateSalesTotal = () => {
    setSelectedReport("salesTotal");
  };

  const handleGenerateSalesResume = () => {
    setSelectedReport("salesResume");
  };

  return (
    <DrawerComponent>
      <Box>
        <Typography
          component={"h2"}
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold",
            margin: "1rem 0 0 0",
          }}
        >
          Reporte de clientes
        </Typography>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "2rem",
            alignItems: "center",
            marginTop: "3rem",
            marginBottom: "3rem",
          }}
        >
          <Button
            variant="contained"
            color={selectedReport === "clientes" ? "primary" : "inherit"}
            onClick={handleGenerateReport}
            style={{
              backgroundColor: selectedReport === "clientes" ? "#1976d2" : "#e0e0e0",
              color: selectedReport === "clientes" ? "#fff" : "#000",
            }}
          >
            Por monto económico
          </Button>
          <Button
            variant="contained"
            color={selectedReport === "fidelidad" ? "primary" : "inherit"}
            onClick={handleGenerateReportForFidelidad}
            style={{
              backgroundColor: selectedReport === "fidelidad" ? "#1976d2" : "#e0e0e0",
              color: selectedReport === "fidelidad" ? "#fff" : "#000",
            }}
          >
            Por cantidad de compras
          </Button>
          <Button
            variant="contained"
            color={selectedReport === "salesTotal" ? "primary" : "inherit"}
            onClick={handleGenerateSalesTotal}
            style={{
              backgroundColor: selectedReport === "salesTotal" ? "#1976d2" : "#e0e0e0",
              color: selectedReport === "salesTotal" ? "#fff" : "#000",
            }}
          >
            Ventas Totales
          </Button>
          <Button
            variant="contained"
            color={selectedReport === "salesResume" ? "primary" : "inherit"}
            onClick={handleGenerateSalesResume}
            style={{
              backgroundColor: selectedReport === "salesResume" ? "#1976d2" : "#e0e0e0",
              color: selectedReport === "salesResume" ? "#fff" : "#000",
            }}
          >
            Resumen de Ventas
          </Button>
        </Box>

        {/* Mostrar tabla según el reporte seleccionado */}
        {selectedReport === "clientes" && (
          isLoadingReport ? (
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            reportData && <TableClientsComponent data={reportData} />
          )
        )}

        {selectedReport === "fidelidad" && (
          isLoadingReportClients ? (
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            reportDataClients && <TableClientesPorFidelidad data={reportDataClients} />
          )
        )}

        {selectedReport === "salesTotal" && (
          <TableClientsSalesTotal />
        )}

        {selectedReport === "salesResume" && (
          <TableClientsSalesResume />
        )}
      </Box>
    </DrawerComponent>
  );
}

export default ReportClientesComponent;
