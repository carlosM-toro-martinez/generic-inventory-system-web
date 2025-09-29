import React, { useContext, useState } from "react";
import { Button, Grid, Box, Snackbar, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useMutation } from "react-query";
import ClientModal from "./ClientModal";
import useStyles from "./dashboardVenta.styles";
import TableVentaComponent from "./TableVentaComponent";
import { getLocalDateTime } from "../../utils/getDate";
import salidaInventarioAddService from "../../async/services/post/salidaInventarioAddService";
import { MainContext } from "../../context/MainContext";
import SalidaForm from "./SalidaForm";

function DashboardSalidaComponent({
  products,
  refetchProducts,
  clients,
  refetchClients,
  refetchCaja,
}) {
  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [ventaData, setVentaData] = useState({
    id_trabajador: user?.id_trabajador,
    clienteId: "",
  });

  const [totalPrice, setTotalPrice] = useState();
  const [lote, setLote] = useState();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openClientModal, setOpenClientModal] = useState(false);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [cancelForm, setCancelForm] = useState(null);
  const [restore, setRestoreDenom] = useState(null);
  const [cantLimit, setCantLimit] = useState(0);
  const [pesoLimit, setPesoLimit] = useState(0);
  const [cantUnitLimit, setCantUnitLimit] = useState(0);

  const handleOpenClientModal = () => setOpenClientModal(true);
  const handleCloseClientModal = () => setOpenClientModal(false);

  const addProducto = (
    producto,
    cliente,
    loteID,
    peso,
    price,
    cantidadPorUnidad,
    cantidad
  ) => {
    setProductosSeleccionados((prev) => {
      return [
        ...prev,
        {
          ...producto,
          clienteNombre: cliente.nombre,
          clienteId: cliente.id_cliente,
          clientePuntos: cliente.puntos_fidelidad,
          id_lote: loteID,
          peso: peso ? peso : 0,
          precio: price,
          cantidad_unidad: cantidadPorUnidad ? cantidadPorUnidad : 0,
          cantidad: cantidad ? cantidad : 0,
          id_trabajador: user?.id_trabajador,
        },
      ];
    });

    actualizarTotal(productosSeleccionados);
  };

  const removeProducto = (index) => {
    setProductosSeleccionados((prev) => prev.filter((_, i) => i !== index));
    actualizarTotal(productosSeleccionados);
  };

  const actualizarTotal = (productos) => {
    const nuevoTotal = productos.reduce(
      (total, producto) => total + parseFloat(producto.precio),
      0
    );
    setVentaData((prev) => ({ ...prev, total: nuevoTotal }));
  };

  const detalleMutation = useMutation(
    (productosSeleccionados) =>
      salidaInventarioAddService(productosSeleccionados),
    {
      onSuccess: (response) => {
        setSnackbar({
          open: true,
          message: "Movimiento del inventario exitoso!",
          severity: "success",
        });
        refetchProducts();
        refetchCaja();
        if (cancelForm) {
          cancelForm();
        }
        if (setRestoreDenom) {
          setRestoreDenom();
        }
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al agregar detalles de la venta: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = () => {
    detalleMutation.mutate(productosSeleccionados);
  };

  return (
    <Box style={{ minWidth: "100%" }}>
      <Typography
        variant="h3"
        className={classes.header}
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          margin: "1rem 0 3rem 0",
        }}
      >
        Movimiento de inventario
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={11} md={4}>
          <SalidaForm
            ventaData={ventaData}
            clientes={clients}
            productos={products}
            setVentaData={setVentaData}
            setCliente={(id) =>
              setVentaData((prev) => ({ ...prev, clienteId: id }))
            }
            setProducto={(id) =>
              setVentaData((prev) => ({ ...prev, productoId: id }))
            }
            addProducto={addProducto}
            handleOpenClientModal={handleOpenClientModal}
            setProductosSeleccionados={setProductosSeleccionados}
            productosSeleccionados={productosSeleccionados}
            lote={lote}
            setLote={setLote}
            setCancelForm={setCancelForm}
            cantLimit={cantLimit}
            setCantLimit={setCantLimit}
            cantUnitLimit={cantUnitLimit}
            setCantUnitLimit={setCantUnitLimit}
            pesoLimit={pesoLimit}
            setPesoLimit={setPesoLimit}
          />
        </Grid>

        <Grid item xs={11} md={8}>
          <TableVentaComponent
            productosSeleccionados={productosSeleccionados}
            removeProducto={removeProducto}
            setTotalPrice={setTotalPrice}
          />
        </Grid>
      </Grid>
      <Box
        style={{
          margin: "2rem 0 2rem 0",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Realizar Movimiento
        </Button>
      </Box>

      <ClientModal
        refetchClients={refetchClients}
        open={openClientModal}
        handleClose={handleCloseClientModal}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DashboardSalidaComponent;
