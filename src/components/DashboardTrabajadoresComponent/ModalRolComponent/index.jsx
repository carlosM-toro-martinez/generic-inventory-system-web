import React, { useState } from "react";
import {
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControlLabel,
  Checkbox,
  Snackbar,
} from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import rolAddService from "../../../async/services/post/rolAddService.js";

function ModalRolComponent({ handleCloseModal, permisos, refetchRol }) {
  const [rolNombre, setRolNombre] = useState("");
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChangeRolNombre = (e) => {
    setRolNombre(e.target.value);
  };

  const handleTogglePermiso = (id_permiso) => {
    setSelectedPermisos((prevSelected) =>
      prevSelected.includes(id_permiso)
        ? prevSelected.filter((id) => id !== id_permiso)
        : [...prevSelected, id_permiso]
    );
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(
    () => rolAddService({ nombre: rolNombre, permisos: selectedPermisos }),
    {
      onSuccess: () => {
        refetchRol();
        setSnackbar({
          open: true,
          message: "Rol agregado exitosamente!",
          severity: "success",
        });
        handleCloseModal();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al agregar el rol: ${error.message}`,
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
    <Box component="form" onSubmit={handleSubmit}>
      <DialogTitle>Agregar Nuevo Rol</DialogTitle>
      <DialogContent>
        <TextField
          label="Nombre del Rol"
          fullWidth
          variant="outlined"
          value={rolNombre}
          onChange={handleChangeRolNombre}
          required
        />
        <Box mt={2}>
          {permisos.map((permiso) => (
            <FormControlLabel
              key={permiso.id_permiso}
              control={
                <Checkbox
                  checked={selectedPermisos.includes(permiso.id_permiso)}
                  onChange={() => handleTogglePermiso(permiso.id_permiso)}
                  name={permiso.nombre}
                />
              }
              label={permiso.nombre}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseModal} color="primary">
          Cancelar
        </Button>
        <Button type="submit" color="primary" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Agregando..." : "Agregar"}
        </Button>
      </DialogActions>

      {/* Snackbar para mostrar mensajes */}
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
    </Box>
  );
}

export default ModalRolComponent;
