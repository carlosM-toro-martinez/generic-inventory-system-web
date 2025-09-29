import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { useMutation, useQuery } from "react-query";
import Alert from "@mui/material/Alert";
import useStyles from "./formProduct.styles";
import productsAddService from "../../async/services/post/productsAddServices";
import productoOneUpdateServices from "../../async/services/put/productoOneUpdateServices";
import categoriasService from "../../async/services/get/categoriasService";

function FormProduct({ handleClose, refetchProducts, productData }) {
  const classes = useStyles();

  const [productId, setProductId] = useState(
    productData ? productData.id_producto : null
  );

  const [product, setProduct] = useState({
    nombre: productData ? productData.nombre : "",
    codigo_barra: productData ? productData.codigo_barra : "",
    id_categoria: productData ? productData.id_categoria : "",
    precio: productData ? productData.precio : 0,
    stock: productData ? productData.stock : 0,
    cantCaja: productData ? productData.cantCaja : 0,
    forma_farmaceutica: productData ? productData.forma_farmaceutica : "",
    concentracion: productData ? productData.concentracion : "",
    uso_res: productData ? productData.uso_res : false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (productData) {
      setProduct({
        nombre: productData.nombre,
        codigo_barra: productData.codigo_barra,
        id_categoria: productData.id_categoria,
        precio: productData.precio ? productData.precio : 0,
        stock: productData.stock,
        cantCaja: productData.cantCaja,
        forma_farmaceutica: productData.forma_farmaceutica,
        concentracion: productData.concentracion,
        uso_res: productData.uso_res,
      });
    }
  }, [productData]);

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooleanChange = (e) => {
    setProduct({
      ...product,
      uso_res: e.target.value === "true",
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const {
    data: categorias,
    isLoading: isLoadingCategorias,
    isError,
  } = useQuery("categorias", categoriasService);

  const mutation = useMutation(
    productId
      ? () => productoOneUpdateServices(productId, product)
      : () => productsAddService(product),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          message: productId
            ? "Producto actualizado exitosamente!"
            : "Producto creado exitosamente!",
          severity: "success",
        });
        handleClose();
        refetchProducts();
      },
      onError: (error) => {
        setSnackbar({
          open: true,
          message: `Error al ${
            productId ? "actualizar" : "crear"
          } el producto: ${error.message}`,
          severity: "error",
        });
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nombre"
              name="nombre"
              variant="outlined"
              value={product.nombre}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Código"
              name="codigo_barra"
              variant="outlined"
              value={product.codigo_barra}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Cant. caj/paq"
              name="cantCaja"
              variant="outlined"
              value={product.cantCaja}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Precio salida de almacen"
              name="precio"
              variant="outlined"
              value={product.precio}
              onChange={handleChange}
              fullWidth
              required
              className={classes.input}
              type="number"
              inputProps={{ step: "0.01" }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="categoria-label">Categoría</InputLabel>
              <Select
                labelId="categoria-label"
                id="categoria-select"
                name="id_categoria"
                variant="outlined"
                label="Categoría"
                value={product.id_categoria}
                onChange={handleChange}
                className={classes.input}
                disabled={isLoadingCategorias || isError}
              >
                {categorias &&
                  categorias.map((categoria) => (
                    <MenuItem
                      key={categoria.id_categoria}
                      value={categoria.id_categoria}
                    >
                      {categoria.nombre}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="uso-res-label">Uso Restringido</InputLabel>
              <Select
                labelId="uso-res-label"
                id="uso-res-select"
                name="uso_res"
                variant="outlined"
                label="Uso Restringido"
                value={String(product.uso_res)}
                onChange={handleBooleanChange}
                className={classes.input}
              >
                <MenuItem value="true">SI</MenuItem>
                <MenuItem value="false">NO</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="error"
              className={classes.button}
              disabled={mutation.isLoading}
              onClick={handleClose}
            >
              Cancelar
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.button}
              disabled={mutation.isLoading}
            >
              {mutation.isLoading
                ? productId
                  ? "Actualizando..."
                  : "Creando..."
                : productId
                ? "Actualizar Producto"
                : "Crear Producto"}
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

export default FormProduct;
