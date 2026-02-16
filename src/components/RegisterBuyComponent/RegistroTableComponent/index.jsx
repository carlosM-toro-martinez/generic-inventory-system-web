import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import productoUpdateServices from "../../../async/services/put/productoUpdateServices";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFReport from "./PDFReport";
import { MainContext } from "../../../context/MainContext";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import detalleCompraDeleteServices from "../../../async/services/delete/detalleCompraDeleteServices";
import { useMutation } from "react-query";

const RegistroTableComponent = ({
  registroCombinado,
  setRegistroCombinado,
  handleFinalize,
  numeroLote,
  isFinalizing
}) => {
  const { user } = useContext(MainContext);

  const buyLote = registroCombinado;

  const navigate = useNavigate();
  const [infoArray, setInfoArray] = useState([]);

  const calcularPrecioTotal = (registro, precioPeso) => {
    const precioUnitario = parseFloat(registro?.precio_unitario);

    if (isNaN(precioUnitario)) {
      return 0;
    }

    if (precioPeso) {
      return precioUnitario;
    } else {
      const cantidad = registro.cantidad;

      return typeof parseInt(cantidad) === "number"
        ? cantidad * precioUnitario
        : 0;
    }
  };

  const calcularSumaTotal = () => {
    const total = registroCombinado.reduce(
      (acumulado, registro) =>
        acumulado +
        (registro.cantidad > 0
          ? calcularPrecioTotal(registro)
          : calcularPrecioTotal(registro, true)),
      0
    );

    return total;
  };

  const handleRoute = () => {
    handleFinalize();
  };

  const handleCancelar = () => {
    navigate("/almacenes");
  };

  const handleDelete = (index) => {
    const updatedBuyLote = [...registroCombinado];
    updatedBuyLote.splice(index, 1);
    setRegistroCombinado(updatedBuyLote);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* {numeroLote && (
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            style={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            Número de Lote: {numeroLote}
          </Typography>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            style={{ textTransform: "capitalize", fontWeight: "bold" }}
          >
            Proveedor: {registroCombinado[0]?.proveedor}
          </Typography>
        </Box>
      )} */}

      <TableContainer component={Paper}>
        <Table
          style={{
            width: "100%",
          }}
        >
          <TableHead style={{ backgroundColor: "#f5f5f5", width: "100%" }}>
            <TableRow>
              <TableCell style={{ fontWeight: "bold" }}>Producto</TableCell>
              {/* <TableCell style={{ fontWeight: "bold" }}>Lote</TableCell> */}
              <TableCell style={{ fontWeight: "bold" }}>Cantidad</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Precio Unitario (compra)
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Precio Total</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registroCombinado.map((registro, index) => (
              <TableRow key={index}>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {registro?.producto}
                </TableCell>
                {/* <TableCell style={{ textTransform: "capitalize" }}>
                  {registro?.numero_lote}
                </TableCell> */}
                <TableCell>
                  {`${registro?.cantidad}`}
                  {"u"}
                </TableCell>
                <TableCell>{registro?.precio_unitario} Bs</TableCell>
                <TableCell>
                  {registro?.cantidad > 0
                    ? calcularPrecioTotal(registro).toFixed(2)
                    : calcularPrecioTotal(registro, true).toFixed(2)}{" "}
                  Bs
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(index, registro)}>
                    <DeleteOutlineOutlinedIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableRow>
          <TableCell
            colSpan={5}
            align="right"
            style={{ fontWeight: "bold", fontSize: "2rem" }}
          >
            Suma Total:
          </TableCell>
          <TableCell style={{ fontWeight: "bold", fontSize: "2rem" }}>
            {calcularSumaTotal().toFixed(2)} Bs
          </TableCell>
        </TableRow>
      </TableContainer>
      <Box style={{ display: "flex", justifyContent: "center", gap: 10 }}>
        <Button
          variant="contained"
          disabled={isFinalizing}
          onClick={registroCombinado.length > 0 ? handleRoute : handleCancelar}
          style={{
            marginTop: "20px",
            backgroundColor: registroCombinado.length > 0 ? "green" : "red",
          }}
        >
          {registroCombinado.length > 0 ? "Finalizar" : "Cancelar"}
        </Button>
      </Box>
    </Box>
  );
};

export default RegistroTableComponent;
