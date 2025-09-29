import React, { useState } from "react";
import {
  Grid,
  TextField,
  IconButton,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
} from "@mui/material";
import { Visibility, VisibilityOff, Add } from "@mui/icons-material";
import ModalRolComponent from "../ModalRolComponent";

function FormTrabajador({
  formData,
  handleChange,
  classes,
  permisos,
  rol,
  refetchRol,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handlePasswordToggle = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleRoleChange = (event) => {
    const selectedRoleId = event.target.value;
    handleChange({
      target: { name: "id_rol", value: selectedRoleId },
    });
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Grid container spacing={2} sx={{ marginBottom: "1rem" }}>
        <Grid item xs={6}>
          <TextField
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            fullWidth
            required
            className={classes.input}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Apellido Paterno"
            name="apellido_paterno"
            value={formData.apellido_paterno}
            onChange={handleChange}
            fullWidth
            required
            className={classes.input}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Apellido Materno"
            name="apellido_materno"
            value={formData.apellido_materno}
            onChange={handleChange}
            fullWidth
            required
            className={classes.input}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
            className={classes.input}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Contraseña"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            className={classes.input}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handlePasswordToggle}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            label="Fecha de Contratación"
            name="fecha_contratacion"
            type="date"
            value={formData.fecha_contratacion}
            onChange={handleChange}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            className={classes.input}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth required className={classes.input}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={formData.id_rol || ""}
              onChange={handleRoleChange}
              label="Rol"
            >
              {rol.map((role) => (
                <MenuItem key={role.id_rol} value={role.id_rol}>
                  {role.nombre}
                </MenuItem>
              ))}
              <IconButton onClick={handleOpenModal} color="primary">
                <Add />
              </IconButton>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <ModalRolComponent
          handleCloseModal={handleCloseModal}
          permisos={permisos}
          refetchRol={refetchRol}
        />
      </Dialog>
    </>
  );
}

export default FormTrabajador;
