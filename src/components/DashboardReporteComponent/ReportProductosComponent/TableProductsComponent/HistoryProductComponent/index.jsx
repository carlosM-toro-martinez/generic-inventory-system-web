import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function HistoryProductComponent({ history, producto }) {
  const { historial } = history;

  const formatDate = (dateString) => {
    return format(new Date(dateString), "PPpp", { locale: es });
  };

  return (
    <Box sx={{ width: "100%", mt: 2 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{ textTransform: "uppercase", fontWeight: "bold" }}
      >
        {[
          producto?.nombre,
          producto?.concentracion,
          producto?.forma_farmaceutica,
        ]
          .filter(Boolean)
          .join(" ")}

        {producto?.subCantidad !== null && (
          <Box component="span" sx={{ color: "green", ml: 1 }}>
            <strong>{`${producto.subCantidad} unidades actualmente en almacen`}</strong>
          </Box>
        )}
      </Typography>

      <Grid container spacing={2}>
        {historial.map((item, index) => {
          let color = "";
          let title = "";

          if (item.tipo === "compra") {
            color = "green";
            title = "COMPRA";
          } else if (item.tipo === "venta") {
            color = "red";
            title = "VENTA";
          } else if (item.tipo === "movimiento") {
            color = "#1976d2";
            title = item.tipo_movimiento?.toUpperCase() || "MOVIMIENTO";
          }

          return (
            <Grid item xs={12} key={index}>
              <Card
                variant="outlined"
                sx={{
                  borderLeft: `6px solid ${color}`,
                  boxShadow: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.01)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle2"
                    color={color}
                    fontWeight="bold"
                  >
                    {title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(item.fecha)}
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {item.trabajador?.nombre && (
                    <Typography variant="body1">
                      <strong>Trabajador:</strong> {item.trabajador.nombre}
                    </Typography>
                  )}

                  {item.tipo === "compra" && (
                    <Typography variant="body1">
                      <strong>Proveedor:</strong> {item.proveedor?.nombre}
                    </Typography>
                  )}

                  {item.tipo === "venta" && (
                    <Typography variant="body1">
                      <strong>Cliente:</strong> {item.cliente?.nombre}
                    </Typography>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Typography variant="body2">
                    <strong>Cantidad:</strong> {item.detalle?.subCantidad}
                  </Typography>

                  {item.detalle?.peso !== null && (
                    <Typography variant="body2">
                      <strong>Peso:</strong> {item.detalle.peso}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default HistoryProductComponent;
