import React from "react";
import DrawerComponent from "../../../components/DrawerComponent";
import { useQuery } from "react-query";
import productosService from "../../../async/services/get/productosService";
import proveedoresService from "../../../async/services/get/proveedoresService";
import loteService from "../../../async/services/get/loteService";
import RegisterBuyComponent from "../../../components/RegisterBuyComponent";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Grid,
  Divider,
  Button,
} from "@mui/material";

function EditProductProviders() {
  //const [data, setData] = useState(productos);

  const handleProveedorChange = (productoId, loteId, value) => {
    setData((prev) =>
      prev.map((producto) =>
        producto.id_producto === productoId
          ? {
              ...producto,
              lotes: producto.lotes.map((lote) =>
                lote.id_lote === loteId ? { ...lote, proveedor: value } : lote
              ),
            }
          : producto
      )
    );
  };

  const handleSave = (productoId, loteId) => {
    const producto = data.find((p) => p.id_producto === productoId);
    const lote = producto?.lotes.find((l) => l.id_lote === loteId);

    console.log("Guardar proveedor para:", {
      id_detalle_compra: lote.id_detalle_compra,
      nuevoProveedor: lote.proveedor,
    });
  };
  const {
    data,
    isLoading: isLoadingProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useQuery(`products`, productosService);

  return (
    <>
      <DrawerComponent>
        {!isLoadingProducts ? (
          <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              Editar Proveedores por Producto
            </Typography>

            {data.map((producto) => (
              <Paper
                key={producto.id_producto}
                sx={{ p: 2, mb: 3 }}
                elevation={3}
              >
                <Typography variant="h6">
                  {producto.nombre} ({producto.codigo_barra})
                </Typography>

                <Typography variant="subtitle2" color="text.secondary">
                  SubCantidad: {producto.subCantidad} - Stock: {producto.stock}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {producto.lotes.map((lote) => (
                  <Grid
                    container
                    spacing={2}
                    key={lote.id_lote}
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Grid item xs={12} sm={4}>
                      <Typography>Lote: {lote.numero_lote}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Ingreso:{" "}
                        {new Date(lote.fecha_ingreso).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Vence:{" "}
                        {new Date(lote.fecha_caducidad).toLocaleDateString()}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Proveedor"
                        value={lote.proveedor || ""}
                        onChange={(e) =>
                          handleProveedorChange(
                            producto.id_producto,
                            lote.id_lote,
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                      <Button
                        variant="contained"
                        onClick={() =>
                          handleSave(producto.id_producto, lote.id_lote)
                        }
                      >
                        Guardar
                      </Button>
                    </Grid>
                  </Grid>
                ))}
              </Paper>
            ))}
          </Box>
        ) : null}
      </DrawerComponent>
    </>
  );
}

export default EditProductProviders;
