import React, { useEffect, useState } from "react";
import { InputAdornment, TextField, Box } from "@mui/material";

const LoteFormComponent = ({
  lote,
  fechaCaducidad,
  cantidad,
  setCantidad,
  precio,
  setPrecio,
  setError,
  isLoteProveedorLocked,
  subCantidad,
  setSubCantidad,
  precioVenta,
  setPrecioVenta,
  productoSelected,
  setProductoSelected,
}) => {
  const [selectedPercent, setSelectedPercent] = useState(30);
  const [errors, setErrors] = useState({
    lote: false,
    fechaCaducidad: false,
    loteExists: false,
    caducidadPasada: false,
  });

  useEffect(() => {
    let nuevoPrecio;
    if (subCantidad) {
      nuevoPrecio = (precio / subCantidad) * (1 + selectedPercent / 100);
    } else {
      nuevoPrecio = precio * (1 + selectedPercent / 100);
    }

    setPrecioVenta(Number(nuevoPrecio.toFixed(2)));
  }, [precio, selectedPercent, subCantidad]);

  useEffect(() => {
    if (productoSelected?.cantCaja) {
      setSubCantidad(productoSelected.cantCaja);
    } else {
      setSubCantidad();
    }
  }, [productoSelected]);

  useEffect(() => {
    validateForm();
  }, [lote, fechaCaducidad]);

  const validateForm = () => {
    let newErrors = {
      lote: false,
      fechaCaducidad: false,
      loteExists: false,
      caducidadPasada: false,
    };

    let hasErrors = false;

    if (!lote && !isLoteProveedorLocked) {
      newErrors.lote = true;
      hasErrors = true;
    }

    if (!fechaCaducidad) {
      newErrors.fechaCaducidad = true;
      hasErrors = true;
    } else {
      const today = new Date();
      const selectedDate = new Date(fechaCaducidad);
      if (selectedDate < today.setHours(0, 0, 0, 0)) {
        newErrors.caducidadPasada = true;
        hasErrors = true;
      }
    }

    setErrors(newErrors);
    setError(hasErrors);
  };

  const porcentajes = Array.from(
    { length: (40 - 15) / 5 + 1 },
    (_, i) => 15 + i * 5
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 2,
        p: 2,
      }}
    >
      <Box
        sx={{
          flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "15%" },
          minWidth: 250,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label="Paquetes o cajas"
          type="number"
          value={cantidad || ""}
          onChange={(e) => setCantidad(e.target.value)}
          //helperText="Ej. 3 paq de cocacola"
          required
          fullWidth
        />
      </Box>

      <Box
        sx={{
          flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "15%" },
          minWidth: 250,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label="Cantidad por paquete"
          type="number"
          value={subCantidad || ""}
          onChange={(e) => setSubCantidad(e.target.value)}
          //helperText="Ej. 6 cocacolas por paq."
          //required
          fullWidth
        />
      </Box>

      <Box
        sx={{
          flexBasis: { xs: "100%", sm: "50%", md: "33.33%", lg: "15%" },
          minWidth: 250,
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          label="Precio por caja"
          type="number"
          value={precio || ""}
          onChange={(e) => setPrecio(e.target.value)}
          //helperText="Ej. 60 Bs por paq."
          InputProps={{
            endAdornment: <InputAdornment position="end">Bs</InputAdornment>,
          }}
          fullWidth
        />
      </Box>

      {/* <Snackbar
        open={errors.loteExists}
        autoHideDuration={10000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={"error"}>Error el numero de lote ya existe</Alert>
      </Snackbar> */}
    </Box>
  );
};

export default LoteFormComponent;
