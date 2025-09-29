import React, { useState, useEffect } from "react";
import { TextField, Button, Grid, Snackbar } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formClient.styles";
import clienteAddService from "../../async/services/post/clienteAddService";
import clienteOneUpdateServices from "../../async/services/put/clienteOneUpdateServices";

function FormCliente({ handleClose, refetchClients, clienteData }) {
  const classes = useStyles();

  const [clienteId, setClienteId] = useState(
    clienteData ? clienteData.id_cliente : null
  );

  const [cliente, setCliente] = useState({
    nombre: clienteData ? clienteData.nombre : "",
    apellido: clienteData ? clienteData.apellido : "", // Nuevo
    codigo: clienteData ? clienteData.codigo : "", // Nuevo
    nitci: clienteData ? clienteData.nitci : "", // Nuevo
    telefono: clienteData ? clienteData.telefono : "",
    email: clienteData ? clienteData.email : "",
    direccion: clienteData ? clienteData.direccion : "",
    puntos_fidelidad: clienteData ? clienteData.puntos_fidelidad : 0,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (clienteData) {
      setCliente({
        nombre: clienteData.nombre,
        apellido: clienteData.apellido, // Nuevo
        codigo: clienteData.codigo, // Nuevo
        nitci: clienteData.nitci, // Nuevo
        telefono: clienteData.telefono,
        email: clienteData.email,
        direccion: clienteData.direccion,
        puntos_fidelidad: clienteData.puntos_fidelidad,
      });
    }
  }, [clienteData]);

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(
    clienteId
      ? () => clienteOneUpdateServices(clienteId, cliente)
      : () => clienteAddService(cliente),
    {
      onSuccess: () => {
        refetchClients();
        setSnackbar({
          open: true,
          message: clienteId
            ? "Cliente actualizado exitosamente!"
            : "Cliente creado exitosamente!",
          severity: "success",
        });
        handleClose();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al ${
            clienteId ? "actualizar" : "crear"
          } el cliente: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              value={cliente.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Apellido"
              name="apellido"
              value={cliente.apellido}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Código"
              name="codigo"
              value={cliente.codigo}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="NIT/CI"
              name="nitci"
              value={cliente.nitci}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Teléfono"
              name="telefono"
              value={cliente.telefono}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={cliente.email}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              name="direccion"
              value={cliente.direccion}
              onChange={handleChange}
              fullWidth
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Puntos de Fidelidad"
              name="puntos_fidelidad"
              value={cliente.puntos_fidelidad}
              onChange={handleChange}
              fullWidth
              className={classes.input}
              type="number"
              inputProps={{ step: "1" }}
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              disabled={mutation.isLoading}
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? clienteId
                  ? "Actualizando..."
                  : "Creando..."
                : clienteId
                ? "Actualizar Cliente"
                : "Crear Cliente"}
            </Button>
          </Grid>
        </Grid>
      </form>

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

export default FormCliente;
