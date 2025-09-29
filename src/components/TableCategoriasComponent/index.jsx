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
  Collapse,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useStyles from "./tableCategorias.styles";
import { useMutation, useQueryClient } from "react-query";
import FormCategoriaComponent from "../FormCategoriaComponent";
import categoriaDeleteServices from "../../async/services/delete/categoriaDeleteServices";

function TableCategoriasComponent({ categorias, refetchCategorias }) {
  const classes = useStyles();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openRows, setOpenRows] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriaUpdate, setCategoriaUpdate] = useState();

  const queryClient = useQueryClient();

  const deleteMutation = useMutation(categoriaDeleteServices, {
    onSuccess: () => {
      setSnackbarMessage("Categoría eliminada correctamente");
      setSnackbarOpen(true);
      queryClient.invalidateQueries("categorias");
      refetchCategorias();
    },
    onError: () => {
      setSnackbarMessage("Hubo un error al eliminar la categoría");
      setSnackbarOpen(true);
    },
  });

  const handleMenuOpen = (event, categoria) => {
    setAnchorEl(event.currentTarget);
    setSelectedCategoria(categoria);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCategoria(null);
  };

  const handleEdit = (categoria) => {
    setCategoriaUpdate(categoria);
    handleDialogOpen();
    handleMenuClose();
  };

  const handleDelete = (idCategoria) => {
    deleteMutation.mutate(idCategoria);
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

  const toggleRowOpen = (idCategoria) => {
    setOpenRows((prevOpenRows) => ({
      ...prevOpenRows,
      [idCategoria]: !prevOpenRows[idCategoria],
    }));
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const paginatedCategorias = categorias.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper className={classes.tableContainer}>
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
                Productos
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
            {paginatedCategorias.map((categoria) => (
              <React.Fragment key={categoria.id_categoria}>
                <TableRow>
                  <TableCell>{categoria.nombre}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => toggleRowOpen(categoria.id_categoria)}
                    >
                      {openRows[categoria.id_categoria] ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleMenuOpen(e, categoria)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      keepMounted
                      open={
                        Boolean(anchorEl) &&
                        selectedCategoria?.id_categoria ===
                          categoria.id_categoria
                      }
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleEdit(categoria)}>
                        Editar
                      </MenuItem>
                      <MenuItem
                        onClick={() => handleDelete(categoria.id_categoria)}
                      >
                        Eliminar
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>

                {/* Fila colapsable con los productos */}
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={3}
                  >
                    <Collapse
                      in={openRows[categoria.id_categoria]}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1} sx={{ backgroundColor: "#f5f5f5" }}>
                        <Table size="small" aria-label="productos">
                          <TableHead>
                            <TableRow>
                              <TableCell>Nombre</TableCell>
                              <TableCell>Código de Barra</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {categoria.productos.length > 0 ? (
                              categoria.productos.map((producto, index) => (
                                <TableRow key={index}>
                                  <TableCell>{producto.nombre}</TableCell>
                                  <TableCell>{producto.codigo_barra}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4}>Sin productos</TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categorias.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página"
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handleDialogOpen}
        className={classes.createButton}
      >
        Crear Categoría
      </Button>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Crear Nueva Categoría</DialogTitle>
        <DialogContent>
          <FormCategoriaComponent
            handleClose={handleDialogClose}
            refetchCategories={refetchCategorias}
            categoriaData={categoriaUpdate}
          />
        </DialogContent>
      </Dialog>

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

export default TableCategoriasComponent;
