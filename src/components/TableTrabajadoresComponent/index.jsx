import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation } from "react-query";
import useStyles from "./tableTrabajadores.styles";
import trabajadorDeleteServices from "../../async/services/delete/trabajadorDeleteServices";

function TableTrabajadoresComponent({ trabajadores, onEdit, refetch }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTrabajador, setSelectedTrabajador] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const deleteMutation = useMutation(trabajadorDeleteServices, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Trabajador dado de baja con éxito.",
        severity: "success",
      });
      refetch();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleMenuOpen = (event, trabajador) => {
    setAnchorEl(event.currentTarget);
    setSelectedTrabajador(trabajador);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTrabajador(null);
  };

  const handleDelete = () => {
    if (selectedTrabajador) {
      deleteMutation.mutate(selectedTrabajador.id_trabajador);
    }
    handleMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const trabajadoresActivos = trabajadores.filter(
    (trabajador) => trabajador.estado === true
  );

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Apellido Paterno
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Apellido Materno
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>
                Fecha de Contratación
              </TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Rol</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Estado</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trabajadoresActivos.map((trabajador) => (
              <TableRow key={trabajador.id_trabajador}>
                <TableCell>{trabajador.nombre}</TableCell>
                <TableCell>{trabajador.apellido_paterno}</TableCell>
                <TableCell>{trabajador.apellido_materno}</TableCell>
                <TableCell>{trabajador.fecha_contratacion}</TableCell>
                <TableCell style={{ textTransform: "capitalize" }}>
                  {trabajador.rol?.nombre}
                </TableCell>
                <TableCell>{trabajador.username}</TableCell>
                <TableCell sx={{ color: "green" }}>
                  {trabajador.estado ? "Activo" : "Inactivo"}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={(event) => handleMenuOpen(event, trabajador)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={handleDelete}>Dar de baja</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default TableTrabajadoresComponent;
