import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  Box,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import productosInventarioService from "../../../async/services/get/productosInventarioService";
import { useQuery } from "react-query";

function ModalViewProduct({
  handleClose,
  product,
  editingRow,
  setEditingRow,
  editedPrice,
  setEditedPrice,
  mutate,
  mutateDelete,
  proveedoresData,
}) {
  const [editedSalePrice, setEditedSalePrice] = useState("");
  const [editedProviderId, setEditedProviderId] = useState("");

  const { data, isLoading, error } = useQuery(
    `InventarioProducts`,
    () => productosInventarioService(product?.id_producto),
    {
      enabled: !!product?.id_producto,
    }
  );

  if (isLoading) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Ver Producto</DialogTitle>
        <DialogContent>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={true} onClose={handleClose}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Ocurrió un error al cargar los inventarios. Por favor, intenta de
            nuevo.
          </Typography>
        </DialogContent>
      </Dialog>
    );
  }

  if (!data) return null;

  const handleEdit = (index, precioActual, precioVenta, proveedorId) => {
    setEditingRow(index);
    setEditedPrice(precioActual);
    setEditedSalePrice(precioVenta);
    setEditedProviderId(proveedorId ?? "");
  };

  const handleSave = (index) => {
    const inventario = data.inventarios[index];
    const item = inventario.detalleCompra.id_detalle;
    const idLote = inventario.id_lote;

    if (item) {
      mutate({
        id: item,
        updatedPrice: editedPrice !== "" ? parseFloat(editedPrice) : undefined,
        updatedSalePrice:
          editedSalePrice !== "" ? parseFloat(editedSalePrice) : undefined,
        idLote: idLote,
        idProveedor: editedProviderId || undefined,
      });
    }
    setEditingRow(null);
    setEditedPrice("");
    setEditedSalePrice("");
    setEditedProviderId("");
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedPrice("");
    setEditedSalePrice("");
    setEditedProviderId("");
  };

  const handleDelete = (inventario) => {
    const dataDelete = {
      id_producto: inventario.detalleCompra.id_producto,
      id_lote: inventario.id_lote,
      id_inventario: inventario.id_inventario || null,
      id_movimiento: inventario.id_movimiento || null,
      id_detalle: inventario.detalleCompra.id_detalle,
      cantidad: inventario.cantidad,
      subCantidad: inventario.subCantidad,
      peso: parseFloat(inventario.peso) || 0,
    };

    mutateDelete({
      dataDelete,
      idDetalle: inventario.detalleCompra.id_detalle,
    });
  };

  const calcularUtilidad = (cantidad, precioTotalCompra, precioVentaUnidad) => {
    if (cantidad <= 0) return 0;
    const costoUnitario = precioTotalCompra / cantidad;
    const utilidadUnidad = precioVentaUnidad - costoUnitario;
    return Number(utilidadUnidad.toFixed(2));
  };
  console.log(data.inventarios);

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      PaperProps={{ sx: { width: "70rem", maxWidth: "none" } }}
    >
      <DialogTitle>Lotes</DialogTitle>
      <DialogContent>
        <Typography
          variant="h6"
          sx={{
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: "1rem",
          }}
        >
          Producto: {data.producto}
        </Typography>
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>Número de Lote</TableCell>
                {/* <TableCell>Cantidad (c/p)</TableCell> */}
                {/* <TableCell>cant. por caja</TableCell> */}
                <TableCell>Unidades</TableCell>
                <TableCell>Utilidades p(u)</TableCell>
                <TableCell>Precio de venta(u)</TableCell>
                <TableCell>Caducidad</TableCell>
                <TableCell>Ingreso</TableCell>
                <TableCell>Precio de compra(c)</TableCell>
                <TableCell>Proveedor</TableCell>

                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.inventarios.map((inventario, index) => (
                <TableRow key={index}>
                  <TableCell>{inventario.numero_lote}</TableCell>
                  {/* <TableCell>
                    {inventario.cantidad > 0 && inventario.subCantidad === 0
                      ? inventario.subCantidad
                      : inventario.cantidad}
                  </TableCell> */}
                  {/* <TableCell>{inventario.cantidadPorCaja ?? 0}</TableCell> */}
                  <TableCell>{inventario.subCantidad}</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "green" }}>
                    {calcularUtilidad(
                      inventario.detalleCompra.cantidad *
                        inventario.cantidadPorCaja,
                      inventario.detalleCompra.precio_unitario *
                        inventario.detalleCompra.cantidad,
                      product.precio
                    )}
                  </TableCell>
                  <TableCell>{product.precio ?? 0}</TableCell>
                  <TableCell sx={{ color: "orange" }}>
                    {inventario?.fecha_caducidad
                      ?.split("T")[0]
                      ?.split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                  <TableCell>
                    {inventario?.fecha_ingreso
                      ?.split("T")[0]
                      ?.split("-")
                      .reverse()
                      .join("/")}
                  </TableCell>
                  <TableCell>
                    {editingRow === index ? (
                      <TextField
                        value={editedPrice}
                        onChange={(e) => setEditedPrice(e.target.value)}
                        type="number"
                        variant="outlined"
                        size="small"
                        sx={{ width: "8rem" }}
                      />
                    ) : inventario.cantidadPorCaja ? (
                      inventario.detalleCompra.precio_unitario /
                      inventario.cantidadPorCaja
                    ) : (
                      inventario.detalleCompra.precio_unitario
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === index ? (
                      <Select
                        value={editedProviderId}
                        onChange={(e) => setEditedProviderId(e.target.value)}
                        size="small"
                        fullWidth
                      >
                        {proveedoresData.map((prov) => (
                          <MenuItem
                            key={prov.id_proveedor}
                            value={prov.id_proveedor}
                          >
                            {prov.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      inventario?.detalleCompra?.proveedor?.nombre
                    )}
                  </TableCell>
                  <TableCell>
                    {editingRow === index ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          onClick={() => handleSave(index)}
                          size="small"
                          variant="contained"
                          sx={{
                            minWidth: 0,
                            width: "2rem",
                            bgcolor: "primary.main",
                            color: "#fff",
                          }}
                        >
                          <SaveIcon fontSize="small" />
                        </Button>
                        <Button
                          onClick={handleCancel}
                          size="small"
                          variant="contained"
                          sx={{
                            minWidth: 0,
                            width: "2rem",
                            bgcolor: "error.main",
                            color: "#fff",
                          }}
                        >
                          <CancelIcon fontSize="small" />
                        </Button>
                      </Box>
                    ) : (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button
                          onClick={() =>
                            handleEdit(
                              index,
                              inventario.detalleCompra.precio_unitario,
                              inventario.precioVenta,
                              inventario?.detalleCompra?.proveedor?.id_proveedor
                            )
                          }
                          size="small"
                          variant="contained"
                          sx={{
                            minWidth: 0,
                            width: "2rem",
                            bgcolor: "primary.main",
                            color: "#fff",
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(inventario)}
                          size="small"
                          variant="contained"
                          sx={{
                            minWidth: 0,
                            width: "2rem",
                            bgcolor: "error.main",
                            color: "#fff",
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="error" variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalViewProduct;
