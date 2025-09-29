import React, { useState } from "react";
import { Grid, Button, Snackbar, IconButton } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import trabajadorAddServices from "../../async/services/post/trabajadorAddServices";
import useStyles from "./dashboardTrabajadores.styles";
import FormTrabajador from "./FormTrabajor";

function DashboardTrabajadoresComponent({
  permisos,
  refetchPermisos,
  rol,
  refetchRol,
}) {
  const classes = useStyles();

  const [formData, setFormData] = useState({
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    cargo: "",
    fecha_contratacion: "",
    username: "",
    password: "",
    id_rol: 0,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(() => trabajadorAddServices(formData), {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Trabajador creado exitosamente!",
        severity: "success",
      });
      setFormData({
        nombre: "",
        apellido_paterno: "",
        apellido_materno: "",
        cargo: "",
        fecha_contratacion: "",
        username: "",
        password: "",
        id_rol: 0,
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear trabajador: ${error.message}`,
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
      <FormTrabajador
        formData={formData}
        handleChange={handleChange}
        classes={classes}
        rol={rol}
        refetchRol={refetchRol}
        permisos={permisos}
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="error"
            className={classes.button}
            onClick={() =>
              setFormData({
                nombre: "",
                apellido_paterno: "",
                apellido_materno: "",
                cargo: "",
                fecha_contratacion: "",
                username: "",
                password: "",
                id_rol: 0,
              })
            }
          >
            Cancelar
          </Button>
        </Grid>

        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            disabled={mutation.isLoading}
            onClick={handleSubmit}
          >
            {mutation.isLoading ? "Creando..." : "Crear Trabajador"}
          </Button>
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

export default DashboardTrabajadoresComponent;
