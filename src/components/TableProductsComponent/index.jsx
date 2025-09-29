import React, { useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import TextField from "@mui/material/TextField";
import EnhancedTableHead from "./EnhancedTableHead";
import ModalUpdateProduct from "./ModalUpdateProduct";
import ModalViewProduct from "./ModalViewProduct";
import useStyles from "./table.styles";
import productoDeleteServices from "../../async/services/delete/productoDeleteServices";
import { useMutation } from "react-query";
import detalleCompraUpdateServices from "../../async/services/put/detalleCompraUpdateServices";
import detalleCompraDeleteServices from "../../async/services/delete/detalleCompraDeleteServices";
import { Button } from "@mui/material";
import ProductoModalComponent from "../RegisterBuyComponent/ProductoModalComponent";

const ITEM_HEIGHT = 48;

export default function TableProductsComponent({
  productos,
  refetchProducts,
  proveedoresData,
}) {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedidProducto, setSelectedIdProduct] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [editedPrice, setEditedPrice] = useState("");

  const [openProductoModal, setOpenProductoModal] = useState(false);
  const [showMissingOnly, setShowMissingOnly] = useState(false);

  const handleOpenProductoModal = () => setOpenProductoModal(true);
  const handleCloseProductoModal = () => setOpenProductoModal(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const toggleMissingOnly = () => {
    setShowMissingOnly((prev) => !prev);
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  const filteredProducts = productos
    .filter((producto) =>
      producto.nombre?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!showMissingOnly) return 0;
      const aVal = a.subCantidad ?? Infinity;
      const bVal = b.subCantidad ?? Infinity;
      return aVal - bVal;
    });

  const visibleRows = filteredProducts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleOpenUpdateModal = () => {
    handleCloseMenu();
    setOpenUpdateModal(true);
  };

  const handleOpenViewModal = () => {
    handleCloseMenu();
    setOpenViewModal(true);
  };

  const handleCloseModals = () => {
    setOpenUpdateModal(false);
    setOpenViewModal(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = () => {
    productoDeleteServices(selectedidProducto);
    handleCloseMenu();
  };

  const { mutate } = useMutation(
    ({ id, updatedPrice, updatedSalePrice, idLote, idProveedor }) =>
      detalleCompraUpdateServices(id, {
        ...(updatedPrice !== undefined && { precio_unitario: updatedPrice }),
        ...(updatedSalePrice !== undefined && {
          precioVenta: updatedSalePrice,
        }),
        ...(idLote && { id_lote: idLote }),
        ...(idProveedor && { id_proveedor: idProveedor }),
      }),
    {
      onSuccess: () => {
        handleCloseModals();
      },
      onError: (error) => {
        console.error(
          "Error al actualizar el detalle de compra:",
          error.message
        );
      },
    }
  );

  const {
    mutate: mutateDelete,
    isLoading: loading,
    isError,
  } = useMutation(
    async ({ dataDelete, idDetalle }) => {
      return await detalleCompraDeleteServices(idDetalle, dataDelete);
    },
    {
      onSuccess: (response) => {
        refetchProducts();
        handleCloseModals();
      },
      onError: (error) => {
        console.error("Error en la mutación:", error);
      },
    }
  );

  return (
    <Box className={classes.root}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "space-between",
          flexWrap: "wrap",
          padding: 2,
        }}
      >
        <Button
          variant="contained"
          color={showMissingOnly ? "secondary" : "primary"}
          onClick={toggleMissingOnly}
          sx={{ minWidth: 250, height: 56 }}
        >
          {showMissingOnly ? "Ver todos los productos" : "Ordenar por cantidad"}
        </Button>
      </Box>
      <Button
        onClick={handleOpenProductoModal}
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      ></Button>
      <ProductoModalComponent
        refetchProducts={refetchProducts}
        open={openProductoModal}
        handleClose={handleCloseProductoModal}
      />
      <Paper className={classes.paper}>
        <Box sx={{ padding: 2 }}>
          <TextField
            label="Buscar producto"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </Box>
        <TableContainer>
          <Table aria-labelledby="tableTitle" size="medium">
            <EnhancedTableHead />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isEvenRow = index % 2 === 0;
                console.log("Row data:", row);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.id_producto}
                    className={isEvenRow ? classes.evenRow : classes.oddRow}
                  >
                    <TableCell
                      align="left"
                      sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                    >
                      {row.nombre || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {row.codigo_barra || "N/A"}
                    </TableCell>

                    <TableCell align="left">{row.precio || "N/A"} Bs</TableCell>
                    <TableCell
                      sx={{
                        color: row.stock > 0 ? "green" : "red",
                      }}
                    >
                      {row.subCantidad === row.stock
                        ? row.stock
                        : row.subCantidad ?? "N/A"}
                    </TableCell>
                    {/* 
                    <TableCell
                      sx={{
                        color: row.stock > 0 ? "green" : "red",
                      }}
                    >
                      {row.cantCaja
                        ? Math.floor(row.subCantidad / row.cantCaja)
                        : "N/A"}
                    </TableCell>
                    <TableCell
                      sx={{
                        color: row.stock > 0 ? "green" : "red",
                      }}
                    >
                      {row.subCantidad === row.stock
                        ? row.stock
                        : row.subCantidad -
                            Math.floor(row.subCantidad / row.cantCaja) *
                              row.cantCaja ?? "N/A"}
                    </TableCell>
*/}
                    {/* <TableCell align="left">
                      {row.forma_farmaceutica || "N/A"}
                    </TableCell>
                    <TableCell align="left">
                      {row.concentracion || "N/A"}
                    </TableCell> */}
                    {/* <TableCell
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: row.uso_res ? "green" : "red",
                          textTransform: "uppercase",
                          color: "white",
                          fontWeight: "bold",
                          width: "3rem",
                          p: 1,
                          borderRadius: "1rem",
                          textAlign: "center",
                        }}
                      >
                        {row.uso_res ? "si" : "no"}
                      </Box>
                    </TableCell> */}
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        aria-haspopup="true"
                        onClick={(e) => {
                          handleClick(e);
                          setSelectedProduct(row);
                          setSelectedIdProduct(row.id_producto);
                        }}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleCloseMenu}
                        PaperProps={{
                          style: {
                            maxHeight: ITEM_HEIGHT * 4.5,
                            width: "20ch",
                          },
                        }}
                      >
                        <MenuItem onClick={() => handleOpenUpdateModal()}>
                          <EditIcon /> Editar
                        </MenuItem>
                        <MenuItem onClick={() => handleOpenViewModal()}>
                          <VisibilityIcon /> Ver
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Paper>

      {openUpdateModal && (
        <ModalUpdateProduct
          product={selectedProduct}
          handleClose={handleCloseModals}
          refetchProducts={refetchProducts}
        />
      )}
      {openViewModal && (
        <ModalViewProduct
          product={selectedProduct}
          handleClose={handleCloseModals}
          editingRow={editingRow}
          setEditingRow={setEditingRow}
          editedPrice={editedPrice}
          setEditedPrice={setEditedPrice}
          mutate={mutate}
          mutateDelete={mutateDelete}
          proveedoresData={proveedoresData}
        />
      )}
    </Box>
  );
}

TableProductsComponent.propTypes = {
  productos: PropTypes.array.isRequired,
};
