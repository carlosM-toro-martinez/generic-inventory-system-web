import React, { forwardRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Divider } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  ticket: {
    width: 250,
    fontFamily: "monospace",
    fontSize: 12,
    padding: 8,
  },
  center: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 4,
  },
  line: {
    borderTop: "1px dashed black",
    margin: "6px 0",
  },
  producto: {
    marginBottom: 4,
  },
  nombre: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  detalle: {
    display: "flex",
    justifyContent: "space-between",
  },
  total: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
}));

const TicketComponent = forwardRef(({ productos, totalPrice }, ref) => {
  const classes = useStyles();

  const calcularTotal = () =>
    productos
      .reduce((acc, item) => {
        const precio = parseFloat(
          item.loteSeleccionado?.lote?.producto?.precio || 0
        );
        const cantidad = item.cantLimit || 0;
        return acc + precio * cantidad;
      }, 0)
      .toFixed(2);

  return (
    <Box className={classes.ticket} ref={ref}>
      <Typography className={classes.center}>NOTA DE VENTA</Typography>
      <Divider className={classes.line} />

      {productos.map((item, index) => {
        const producto = item.newValue;
        const lote = item.loteSeleccionado?.lote;
        const precio = parseFloat(lote?.precioVenta || 0);
        const cantidad = item.cantidadPorUnidad || 0;
        const total = (cantidad * precio).toFixed(2);
        return (
          <Box key={index} className={classes.producto}>
            <Typography className={classes.nombre}>
              {producto?.nombre}
            </Typography>
            <Box className={classes.detalle}>
              <span>
                {cantidad} x {precio.toFixed(2)}
              </span>
              <span>{total}</span>
            </Box>
          </Box>
        );
      })}

      <Divider className={classes.line} />

      <Typography className={classes.total}>Total: Bs. {totalPrice}</Typography>

      <Typography className={classes.center}>
        ¡Gracias por su compra!
      </Typography>
    </Box>
  );
});

export default TicketComponent;
