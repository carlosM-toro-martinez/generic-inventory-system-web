import React, { useState, useEffect } from "react";
import {
  Grid,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const SalidaForm = ({
  ventaData,
  setVentaData,
  clientes,
  productos,
  setProducto,
  setCliente,
  addProducto,
  handleOpenClientModal,
  productosSeleccionados,
  setProductosSeleccionados,
  lote,
  setLote,
  setCancelForm,
  cantLimit,
  setCantLimit,
  cantUnitLimit,
  setCantUnitLimit,
  pesoLimit,
  setPesoLimit,
}) => {
  const [lotesProducto, setLotesProducto] = useState([]);
  const [peso, setPeso] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantLote, setCantLote] = useState(null);
  const [cantidadPorUnidad, setCantidadPorUnidad] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [cantidadPorCaja, setCantidadPorCaja] = useState("");
  const [metodosVenta, setMetodosVenta] = useState(null);
  const [metodoSeleccionado, setMetodoSeleccionado] = useState(null);
  const [cantidadMetodo, setcantidadMetodo] = useState(null);

  useEffect(() => {
    const clienteDefecto = clientes.find((cliente) => cliente.id_cliente === 1);
    if (clienteDefecto) {
      setCliente(clienteDefecto.id_cliente);
    }
  }, [clientes]);

  const handleProductoChange = (productoId, newValue) => {
    setMetodosVenta(newValue?.inventarios[0].lote?.producto?.metodosVenta);

    setProducto(productoId);

    const lotesFiltrados =
      productos
        .find((producto) => producto.id_producto === productoId)
        ?.inventarios.filter((inv) => inv.cantidad >= 1 || inv.peso > 0)
        .map((inv) => inv) || [];

    setLotesProducto(lotesFiltrados);
    setCantLimit(lotesFiltrados[0]?.lote?.producto?.stock);
    setCantUnitLimit(lotesFiltrados[0]?.lote?.producto?.subCantidad);
    setPesoLimit(lotesFiltrados[0]?.lote?.producto?.peso);

    setCantidadPorCaja(
      lotesFiltrados[0]?.lote?.cantidadPorCaja
        ? lotesFiltrados[0]?.lote?.cantidadPorCaja
        : 10
    );

    if (lotesFiltrados.length > 0) {
      const loteMasAntiguo = lotesFiltrados.reduce((prev, current) => {
        const prevDate = new Date(prev.lote.fecha_caducidad);
        const currentDate = new Date(current.lote.fecha_caducidad);
        return currentDate < prevDate ? current : prev;
      });

      handleLoteChange(loteMasAntiguo?.lote?.id_lote, lotesFiltrados);
      setCantLote(loteMasAntiguo);
    }
  };

  const handleLoteChange = (loteId, lotesParam) => {
    setLote(loteId);
    const lotes = lotesParam || lotesProducto;
    const loteSeleccionado = lotes.find((lote) => {
      return lote.lote.id_lote === loteId;
    });

    setCantLote(loteSeleccionado);
    setVentaData((prev) => ({ ...prev, loteId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productoSeleccionado = productos.find(
      (producto) => producto.id_producto === ventaData.productoId
    );
    const clienteSeleccionado = clientes.find(
      (cliente) => cliente.id_cliente === ventaData.clienteId
    );

    let cajasRestantes = 0;
    if (cantidadPorUnidad) {
      cajasRestantes = Math.floor(cantidadPorUnidad / cantidadPorCaja);
      setCantidad(cajasRestantes);
    } else {
      cajasRestantes = cantidad;
    }

    let priceProduct = 0;
    if (!precio) {
      setPrecio(productoSeleccionado?.inventarios[0]?.lote?.producto?.precio);
      priceProduct =
        productoSeleccionado?.inventarios[0]?.lote?.producto?.precio;
    } else {
      priceProduct = precio;
    }

    if (productoSeleccionado && clienteSeleccionado) {
      const lotesOrdenados = lotesProducto.sort(
        (a, b) => a.lote.id_lote - b.lote.id_lote
      );

      let cantidadRestante = cantidadPorUnidad;
      let pesoRestante = peso;
      let cantidadPorMenor = cantidad;
      if (metodoSeleccionado && cantidadMetodo) {
        let unidadesRestantes =
          cantidadMetodo * metodoSeleccionado.cantidad_por_metodo;
        let precioMetodo =
          metodoSeleccionado.precio / metodoSeleccionado.cantidad_por_metodo;

        cajasRestantes = cajasRestantes = Math.floor(
          (metodoSeleccionado.cantidad_por_metodo * cantidadMetodo) /
            cantidadPorCaja
        );
        for (let i = 0; i < lotesOrdenados.length; i++) {
          let loteData = lotesOrdenados[i];

          if (unidadesRestantes >= loteData.subCantidad) {
            cajasRestantes = cajasRestantes - loteData.cantidad;
            unidadesRestantes -= loteData.subCantidad;
            if (loteData.subCantidad === cantidadPorCaja * loteData.cantidad) {
              addProducto(
                productoSeleccionado,
                clienteSeleccionado,
                loteData.lote.id_lote,
                peso,
                0,
                loteData.subCantidad,
                loteData.cantidad
              );
            }
          } else {
            if (unidadesRestantes === 0) {
              break;
            }

            addProducto(
              productoSeleccionado,
              clienteSeleccionado,
              loteData.lote.id_lote,
              peso,
              0,
              unidadesRestantes,
              cajasRestantes
            );
            break;
          }
        }
      } else {
        switch (true) {
          case cantidadRestante && !pesoRestante && !cantidadPorMenor:
            for (let i = 0; i < lotesOrdenados.length; i++) {
              let loteData = lotesOrdenados[i];

              if (cantidadRestante >= loteData.subCantidad) {
                cajasRestantes = cajasRestantes - loteData.cantidad;
                cantidadRestante -= loteData.subCantidad;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  0,
                  loteData.subCantidad,
                  loteData.cantidad
                );
              } else {
                if (cantidadRestante === 0) {
                  break;
                }

                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  0,
                  cantidadRestante,
                  cajasRestantes
                );
                break;
              }
            }
            break;

          case pesoRestante && !cantidadRestante && !cantidadPorMenor:
            for (let i = 0; i < lotesOrdenados.length; i++) {
              let loteData = lotesOrdenados[i];

              if (pesoRestante >= loteData.peso) {
                pesoRestante -= loteData.peso;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  loteData.peso,
                  0,
                  0,
                  0
                );
              } else {
                if (pesoRestante === 0) {
                  break;
                }
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  pesoRestante,
                  0,
                  0,
                  0
                );
                break;
              }
            }
            break;

          case cantidadPorMenor && !cantidadRestante && !pesoRestante:
            for (let i = 0; i < lotesOrdenados.length; i++) {
              let loteData = lotesOrdenados[i];
              if (cantidadPorMenor >= loteData.cantidad) {
                cantidadPorMenor -= loteData.cantidad;
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  0,
                  0,
                  loteData.cantidad
                );
              } else {
                if (cantidadPorMenor === 0) {
                  break;
                }
                addProducto(
                  productoSeleccionado,
                  clienteSeleccionado,
                  loteData.lote.id_lote,
                  peso,
                  0,
                  0,
                  cantidadPorMenor
                );
                break;
              }
            }
            break;

          default:
            console.log("Ningún caso cumple con los criterios establecidos.");
            break;
        }
      }

      setVentaData((prev) => ({
        ...prev,
        productoId: "",
        loteId: "",
      }));
      setLote("");
      setLotesProducto([]);
      setPeso("");
      setPrecio("");
      setCantidadPorUnidad("");
      setCantidad("");
      setCantLimit(0);
      setCantUnitLimit(0);
      setMetodosVenta(null);
      setcantidadMetodo(null);
      setMetodoSeleccionado(null);
    }
  };

  const handleCancelar = () => {
    setProductosSeleccionados([]);
    setVentaData((prev) => ({
      ...prev,
      productoId: "",
      loteId: "",
    }));
    setLote("");
    setLotesProducto([]);
    setPeso("");
    setPrecio("");
    setCantidadPorUnidad("");
    setCantidad("");
    setCantLimit(0);
    setCantUnitLimit(0);
    setPesoLimit(0);
    setMetodosVenta(null);
    setcantidadMetodo(null);
    setMetodoSeleccionado(null);
  };

  useEffect(() => {
    setCancelForm(() => handleCancelar);
  }, [setCancelForm]);

  const productosUnicos = [
    ...new Map(
      productos.map((producto) => [producto.id_producto, producto])
    ).values(),
  ];

  const productosUnicosFiltrados = productosUnicos.filter(
    (producto) => producto.inventarios.length > 0
  );

  const handleChangeMetodo = (event) => {
    setMetodoSeleccionado(event.target.value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={clientes || []}
                getOptionLabel={(cliente) => cliente?.nombre || ""}
                value={
                  clientes.find(
                    (cliente) => cliente.id_cliente === ventaData.clienteId
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setCliente(newValue.id_cliente);
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.id_cliente === value.id_cliente
                }
                disabled={productosSeleccionados?.length > 0}
                renderInput={(params) => (
                  <TextField {...params} label="Destinatario" required />
                )}
              />
              <Button
                onClick={handleOpenClientModal}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginTop: "8px",
                }}
              >
                <AddCircleOutlineIcon color="error" />
              </Button>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <Autocomplete
                options={productosUnicosFiltrados || []}
                getOptionLabel={(producto) => producto.nombre || ""}
                value={
                  productosUnicosFiltrados.find(
                    (producto) => producto.id_producto === ventaData.productoId
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    handleProductoChange(newValue.id_producto, newValue);
                    setCantidad();
                    setCantidadPorUnidad();
                  }
                }}
                isOptionEqualToValue={(option, value) =>
                  option.id_producto === value.id_producto
                }
                filterOptions={(options, { inputValue }) => {
                  return options.filter(
                    (option) =>
                      option.nombre
                        .toLowerCase()
                        .includes(inputValue.toLowerCase()) ||
                      option.codigo_barra
                        ?.toLowerCase()
                        .includes(inputValue.toLowerCase())
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Producto" />
                )}
              />
            </FormControl>
          </Grid>

          {lotesProducto.length > 0 && (
            <Grid item xs={12} sm={12} sx={{ display: "none" }}>
              <FormControl fullWidth>
                <InputLabel>Lote</InputLabel>
                <Select
                  value={ventaData.loteId || ""}
                  label="Lote"
                  onChange={(e) => handleLoteChange(e.target.value)}
                >
                  {lotesProducto.map((lote) => (
                    <MenuItem
                      key={lote?.lote?.id_lote}
                      value={lote?.lote?.id_lote}
                    >
                      {new Date(lote?.lote?.fecha_ingreso).toLocaleDateString(
                        "es-ES"
                      )}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          )}

          {cantUnitLimit !== 0 && pesoLimit <= 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad por unidad"
                type="number"
                value={cantidadPorUnidad}
                onChange={(e) =>
                  setCantidadPorUnidad(Math.min(e.target.value, cantUnitLimit))
                }
                inputProps={{
                  max: cantUnitLimit,
                }}
                fullWidth
              />
              <Typography variant="caption" color="textSecondary">
                Límite máximo: {cantUnitLimit} u
              </Typography>
            </Grid>
          )}

          {cantUnitLimit === 0 && cantLimit > 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                label="Cantidad"
                type="number"
                value={cantidad}
                onChange={(e) =>
                  setCantidad(Math.min(e.target.value, cantLimit))
                }
                inputProps={{
                  max: cantLimit,
                }}
                fullWidth
              />
              <Typography variant="caption" color="textSecondary">
                Límite máximo: {cantLimit}
              </Typography>
            </Grid>
          )}

          {pesoLimit > 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-number"
                label="Peso"
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value, pesoLimit)}
                inputProps={{
                  max: pesoLimit,
                  step: "0.01",
                }}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              />
              <Typography variant="caption" color="textSecondary">
                Límite máximo: {pesoLimit} Kg
              </Typography>
            </Grid>
          )}

          {/* {pesoLimit > 0 && (
            <Grid item xs={12} sm={6}>
              <TextField
                id="outlined-number"
                label="Precio"
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
              />
            </Grid>
          )} */}
          {Array.isArray(metodosVenta) && metodosVenta.length > 0 ? (
            <Box>
              <Typography
                style={{
                  textAlign: "center",
                  margin: "1rem 0 2rem 0",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                }}
              >
                Venta por mayor
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                {Array.isArray(metodosVenta) && metodosVenta.length > 0 ? (
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Método de Venta</InputLabel>
                      <Select
                        onChange={handleChangeMetodo}
                        label="Método de Venta"
                      >
                        {metodosVenta.map((metodo) => (
                          <MenuItem key={metodo.id_metodo_venta} value={metodo}>
                            {metodo.descripcion}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <Typography variant="caption" color="textSecondary">
                      Límite máximo: {cantLimit} cajas
                    </Typography>
                  </Grid>
                ) : null}

                {Array.isArray(metodosVenta) && metodosVenta.length > 0 ? (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Cantidad por metodo"
                      type="number"
                      value={cantidadMetodo}
                      onChange={(e) => setcantidadMetodo(e.target.value)}
                      inputProps={{
                        max: cantUnitLimit,
                      }}
                      fullWidth
                    />
                    {/* <Typography variant="caption" color="textSecondary">
                      Límite máximo: {cantUnitLimit} u
                    </Typography> */}
                  </Grid>
                ) : null}
              </Grid>
            </Box>
          ) : null}
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              gap: "2rem",
              marginTop: "2rem",
            }}
          >
            <Button
              variant="contained"
              style={{
                backgroundColor: "red",
                color: "#fff",
                fontWeight: "bold",
              }}
              fullWidth
              onClick={handleCancelar}
            >
              Cancelar
            </Button>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#f5f5f5",
                color: "#fff",
                fontWeight: "bold",
              }}
              fullWidth
              type="submit"
            >
              Añadir
            </Button>
          </Box>
        </Grid>
      </form>
    </Box>
  );
};

export default SalidaForm;
