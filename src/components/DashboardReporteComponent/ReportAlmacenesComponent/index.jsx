import React, { useState, useEffect } from "react";
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
import loteService from "../../../async/services/get/loteService.js";
import reportAlmacenesService from "../../../async/services/get/reportAlmacenesService.js";
import TableAlmacenesReport from "./TableAlmacenesReport";

function ReportAlmacenesComponent() {
  const [idInicio, setIdInicio] = useState(null);
  const [idFinal, setIdFinal] = useState(null);
  const [fechasAgrupadas, setFechasAgrupadas] = useState([]);

  const { data: lotes, isLoading: isLoadingLotes } = useQuery(
    "loteData",
    loteService
  );

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery(
    ["reporteAlmacenes", idInicio, idFinal],
    () => reportAlmacenesService(idInicio, idFinal),
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

  useEffect(() => {
    if (lotes) {
      const agrupadosPorFecha = lotes.reduce((acc, lote) => {
        const fechaIngreso = new Date(lote.fecha_ingreso).toLocaleDateString();
        if (!acc[fechaIngreso]) {
          acc[fechaIngreso] = {
            fecha: fechaIngreso,
            primerosId: lote.id_lote,
            ultimosId: lote.id_lote,
          };
        } else {
          acc[fechaIngreso].ultimosId = lote.id_lote;
        }
        return acc;
      }, {});

      const fechasTratadas = Object.values(agrupadosPorFecha);

      setFechasAgrupadas(fechasTratadas);
    }
  }, [lotes]);

  return (
    <DrawerComponent>
      {!isLoadingLotes ? (
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
            Reporte de compras
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
            <FormControl style={{ width: "15rem" }}>
              <InputLabel id="select-inicio-label">Fecha de Inicio</InputLabel>
              <Select
                label="Fecha de Inicio"
                labelId="select-inicio-label"
                value={idInicio}
                onChange={handleInicioChange}
              >
                {fechasAgrupadas?.map((fecha) => (
                  <MenuItem key={fecha.fecha} value={fecha.primerosId}>
                    {fecha.fecha}
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

            <FormControl style={{ width: "15rem" }}>
              <InputLabel id="select-final-label">Fecha Final</InputLabel>
              <Select
                label="Fecha Final"
                labelId="select-final-label"
                value={idFinal}
                onChange={handleFinalChange}
              >
                {fechasAgrupadas?.map((fecha) => (
                  <MenuItem key={fecha.fecha} value={fecha.ultimosId}>
                    {fecha.fecha}
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
            reportData && <TableAlmacenesReport reportData={reportData} />
          )}
        </Box>
      ) : (
        <Box>Cargando lotes...</Box>
      )}
    </DrawerComponent>
  );
}

export default ReportAlmacenesComponent;
