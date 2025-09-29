import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  MenuItem,
  Select,
  Button,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import DrawerComponent from "../../DrawerComponent";
import cajaAllService from "../../../async/services/get/cajaAllService.js";
import reportCajasService from "../../../async/services/get/reportCajasService.js";
import TableCajasReport from "./TableCajaReport";

function ReportCajaComponent() {
  const [idInicio, setIdInicio] = useState(null);
  const [idFinal, setIdFinal] = useState(null);

  const { data: cajas, isLoading: isLoadingCajas } = useQuery(
    "cajas",
    cajaAllService
  );

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery(
    ["reporteCajas", idInicio, idFinal],
    () => reportCajasService(idInicio, idFinal),
    {
      enabled: false,
    }
  );

  const handleInicioChange = (event) => {
    setIdInicio(event.target.value);
  };

  const handleFinalChange = (event) => {
    setIdFinal(event.target.value);
  };

  const handleGenerateReport = () => {
    if (idInicio && idFinal) {
      fetchReport();
    }
  };

  return (
    <DrawerComponent>
      {!isLoadingCajas ? (
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
            Reporte de Cajas
          </Typography>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "5rem",
              alignItems: "center",
              marginTop: "3rem",
            }}
          >
            <FormControl style={{ width: "20rem" }}>
              <InputLabel id="select-inicio-label">Fecha de Inicio</InputLabel>
              <Select
                label="Fecha de Inicio"
                labelId="select-inicio-label"
                value={idInicio}
                onChange={handleInicioChange}
              >
                {cajas?.map((caja) => (
                  <MenuItem key={caja.id_caja} value={caja.id_caja}>
                    {new Date(caja.fecha_apertura).toLocaleDateString()}{" "}
                    {caja.trabajadorCierre.nombre},{" "}
                    {caja.movimientos[0]?.trabajadorMovimiento.nombre}{" "}
                    <span
                      style={{
                        color: caja.movimientos.length === 0 ? "green" : "red",
                      }}
                    >
                      {caja.movimientos.length === 0 ? "abierta" : "cerrada"}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleGenerateReport}
              disabled={!idInicio || !idFinal}
            >
              Generar Reporte
            </Button>

            <FormControl style={{ width: "20rem" }}>
              <InputLabel id="select-final-label">Fecha Final</InputLabel>
              <Select
                label="Fecha Final"
                labelId="select-final-label"
                value={idFinal}
                onChange={handleFinalChange}
              >
                {cajas?.map((caja) => (
                  <MenuItem key={caja.id_caja} value={caja.id_caja}>
                    {new Date(caja.fecha_apertura).toLocaleDateString()}{" "}
                    {caja.trabajadorCierre.nombre},{" "}
                    {caja.movimientos[0]?.trabajadorMovimiento.nombre}{" "}
                    <span
                      style={{
                        color: caja.movimientos.length === 0 ? "green" : "red",
                      }}
                    >
                      {caja.movimientos.length === 0 ? "abierta" : "cerrada"}
                    </span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {isLoadingReport ? (
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
            reportData && <TableCajasReport reportData={reportData} />
          )}
        </Box>
      ) : (
        <Box>Cargando cajas...</Box>
      )}
    </DrawerComponent>
  );
}

export default ReportCajaComponent;
