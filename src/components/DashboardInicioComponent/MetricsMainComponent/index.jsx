import React, { useState, useMemo } from "react";
import { useQuery } from "react-query";
import topLoteService from "../../../async/services/get/topLoteService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Chip,
} from "@mui/material";
import { differenceInDays, format } from "date-fns";

function getColorByDays(daysLeft) {
  if (daysLeft <= 0) return "#ff4d4d"; // Rojo
  if (daysLeft <= 30) return "#ff944d"; // Naranja
  if (daysLeft <= 100) return "#ffd633"; // Amarillo
  return "#66cc66"; // Verde
}

const filterOptions = [
  { label: "Todos", value: "all" },
  { label: "Caducados", value: "expired" },
  { label: "Menos de 30 días", value: "30" },
  { label: "Menos de 90 días", value: "90" },
  { label: "Más de 90 días", value: "more" },
];

function MetricsMainComponent() {
  const { data, isLoading } = useQuery("metrics_lote", topLoteService);
  const [filter, setFilter] = useState("all");

  const today = new Date();

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data
      .map((lote) => {
        const caducidad = new Date(lote.fecha_caducidad);
        const daysLeft = differenceInDays(caducidad, today);
        return { ...lote, daysLeft, caducidad };
      })
      .filter(({ daysLeft }) => {
        switch (filter) {
          case "expired":
            return daysLeft <= 0;
          case "30":
            return daysLeft > 0 && daysLeft <= 30;
          case "90":
            return daysLeft > 30 && daysLeft <= 90;
          case "more":
            return daysLeft > 90;
          default:
            return true;
        }
      })
      .sort((a, b) => a.caducidad - b.caducidad);
  }, [data, filter]);

  const expiringCount = filteredData.filter(
    (item) => item.daysLeft <= 30 && item.daysLeft > 0
  ).length;

  if (isLoading) return <Typography>Cargando datos...</Typography>;
  if (!data) return <Typography>No hay datos disponibles.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        Productos por caducar
      </Typography>

      <FormControl sx={{ minWidth: 200, mb: 2 }}>
        <Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          {filterOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        Productos por vencer en los próximos 30 días:{" "}
        <Chip label={expiringCount} color="warning" />
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Producto</strong>
              </TableCell>
              <TableCell align="right">
                <strong>Cantidad</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Fecha de caducidad</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Días restantes</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Estado</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((lote) => {
              const { daysLeft, caducidad, producto } = lote;
              const color = getColorByDays(daysLeft);

              // Buscar el inventario correspondiente al lote actual
              const inventarioDelLote = producto.inventarios.find(
                (inv) => inv.id_lote === lote.id_lote
              );

              // Obtener la cantidad o mostrar "0" si no se encuentra
              const cantidadStock = inventarioDelLote
                ? inventarioDelLote.cantidad
                : 0;

              return (
                <TableRow key={lote.id_lote}>
                  <TableCell
                    sx={{ textTransform: "capitalize", fontWeight: "bold" }}
                  >
                    {producto.nombre}
                  </TableCell>
                  <TableCell align="right">{cantidadStock}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: "bold" }}>
                    {format(caducidad, "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ backgroundColor: color, fontWeight: "bold" }}
                  >
                    {daysLeft <= 0 ? "Caducado" : `${daysLeft} días`}
                  </TableCell>
                  <TableCell align="center">
                    {daysLeft <= 0 ? (
                      <Chip label="Caducado" color="error" />
                    ) : daysLeft <= 30 ? (
                      <Chip label="Por vencer" color="warning" />
                    ) : (
                      <Chip label="Vigente" color="success" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MetricsMainComponent;
