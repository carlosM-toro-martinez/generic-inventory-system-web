import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import useStyles from "./tableVenta.styles.js";

const TableVentaComponent = ({
  productosSeleccionados,
  removeProducto,
  setTotalPrice,
}) => {
  const classes = useStyles();
  const calcularSumaTotal = () =>
    productosSeleccionados.reduce(
      (total, producto) =>
        total + parseFloat(producto.precio) * parseInt(producto.cantidad),
      0
    );

  useEffect(() => {
    const total = calcularSumaTotal();
    setTotalPrice(total);
  }, [productosSeleccionados, setTotalPrice]);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          {/* <TableRow>
            <TableCell
              sx={{ fontWeight: "bold", color: "#000", fontSize: "1.2rem" }}
              align="center"
              colSpan={1}
            >
              Cliente: {productosSeleccionados[0]?.clienteNombre}
            </TableCell>
            <TableCell align="center" colSpan={1}></TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#000", fontSize: "1.2rem" }}
              align="center"
              colSpan={3}
            >
              Puntos de fidelidad: {productosSeleccionados[0]?.clientePuntos}
            </TableCell>
          </TableRow> */}
          <TableRow
            className={classes.tableHeader}
            sx={{ backgroundColor: "#f5f5f5" }}
          >
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
              Producto
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
              Peso
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
              Cantidad
            </TableCell>
            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
              Cantidad por unidad
            </TableCell>

            <TableCell sx={{ fontWeight: "bold", color: "#fff" }}>
              Acciones
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productosSeleccionados.map((producto, index) => (
            <TableRow key={index}>
              <TableCell>{producto.nombre}</TableCell>
              <TableCell>{producto.peso}</TableCell>
              <TableCell>{producto.cantidad}</TableCell>
              <TableCell>{producto.cantidad_unidad}</TableCell>
              <TableCell>
                <Button onClick={() => removeProducto(index)}>
                  <DeleteOutlineOutlinedIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {/* <TableRow>
            <TableCell sx={{ fontWeight: "bold" }} colSpan={1}>
              Total
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} colSpan={3}>
              {calcularSumaTotal()} Bs
            </TableCell>
          </TableRow> */}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableVentaComponent;
