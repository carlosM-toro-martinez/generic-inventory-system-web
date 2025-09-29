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
  TablePagination,
  Snackbar,
  Alert,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import useStyles from "./tableClients.styles";
import clientDeleteServices from "../../../async/services/delete/clientDeleteServices.js";
import { useMutation, useQueryClient } from "react-query";

function TableClientsComponent({
  clients,
  refetchClients,
  setOpen,
  setClientUpdate,
}) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [searchText, setSearchText] = useState(""); // Estado para el texto de búsqueda

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(clientDeleteServices, {
    onSuccess: () => {
      setSnackbarMessage("Cliente eliminado correctamente");
      setSnackbarOpen(true);
      queryClient.invalidateQueries("clients");
      refetchClients();
    },
    onError: () => {
      setSnackbarMessage("Hubo un error al eliminar el cliente");
      setSnackbarOpen(true);
    },
  });

  const handleMenuOpen = (event, client) => {
    setAnchorEl(event.currentTarget);
    setSelectedClient(client);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedClient(null);
  };

  const handleEdit = (client) => {
    setClientUpdate(client);
    setOpen(true);
    handleMenuClose();
  };

  const handleDelete = (idCliente) => {
    deleteMutation.mutate(idCliente);
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event?.target?.value);
  };

  const filteredClients = clients.filter((client) => {
    const search = searchText?.toLowerCase();
    return (
      client.nombre?.toLowerCase().includes(search) ||
      client.apellido?.toLowerCase().includes(search) ||
      client.codigo?.toLowerCase().includes(search)
    );
  });

  const paginatedClients = filteredClients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className={classes.tableContainer}>
      <TextField
        label="Buscar cliente"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchText}
        onChange={handleSearchChange}
      />

      <TableContainer>
        <Table className={classes.table}>
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Nombre
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Apellido
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Código
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                NIT/CI
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Teléfono
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Email
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Dirección
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Puntos de Fidelidad
              </TableCell>
              <TableCell
                className={classes.tableCell}
                sx={{ fontWeight: "bold" }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClients.map((client) => (
              <TableRow key={client.id_cliente}>
                <TableCell>{client.nombre}</TableCell>
                <TableCell>{client.apellido}</TableCell>
                <TableCell>{client.codigo}</TableCell>
                <TableCell>{client.nitci}</TableCell>
                <TableCell>{client.telefono}</TableCell>
                <TableCell>{client.email}</TableCell>
                <TableCell>{client.direccion}</TableCell>
                <TableCell>{client.puntos_fidelidad}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => handleMenuOpen(e, client)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    keepMounted
                    open={
                      Boolean(anchorEl) &&
                      selectedClient?.id_cliente === client.id_cliente
                    }
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => handleEdit(client)}>
                      Editar
                    </MenuItem>
                    <MenuItem onClick={() => handleDelete(client.id_cliente)}>
                      Dar de baja
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredClients.length} // Usar clientes filtrados
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={deleteMutation.isSuccess ? "success" : "error"}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default TableClientsComponent;
