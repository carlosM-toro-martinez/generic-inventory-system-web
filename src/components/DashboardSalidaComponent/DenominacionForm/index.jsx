import React, { useState, useEffect } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import useStyles from "./denominacionForm.styles";
import twoHundred from "../../../assets/images/200.jpg";
import oneHundred from "../../../assets/images/100.jpg";
import fifty from "../../../assets/images/50.jpg";
import twenty from "../../../assets/images/20.jpg";
import teen from "../../../assets/images/10.jpg";
import five from "../../../assets/images/5.jpg";
import two from "../../../assets/images/2.jpg";
import one from "../../../assets/images/1.jpg";
import fiftyCent from "../../../assets/images/050.jpg";
import twentyCent from "../../../assets/images/020.jpg";
import teenCent from "../../../assets/images/010.jpg";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box } from "@mui/material";

const denominationsImages = {
  "200.00": twoHundred,
  "100.00": oneHundred,
  "50.00": fifty,
  "20.00": twenty,
  "10.00": teen,
  "5.00": five,
  "2.00": two,
  "1.00": one,
  "0.50": fiftyCent,
  "0.20": twentyCent,
  "0.10": teenCent,
};

function DenominacionForm({
  caja,
  refetchCaja,
  denominaciones,
  setDenominaciones,
  totalPrice,
  setRestoreDenom,
}) {
  const classes = useStyles();
  const [localDenominaciones, setLocalDenominaciones] = useState(
    caja?.denominaciones?.sort(
      (a, b) => parseFloat(b.denominacion) - parseFloat(a.denominacion)
    ) || []
  );
  const [montoSumado, setMontoSumado] = useState(0);
  const [montoRestado, setMontoRestado] = useState(0);
  const [diferencias, setDiferencias] = useState({});

  // Función para calcular la suma o resta dependiendo del tipo de operación
  const calcularDiferencia = (denominaciones, tipo) => {
    return denominaciones.reduce((total, item) => {
      const diferencia =
        parseFloat(item.denominacion) *
        (item.cantidad -
          caja.denominaciones.find((d) => d.denominacion === item.denominacion)
            .cantidad);
      return tipo === "suma"
        ? total + (diferencia > 0 ? diferencia : 0)
        : total + (diferencia < 0 ? diferencia : 0);
    }, 0);
  };

  const calcularDiferencias = (denominaciones) => {
    const difs = {};
    denominaciones.forEach((item) => {
      const diferencia =
        item.cantidad -
        caja.denominaciones.find((d) => d.denominacion === item.denominacion)
          .cantidad;
      difs[item.denominacion] = diferencia;
    });
    setDiferencias(difs);
  };

  useEffect(() => {
    setLocalDenominaciones(caja?.denominaciones);
  }, [caja?.denominaciones]);

  const handleIncrease = (denominacion) => {
    setLocalDenominaciones((prevState) => {
      const updatedDenoms = prevState.map((item) =>
        item.denominacion === denominacion
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
      setMontoSumado(calcularDiferencia(updatedDenoms, "suma"));
      setMontoRestado(calcularDiferencia(updatedDenoms, "resta"));
      calcularDiferencias(updatedDenoms);
      return updatedDenoms;
    });
  };

  const handleDecrease = (denominacion) => {
    setLocalDenominaciones((prevState) => {
      const updatedDenoms = prevState.map((item) =>
        item.denominacion === denominacion && item.cantidad > 0
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
      setMontoSumado(calcularDiferencia(updatedDenoms, "suma"));
      setMontoRestado(calcularDiferencia(updatedDenoms, "resta"));
      calcularDiferencias(updatedDenoms);
      return updatedDenoms;
    });
  };

  const handleRestart = () => {
    setLocalDenominaciones(caja?.denominaciones);
    setMontoSumado(0);
    setMontoRestado(0);
    setDiferencias({});
  };

  useEffect(() => {
    setRestoreDenom(() => handleRestart);
  }, []);

  useEffect(() => {
    setDenominaciones(localDenominaciones);
  }, [localDenominaciones, setDenominaciones]);

  return (
    <Box className={classes.root}>
      <Typography
        variant="h6"
        style={{
          color: "#000",
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "2rem",
        }}
      >
        {(montoSumado + montoRestado).toFixed(2)} Bs
      </Typography>

      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        style={{ width: "40%" }}
      >
        <Grid item>
          <Typography variant="h6" style={{ color: "red" }}>
            {montoRestado.toFixed(2)} Bs
          </Typography>
        </Grid>
        <Grid item style={{ textAlign: "center" }}>
          <Typography variant="h6">
            {montoSumado.toFixed(2) - totalPrice} Bs
          </Typography>
          <Typography variant="h6">cambio</Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" style={{ color: "green" }}>
            + {montoSumado.toFixed(2)} Bs
          </Typography>
        </Grid>
      </Grid>

      {/* Denominaciones */}
      <Button onClick={handleRestart}>Restablecer</Button>
      <Grid container spacing={2}>
        {localDenominaciones.map((denom, index) => (
          <Grid item xs={6} sm={2} key={index} className={classes.denomItem}>
            <img
              src={denominationsImages[denom.denominacion]}
              alt={`denominacion-${denom.denominacion}`}
              className={classes.image}
              onError={(e) => {
                e.target.src = "";
                e.target.alt = `Sin imagen para ${denom.denominacion}`;
              }}
            />
            <Box className={classes.buttons}>
              <Button
                color="secondary"
                onClick={() => handleDecrease(denom.denominacion)}
                disabled={denom.cantidad === 0}
              >
                <RemoveIcon />
              </Button>
              <Typography variant="body1" className={classes.amount}>
                {denom.cantidad}
              </Typography>
              <Button onClick={() => handleIncrease(denom.denominacion)}>
                <AddIcon sx={{ color: "green" }} />
              </Button>
            </Box>
            {/* Mostrar la diferencia debajo de la cantidad */}
            {diferencias[denom.denominacion] !== 0 && (
              <Typography
                variant="body2"
                style={{
                  color: diferencias[denom.denominacion] > 0 ? "green" : "red",
                }}
              >
                {diferencias[denom.denominacion] > 0
                  ? `+${diferencias[denom.denominacion]}`
                  : diferencias[denom.denominacion]}
              </Typography>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default DenominacionForm;
