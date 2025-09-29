import React, { useContext, useState } from "react";
import { TextField, Button, Grid, Snackbar, Paper } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import cajaOpenAddService from "../../../async/services/post/cajaOpenAddService";
import { useStyles } from "./formCaja.styles";
import { MainContext } from "../../../context/MainContext";

function FormCajaComponent({ handleClose }) {
  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [formData, setFormData] = useState({
    monto_inicial: 1000,
    denominaciones: [
      { tipo_dinero: "billete", denominacion: 200, cantidad: 0 },
      { tipo_dinero: "billete", denominacion: 100, cantidad: 0 },
      { tipo_dinero: "billete", denominacion: 50, cantidad: 0 },
      { tipo_dinero: "billete", denominacion: 20, cantidad: 0 },
      { tipo_dinero: "billete", denominacion: 10, cantidad: 0 },
      { tipo_dinero: "moneda", denominacion: 5, cantidad: 0 },
      { tipo_dinero: "moneda", denominacion: 2, cantidad: 0 },
      { tipo_dinero: "moneda", denominacion: 1, cantidad: 0 },
      { tipo_dinero: "moneda", denominacion: 0.5, cantidad: 0 },
      { tipo_dinero: "moneda", denominacion: 0.2, cantidad: 0 },
      { tipo_dinero: "moneda", denominacion: 0.1, cantidad: 0 },
    ],
    id_trabajador: user?.id_trabajador,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Función para manejar el cambio en la cantidad de una denominación
  const handleButtonClick = (denominacion) => {
    const updatedDenominations = formData.denominaciones.map((denom) =>
      denom.denominacion === denominacion
        ? { ...denom, cantidad: denom.cantidad + 1 }
        : denom
    );
    setFormData({ ...formData, denominaciones: updatedDenominations });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(() => cajaOpenAddService(formData), {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Caja abierta exitosamente!",
        severity: "success",
      });
      handleClose();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al abrir la caja: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ marginTop: "2rem" }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Paper elevation={3} className={classes.paper}>
            <form className={classes.form} onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Monto Inicial"
                    name="monto_inicial"
                    value={formData.monto_inicial}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                    inputProps={{ step: "0.01" }}
                  />
                </Grid>

                {formData.denominaciones.map((denom, index) => (
                  <Grid item xs={12} key={index}>
                    <TextField
                      label={`Denominación ${denom.tipo_dinero} (${denom.denominacion})`}
                      value={denom.cantidad}
                      fullWidth
                      disabled
                    />
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <TextField
                    label="ID Trabajador"
                    name="id_trabajador"
                    value={formData.id_trabajador}
                    onChange={handleChange}
                    fullWidth
                    required
                    type="number"
                    inputProps={{ min: "1" }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={handleClose}
                    disabled={mutation.isLoading}
                  >
                    Cancelar
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={mutation.isLoading}
                  >
                    {mutation.isLoading ? "Guardando..." : "Abrir Caja"}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Columna derecha con los botones de denominaciones */}
        <Grid item xs={12} sm={4} md={3}>
          <Paper elevation={3} className={classes.paper}>
            <Grid container direction="column" spacing={2}>
              {formData.denominaciones.map((denom, index) => (
                <Grid item key={index}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleButtonClick(denom.denominacion)}
                  >
                    {`${
                      denom.tipo_dinero.charAt(0).toUpperCase() +
                      denom.tipo_dinero.slice(1)
                    }, ${denom.denominacion}`}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FormCajaComponent;
