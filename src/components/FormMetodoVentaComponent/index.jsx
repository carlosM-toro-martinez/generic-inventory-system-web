import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useMutation } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formMetodoVenta.styles";
import metodoVentasAddService from "../../async/services/post/metodoVentasAddService";

function FormMetodoVenta({ handleClose, refetchMetodoVentas, productos }) {
  const classes = useStyles();

  const [descripcion, setDescripcion] = useState("");
  const [cantidadPorMetodo, setCantidadPorMetodo] = useState();
  const [precio, setPrecio] = useState();
  const [pesoPorMetodo, setPesoPorMetodo] = useState();
  const [unidadVenta, setUnidadVenta] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedOption, setSelectedOption] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(metodoVentasAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Método de venta creado exitosamente!",
        severity: "success",
      });
      setCantidadPorMetodo();
      setPrecio();
      setPesoPorMetodo();
      setUnidadVenta("");
      setDescripcion("");
      setSelectedProduct(null);
      setSelectedOption("");
      refetchMetodoVentas();
      handleClose();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear el método de venta: ${error.message}`,
        severity: "error",
      });
    },
  });

  const handleCheckboxChange = (option) => {
    setSelectedOption(option);
    setCantidadPorMetodo();
    setPrecio();
    setPesoPorMetodo();
    setUnidadVenta("");
    setDescripcion("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedProduct) {
      const data = {
        descripcion,
        cantidad_por_metodo: cantidadPorMetodo,
        precio,
        peso_por_metodo:
          selectedOption === "peso_por_unidad"
            ? parseFloat(pesoPorMetodo)
            : null,
        unidad_venta: selectedOption === "peso_por_unidad" ? unidadVenta : null,
        id_producto: selectedProduct.id_producto,
      };
      mutation.mutate(data);
    } else {
      setSnackbar({
        open: true,
        message: "Por favor, selecciona un producto.",
        severity: "error",
      });
    }
  };

  const conversionRates = {
    kilogramo: 1,
    libra: 0.453592,
    cuartilla: 2.835,
    onza: 0.0283495,
    arroba: 11.34,
    quintal: 50,
  };

  const handleUnidadVentaChange = (selectedUnit) => {
    setUnidadVenta(selectedUnit);
    const conversion = conversionRates[selectedUnit] || 0;
    setDescripcion(selectedUnit);
    setPesoPorMetodo(parseFloat(conversion.toFixed(2)));
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Autocomplete
              options={productos || []}
              getOptionLabel={(option) => (option.nombre ? option.nombre : "")}
              onChange={(event, newValue) => {
                setSelectedProduct(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar Producto"
                  variant="outlined"
                  fullWidth
                  required
                  className={classes.input}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripción"
              variant="outlined"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Precio"
              variant="outlined"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              fullWidth
              required
              className={classes.input}
              type="number"
            />
          </Grid>
          <Grid item xs={12}>
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === "peso"}
                  onChange={() => handleCheckboxChange("peso")}
                />
              }
              label="Peso"
            /> */}
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === "cantidad"}
                  onChange={() => handleCheckboxChange("cantidad")}
                />
              }
              label="Cantidad"
            /> */}
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={selectedOption === "peso_por_unidad"}
                  onChange={() => handleCheckboxChange("peso_por_unidad")}
                />
              }
              label="Peso por Unidad"
            /> */}
          </Grid>

          {/* {selectedOption === "peso" && (
            <Grid item xs={12}>
              <TextField
                label="Peso por Método"
                variant="outlined"
                value={pesoPorMetodo}
                onChange={(e) => setPesoPorMetodo(e.target.value)}
                fullWidth
                className={classes.input}
                type="number"
              />
            </Grid>
          )} */}
          <Grid item xs={12}>
            <TextField
              label="Cantidad por Método"
              variant="outlined"
              value={cantidadPorMetodo}
              onChange={(e) => setCantidadPorMetodo(e.target.value)}
              fullWidth
              className={classes.input}
              type="number"
            />
          </Grid>

          {/* {selectedOption === "cantidad" && (
            <Grid item xs={12}>
              <TextField
                label="Cantidad por Método"
                variant="outlined"
                value={cantidadPorMetodo}
                onChange={(e) => setCantidadPorMetodo(e.target.value)}
                fullWidth
                className={classes.input}
                type="number"
              />
            </Grid>
          )}

          {selectedOption === "peso_por_unidad" && (
            <Grid item xs={12}>
              <TextField
                select
                label="Unidad de Venta"
                value={unidadVenta}
                onChange={(e) => handleUnidadVentaChange(e.target.value)}
                fullWidth
                className={classes.input}
                required
              >
                {[
                  "kilogramo",
                  "libra",
                  "cuartilla",
                  "onza",
                  "arroba",
                  "quintal",
                ].map((unidad) => (
                  <MenuItem key={unidad} value={unidad}>
                    {unidad}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          )} */}

          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              onClick={handleClose}
            >
              Cerrar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              className={classes.button}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? "Creando..." : "Crear Método de Venta"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default FormMetodoVenta;
