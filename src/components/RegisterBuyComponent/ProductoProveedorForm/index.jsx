import React, { useState, useEffect, useMemo } from "react";
import {
  FormControl,
  MenuItem,
  Button,
  Box,
  Popper,
  Paper,
  InputLabel,
  Select,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Typography, Autocomplete, TextField } from "@mui/material";
import MyAutocomplete from "../../MyAutocomplete";

const ProductoProveedorForm = ({
  proveedor,
  setProveedor,
  producto,
  setProducto,
  productos,
  proveedores,
  handleOpenProductoModal,
  handleOpenProveedorModal,
  isLoteProveedorLocked,
  setError,
  setProductoName,
  setProveedorName,
  setLote,
  lote,
  fechaCaducidad,
  setFechaCaducidad,
  loteData,
  productoName,
  productoSelected,
  setProductoSelected,
}) => {
  const [errors, setErrors] = useState({
    proveedor: false,
    producto: false,
  });

  const [filteredProductos, setFilteredProductos] = useState([]);

  useEffect(() => {
    validateForm();
  }, [proveedor, producto]);

  const validateForm = () => {
    let newErrors = {
      proveedor: false,
      producto: false,
    };

    let hasErrors = false;

    if (!proveedor) {
      newErrors.proveedor = true;
      hasErrors = true;
    }

    if (!producto) {
      newErrors.producto = true;
      hasErrors = true;
    }

    setErrors(newErrors);
    setError(hasErrors);
  };

  const generateRandomLote = () => {
    let randomLote;
    const maxAttempts = 100;
    let attempt = 0;
    do {
      randomLote = Math.floor(100000 + Math.random() * 900000).toString();
      attempt++;
    } while (
      loteData?.some((item) => item.numero_lote === randomLote) &&
      attempt < maxAttempts
    );

    if (attempt < maxAttempts) {
      setLote(randomLote);
    } else {
      alert("No se pudo generar un número de lote único, intenta de nuevo.");
    }
  };
  const productosMemo = useMemo(() => productos, [productos]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 2,
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      <FormControl
        error={errors.producto}
        sx={{ minWidth: 200, flexShrink: 0 }}
      >
        {/* <Autocomplete
          key="autocomplete-productos"
          options={productosMemo}
          getOptionLabel={(opt) =>
            `${opt?.nombre || ""} ${opt?.forma_farmaceutica || ""} ${
              opt?.concentracion || ""
            }`
          }
          filterOptions={(opts, { inputValue }) =>
            opts.filter((p) =>
              p.nombre?.toLowerCase().includes(inputValue.toLowerCase())
            )
          }
          isOptionEqualToValue={(opt, val) =>
            opt.id_producto === val.id_producto
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label="Producto"
              variant="outlined"
              size="small"
            />
          )}
        /> */}
        <MyAutocomplete
          options={productos}
          getOptionLabel={(opt) =>
            `${opt.nombre} ${opt.forma_farmaceutica ?? ""} ${
              opt.concentracion ?? ""
            }`
          }
          onChange={(opt) => {
            setProducto(opt?.id_producto ?? null);
            setProductoName(opt?.nombre ?? "");
            setProductoSelected(opt);
          }}
          label="Producto"
          placeholder="Buscar producto..."
          disableClearable={true}
          productoName={productoName}
          producto={producto}
          setProductoSelected={setProductoSelected}
        />
      </FormControl>
      <Box
        sx={{
          flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "15%" },
          display: "flex",
          gap: 1,
          minWidth: 250,
        }}
      >
        <Button
          onClick={generateRandomLote}
          sx={{
            whiteSpace: "nowrap",
            fontWeight: "bold",
            backgroundColor: "#2596be",
            color: "#fff",
            borderRadius: "3rem",
          }}
        >
          gen
        </Button>
        <TextField
          variant="outlined"
          size="small"
          label="Número de Lote"
          value={lote}
          onChange={(e) => {
            setLote(e.target.value);
          }}
        />
      </Box>

      <FormControl size="small" sx={{ minWidth: 200, flexShrink: 0 }}>
        <Autocomplete
          size="small"
          sx={{ minWidth: 200, flexShrink: 0 }}
          options={proveedores}
          getOptionLabel={(option) => option.nombre.toUpperCase()}
          value={
            proveedores.find((prov) => prov.id_proveedor === proveedor) || null
          }
          onChange={(event, newValue) => {
            if (newValue) {
              setProveedor(newValue.id_proveedor);
              setProveedorName(newValue.nombre);
            } else {
              setProveedor("");
              setProveedorName("");
            }
          }}
          disabled={isLoteProveedorLocked}
          renderInput={(params) => <TextField {...params} label="Proveedor" />}
        />
      </FormControl>
      <Box
        sx={{
          flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "15%" },
          minWidth: 250,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label="Fecha de Caducidad"
          type="date"
          value={fechaCaducidad}
          onChange={(e) => setFechaCaducidad(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default ProductoProveedorForm;
