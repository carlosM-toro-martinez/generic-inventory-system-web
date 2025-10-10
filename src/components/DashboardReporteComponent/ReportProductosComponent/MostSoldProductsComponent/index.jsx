import React from "react";
import { useQuery } from "react-query";
import MoreSalesService from "../../../../async/services/get/MoreSalesService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Button,
} from "@mui/material";
import { ShoppingCart } from "@mui/icons-material";

function MostSoldProductsComponent() {
  const { data, isLoading, isError } = useQuery(
    "mostSoldProducts",
    MoreSalesService
  );

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ mt: 5, textAlign: "center" }}>
        Ocurrió un error al cargar los productos más vendidos.
      </Typography>
    );
  }

  const productos = data?.productos ?? [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Productos más vendidos
      </Typography>

      <Grid container spacing={2}>
        {productos.map((producto) => (
          <Grid item xs={12} md={6} lg={4} key={producto.id_producto}>
            <Card sx={{ borderLeft: "6px solid #4caf50", boxShadow: 3 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {producto.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[producto?.forma_farmaceutica, producto?.concentracion]
                    .filter(Boolean)
                    .join(" - ")}
                </Typography>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    <strong>Precio:</strong> Bs. {producto.precio}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Stock:</strong> {producto.stock} unidades
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4caf50", fontWeight: "bold" }}
                  >
                    {producto.totalUnidadesVendidas} unidades vendidas
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#4caf50", fontWeight: "bold" }}
                  >
                    {producto.detallesVenta.length} ventas registradas
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MostSoldProductsComponent;
