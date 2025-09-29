import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";

function SalesVsBuyReport({ data }) {
  const calcularTotalVentas = (data) => {
    return data.reduce((acc, venta) => acc + Number(venta.total || 0), 0);
  };

  //   const calcularTotalCompras = (data) => {
  //     return data.reduce((acc, venta) => {
  //       const comprasVenta = venta.detallesVenta.reduce((accDetalle, detalle) => {
  //         const detalleCompra = detalle?.lote?.detalleCompra;
  //         if (detalleCompra) {
  //           const precioUnitario = Number(detalleCompra.precio_unitario || 0);
  //           const subCantidad = Number(detalleCompra.subCantidad || 0);
  //           return accDetalle + precioUnitario * subCantidad;
  //         }
  //         return accDetalle;
  //       }, 0);
  //       return acc + comprasVenta;
  //     }, 0);
  //   };

  const calcularTotalCompras = (data) => {
    let totalCompras = 0;

    data.forEach((venta) => {
      venta.detallesVenta.forEach((detalle) => {
        const lote = detalle.lote;
        const detalleCompra = lote?.detalleCompra;

        if (!detalleCompra || !lote?.cantidadPorCaja) return;

        const precioCompraPorUnidad =
          parseFloat(detalleCompra.precio_unitario || 0) /
          Number(lote.cantidadPorCaja || 1);

        const cantidadVendida =
          detalle.subCantidad > 0 ? detalle.subCantidad : 0;

        if (!isNaN(precioCompraPorUnidad) && !isNaN(cantidadVendida)) {
          totalCompras += cantidadVendida * precioCompraPorUnidad;
        }
      });
    });

    return Number(totalCompras);
  };

  const totalVentas = calcularTotalVentas(data);
  const totalCompras = calcularTotalCompras(data);
  const utilidades = totalVentas - totalCompras;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4}>
        <Card sx={{ backgroundColor: "#e3f2fd" }}>
          <CardContent>
            <Typography variant="h6">Total Ventas</Typography>
            <Typography variant="h4" color="primary">
              ${totalVentas.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card sx={{ backgroundColor: "#fce4ec" }}>
          <CardContent>
            <Typography variant="h6">Total Compras</Typography>
            <Typography variant="h4" color="secondary">
              ${totalCompras.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={4}>
        <Card sx={{ backgroundColor: "#e8f5e9" }}>
          <CardContent>
            <Typography variant="h6">Utilidades</Typography>
            <Typography variant="h4" sx={{ color: "green" }}>
              ${utilidades.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default SalesVsBuyReport;
