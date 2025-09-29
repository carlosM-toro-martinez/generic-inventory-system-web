import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const agruparVentasPorProducto = (ventas) => {
  const resumen = {};

  ventas.forEach((venta) => {
    venta.detallesVenta.forEach((detalle) => {
      const producto = detalle.producto;
      const idProducto = producto.id_producto;

      if (!resumen[idProducto]) {
        resumen[idProducto] = {
          id: idProducto,
          nombre: producto.nombre,
          forma_farmaceutica: producto.forma_farmaceutica,
          concentracion: producto.concentracion,
          cantidadVendida: 0,
          stockActual: producto.subCantidad,
        };
      }

      resumen[idProducto].cantidadVendida += detalle.subCantidad;
    });
  });

  return Object.values(resumen);
};

const VentasResumeTable = ({ data }) => {
  const productos = agruparVentasPorProducto(data);

  return (
    <Box
      sx={{
        marginTop: "2rem",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "90%" }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Resumen de Productos Vendidos
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(to right, #1976d2, #42a5f5)",
                }}
              >
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "12px",
                  }}
                >
                  Producto
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "12px",
                  }}
                  align="center"
                >
                  Cantidad Vendida
                </TableCell>
                <TableCell
                  sx={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "12px",
                  }}
                  align="center"
                >
                  Cantidad Actual
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto, index) => (
                <TableRow
                  key={producto.id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e3f2fd",
                    transition: "background-color 0.3s",
                    "&:hover": {
                      backgroundColor: "#bbdefb",
                    },
                  }}
                >
                  <TableCell sx={{ padding: "12px", fontWeight: 500 }}>
                    {producto.nombre} {producto.forma_farmaceutica}{" "}
                    {producto.concentracion ?? ""}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "12px",
                      fontWeight: 500,
                      color: "red",
                      fontWeight: "bold",
                    }}
                  >
                    {producto.cantidadVendida}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      padding: "12px",
                      fontWeight: 500,
                      color: "green",
                      fontWeight: "bold",
                    }}
                  >
                    {producto.stockActual}
                  </TableCell>
                </TableRow>
              ))}
              {productos.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    align="center"
                    sx={{ padding: "16px" }}
                  >
                    No hay datos para mostrar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default VentasResumeTable;
