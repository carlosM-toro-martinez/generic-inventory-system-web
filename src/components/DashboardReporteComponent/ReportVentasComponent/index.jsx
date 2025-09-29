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
import ventasService from "../../../async/services/get/ventasService.js";
import reportVentasService from "../../../async/services/get/reportVentasService.js";
import TableVentasReport from "./TableVentasReport";
import VentasResumeTable from "./VentasResumeTable";
import SalesVsBuyReport from "./SalesVsBuyReport";

function ReportVentasComponent() {
  const [idInicio, setIdInicio] = useState(null);
  const [idFinal, setIdFinal] = useState(null);
  const [fechasAgrupadas, setFechasAgrupadas] = useState([]);
  const [modoResumen, setModoResumen] = useState("ventas");

  const { data: ventas, isLoading: isLoadingVentas } = useQuery(
    "ventas",
    ventasService
  );

  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
    error: reportError,
  } = useQuery(
    ["reporteVentas", idInicio, idFinal],
    () => reportVentasService(idInicio, idFinal),
    {
      enabled: false,
    }
  );

  const handleInicioChange = (event) => setIdInicio(event.target.value);
  const handleFinalChange = (event) => setIdFinal(event.target.value);
  const handleGenerateReport = () => {
    if (idInicio && idFinal) fetchReport();
  };

  useEffect(() => {
    if (ventas) {
      const agrupadosPorFecha = ventas.reduce((acc, venta) => {
        const fechaVenta = new Date(venta.fecha_venta).toLocaleDateString();
        if (!acc[fechaVenta]) {
          acc[fechaVenta] = {
            fecha: fechaVenta,
            primerosId: venta.id_venta,
            ultimosId: venta.id_venta,
          };
        } else {
          acc[fechaVenta].ultimosId = venta.id_venta;
        }
        return acc;
      }, {});
      setFechasAgrupadas(Object.values(agrupadosPorFecha));
    }
  }, [ventas]);

  return (
    <DrawerComponent>
      {!isLoadingVentas ? (
        <Box>
          <Typography
            component="h2"
            sx={{
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              mt: 2,
            }}
          >
            Reporte de ventas
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "2rem",
              alignItems: "center",
              mt: 4,
              flexWrap: "wrap",
            }}
          >
            <FormControl sx={{ width: "15rem" }}>
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

            <FormControl sx={{ width: "15rem" }}>
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

            <FormControl sx={{ width: "15rem" }}>
              <InputLabel id="modo-resumen-label">Modo Resumen</InputLabel>
              <Select
                label="Modo Resumen"
                labelId="modo-resumen-label"
                value={modoResumen}
                onChange={(e) => setModoResumen(e.target.value)}
              >
                <MenuItem value="ventas">Ver resumen por Ventas</MenuItem>
                <MenuItem value="productos">Ver resumen por Producto</MenuItem>
                <MenuItem value="utilidades">Ver utilidades</MenuItem>
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
          </Box>

          {isLoadingReport ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            reportData &&
            (modoResumen === "ventas" ? (
              <TableVentasReport reportData={reportData} />
            ) : modoResumen === "productos" ? (
              <VentasResumeTable data={reportData} />
            ) : (
              <SalesVsBuyReport data={reportData} />
            ))
          )}
        </Box>
      ) : (
        <Box>Cargando ventas...</Box>
      )}
    </DrawerComponent>
  );
}

export default ReportVentasComponent;
