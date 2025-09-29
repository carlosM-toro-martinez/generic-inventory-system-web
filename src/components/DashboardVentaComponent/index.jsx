import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Grid, Box, Snackbar, Typography } from "@mui/material";
import Alert from "@mui/material/Alert";
import { useMutation } from "react-query";
import ClientModal from "./ClientModal";
import VentaForm from "./VentaForm";
import useStyles from "./dashboardVenta.styles";
import { getLocalDateTime } from "../../utils/getDate";
import { MainContext } from "../../context/MainContext";
import ventaCompletaService from "../../async/services/post/ventaCompletaService";
import CalculatorComponent from "./VentaForm/CalculatorComponent";
import salidaInventarioAddService from "../../async/services/post/salidaInventarioAddService";
import TicketComponent from "./TicketComponent";
import { useReactToPrint } from "react-to-print";

function DashboardVentaComponent({
  products,
  refetchProducts,
  clients,
  refetchClients,
  caja,
  refetchCaja,
  movimientoInventario,
}) {
  const ventaFormRef = useRef(null);
  const denominacionFormRef = useRef(null);

  const classes = useStyles();
  const { user } = useContext(MainContext);

  const [ventaData, setVentaData] = useState({
    id_trabajador: user?.id_trabajador,
    clienteId: "",
  });
  const [precio, setPrecio] = useState();
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
  const [productosDetallados, setProductosDetallados] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [shouldMutate, setShouldMutate] = useState(false);
  const [metodoPago, setMetodoPago] = useState("Contado");
  const handleOpenClientModal = () => setOpenClientModal(true);
  const handleCloseClientModal = () => setOpenClientModal(false);

  const addProducto = (
    producto,
    cliente,
    loteID,
    price,
    cantidadPorUnidad,
    cantidad,
    metodo
  ) => {
    setProductosSeleccionados((prev) => {
      return [
        ...prev,
        {
          ...producto,
          clienteNombre: `${cliente.nombre} ${
            cliente.apellido ? cliente.apellido : ""
          } - ${cliente.codigo ? cliente.codigo : ""}`,
          clienteId: cliente.id_cliente,
          clientePuntos: cliente.puntos_fidelidad,
          id_lote: loteID,
          precio: price,
          cantidad_unidad: cantidadPorUnidad ? cantidadPorUnidad : 0,
          cantidad: cantidad ? cantidad : 0,
          id_trabajador: user?.id_trabajador,
          metodo: metodo,
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

  const ventaMutation = useMutation(
    () => {
      function buscarPorIdLote(array, idLote) {
        return array.find((item) => item.lote && item.lote.id_lote === idLote);
      }

      function calcularCantidad(
        cantidadPorCaja,
        cantidadInventario,
        cantidadVenta
      ) {
        let cantidad = 0;
        if (cantidadPorCaja > cantidadVenta) {
          cantidad = cantidadInventario === cantidadVenta ? 1 : 0;
        } else {
          cantidad = Math.floor(cantidadVenta / cantidadPorCaja);
        }
        return cantidad;
      }
      const payload = {
        ventaData: {
          fecha_venta: getLocalDateTime(),
          total: totalPrice,
          id_cliente: ventaData.clienteId,
          id_trabajador: ventaData.id_trabajador,
          rebaja_aplicada: 0,
          descuento_fidelidad_aplicado: 0,
          metodo_pago: metodoPago,
        },
        id_caja: caja?.caja?.id_caja || 1,
        detalles: productosSeleccionados.map((p) => ({
          id_producto: p.id_producto,
          id_lote: p.id_lote,
          cantidad: calcularCantidad(
            buscarPorIdLote(p.inventarios, p.id_lote)?.lote?.cantidadPorCaja,
            buscarPorIdLote(p.inventarios, p.id_lote)?.subCantidad,
            p.cantidad_unidad
          ),
          cantidad_unidad: p.cantidad_unidad,
          detalle: p.metodo ? p.metodo.descripcion : "unidad",
          precio: p.metodo ? p.metodo.precio : p.precio,
          clienteId: ventaData.clienteId,
          cantidadMetod: p.metodo ? p.metodo.cantidad_por_metodo : null,
        })),
      };
      console.log(payload);

      if (movimientoInventario) {
        return salidaInventarioAddService(payload);
      } else {
        return ventaCompletaService(payload);
      }
    },
    {
      onSuccess: (response) => {
        setSnackbar({
          open: true,
          message: movimientoInventario
            ? "Movimiento realizado exitosamente!"
            : "Venta realizada exitosamente!",
          severity: "success",
        });
        refetchProducts();
        refetchCaja();
        if (cancelForm) cancelForm();
        if (setRestoreDenom) setRestoreDenom();
      },
      onError: (error) => {
        setProductosSeleccionados([]);
        setSnackbar({
          open: true,
          message: `Error al procesar la venta: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = async () => {
    if (!totalPrice || totalPrice <= 0) {
      setSnackbar({
        open: true,
        message: "No se puede registrar una venta vacía.",
        severity: "error",
      });
      return;
    }

    if (!ventaData.clienteId) {
      setSnackbar({
        open: true,
        message: "Debe seleccionar un cliente para registrar la venta.",
        severity: "error",
      });
      return;
    }

    setIsProcessing(true);
    setShouldMutate(false);

    for (const item of productosDetallados) {
      const producto = item.newValue;
      const lotesProducto = item.lotesFiltrados;
      const price = parseFloat(item.newValue.precio);
      const cantidadPorUnidad = item.newValue.metodoVentaBase
        ? item.cantidadPorUnidad *
          item.newValue.metodoVentaBase.cantidad_por_metodo
        : item.cantidadPorUnidad;
      const cantidadPorCaja = item.cantidadPorCaja;
      const cantidad = item.cantidad;
      const metodoSeleccionado = item.newValue.metodoVentaBase;
      const cantidadMetodo = item.cantidadMetodo;
      const precioManual = item.precioManual;

      await procesarVenta(
        producto,
        lotesProducto,
        cantidadPorUnidad,
        cantidadPorCaja,
        price,
        cantidad,
        metodoSeleccionado,
        cantidadMetodo,
        precioManual
      );
    }

    setIsProcessing(false);
    setShouldMutate(true);
  };

  const procesarVenta = (
    newValue,
    lotesProducto,
    cantidadPorUnidad,
    cantidadPorCaja,
    price,
    cantidad,
    metodoSeleccionado,
    cantidadMetodo,
    precioManual
  ) => {
    const productoSeleccionado = products.find(
      (producto) => producto.id_producto === newValue.id_producto
    );
    const clienteSeleccionado = clients.find(
      (cliente) => cliente.id_cliente === ventaData.clienteId
    );

    if (!productoSeleccionado || !clienteSeleccionado) {
      console.error("Producto o cliente no encontrado");
      return;
    }

    let cajasRestantes = cantidadPorUnidad
      ? Math.floor(cantidadPorUnidad / cantidadPorCaja)
      : cantidad;

    let priceProduct = precio || precioManual || price;

    const lotesOrdenados = lotesProducto.sort(
      (a, b) => a.lote.id_lote - b.lote.id_lote
    );

    const procesarLotes = (condicion, operacion) => {
      for (let i = 0; i < lotesOrdenados.length; i++) {
        let loteData = lotesOrdenados[i];
        if (condicion(loteData)) {
          operacion(loteData);
        } else {
          break;
        }
      }
    };

    if (metodoSeleccionado && cantidadMetodo) {
      let unidadesRestantes =
        cantidadMetodo * metodoSeleccionado.cantidad_por_metodo;
      let precioMetodo =
        metodoSeleccionado.precio / metodoSeleccionado.cantidad_por_metodo;
      let cantidadCajas = unidadesRestantes / cantidadPorCaja;
      procesarLotes(
        (loteData) => unidadesRestantes > 0,
        (loteData) => {
          if (unidadesRestantes >= loteData.subCantidad) {
            cantidadCajas -= loteData.cantidad;
            unidadesRestantes -= loteData.subCantidad;
            addProducto(
              productoSeleccionado,
              clienteSeleccionado,
              loteData.lote.id_lote,
              peso,
              precioMetodo,
              loteData.subCantidad,
              loteData.cantidad,
              metodoSeleccionado
            );
          } else {
            addProducto(
              productoSeleccionado,
              clienteSeleccionado,
              loteData.lote.id_lote,
              peso,
              precioMetodo,
              unidadesRestantes,
              Math.floor(cantidadCajas),
              metodoSeleccionado
            );

            unidadesRestantes = 0;
          }
        }
      );
    } else {
      switch (true) {
        case cantidadPorUnidad && !cantidad:
          procesarLotes(
            (loteData) => cantidadPorUnidad > 0,
            (loteData) => {
              if (cantidadPorUnidad >= loteData.subCantidad) {
                cajasRestantes -= loteData.cantidad;
                cantidadPorUnidad -= loteData.subCantidad;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  priceProduct,
                  loteData.subCantidad,
                  loteData.cantidad,
                  newValue.metodoVentaBase
                );
              } else {
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  priceProduct,
                  cantidadPorUnidad,
                  cajasRestantes,
                  newValue.metodoVentaBase
                );
                cantidadPorUnidad = 0;
              }
            }
          );
          break;

        case cantidad && !cantidadPorUnidad:
          procesarLotes(
            (loteData) => cantidad > 0,
            (loteData) => {
              if (cantidad >= loteData.cantidad) {
                cantidad -= loteData.cantidad;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  priceProduct,
                  0,
                  loteData.cantidad
                );
              } else {
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  priceProduct,
                  0,
                  cantidad
                );
                cantidad = 0;
              }
            }
          );
          break;

        default:
          console.log("Ningún caso cumple con los criterios establecidos.");
          break;
      }
    }
  };

  useEffect(() => {
    if (!isProcessing && shouldMutate) {
      ventaMutation.mutate();
      setShouldMutate(false);
      setPrecio();
    }
  }, [isProcessing, shouldMutate, productosSeleccionados]);

  useEffect(() => {
    if (ventaFormRef.current) {
      ventaFormRef.current.focus();
    }
    if (denominacionFormRef.current) {
      denominacionFormRef.current.focus();
    }
  }, []);
  const contentRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef,
  });

  return (
    <Box style={{ minWidth: "100%" }}>
      <Typography
        variant="h3"
        className={classes.header}
        style={{
          fontSize: "2rem",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "1rem",
        }}
      >
        {movimientoInventario ? " Movimiento de inventario" : "Registrar Venta"}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={11} md={12} ref={ventaFormRef}>
          <VentaForm
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
            removeProducto={removeProducto}
            setTotalPrice={setTotalPrice}
            productosDetallados={productosDetallados}
            setProductosDetallados={setProductosDetallados}
            metodoPago={metodoPago}
            setMetodoPago={setMetodoPago}
            movimientoInventario={movimientoInventario}
            totalPrice={totalPrice}
          />
        </Grid>
      </Grid>
      <Box
        sx={{
          margin: ".5rem 0 2rem 0",
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "start",
        }}
      >
        <CalculatorComponent totalPrice={totalPrice} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {movimientoInventario ? "Registrar Movimiento" : "Registrar Venta"}
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
          sx={{
            fontSize: "1.8rem", // Tamaño del texto del mensaje
            padding: "16px 24px", // Padding interno del Alert
            alignItems: "center", // Centrar contenido verticalmente
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <div>
        <div style={{ display: "none" }}>
          <TicketComponent
            ref={contentRef}
            productos={productosDetallados}
            totalPrice={totalPrice}
          />
        </div>
      </div>
    </Box>
  );
}

export default DashboardVentaComponent;
