import React, { useState } from "react";
import { TextField, Button, Grid, Snackbar } from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formCategoria.styles";
import categoriaAddService from "../../async/services/post/categoriaAddService";
import categoriaOneUpdateService from "../../async/services/put/categoriaOneUpdateServices";

function FormCategoriaComponent({
  handleClose,
  refetchCategories,
  categoriaData,
}) {
  const classes = useStyles();

  const [categoriaId, setCategoriaId] = useState(
    categoriaData ? categoriaData.id_categoria : null
  );

  const [categoria, setCategoria] = useState({
    nombre: categoriaData ? categoriaData.nombre : "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    setCategoria({
      ...categoria,
      [e.target.name]: e.target.value,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(
    categoriaId
      ? () => categoriaOneUpdateService(categoriaId, categoria)
      : () => categoriaAddService(categoria),
    {
      onSuccess: () => {
        refetchCategories();
        setSnackbar({
          open: true,
          message: categoriaId
            ? "Categoría actualizada exitosamente!"
            : "Categoría creada exitosamente!",
          severity: "success",
        });
        handleClose();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al ${
            categoriaId ? "actualizar" : "crear"
          } la categoría: ${error.message}`,
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
              value={categoria.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
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
                ? categoriaId
                  ? "Actualizando..."
                  : "Creando..."
                : categoriaId
                ? "Actualizar Categoría"
                : "Crear Categoría"}
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

export default FormCategoriaComponent;
