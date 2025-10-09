import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Box,
  Typography,
} from "@mui/material";

const ProductoAutocompleteComponent = ({
  handleProductoChange,
  setCantidad,
  setCantidadPorUnidad,
  productosConTotales,
}) => {
  console.log(productosConTotales);

  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const matchedProduct = productosConTotales.find(
        (producto) =>
          producto.codigo_barra &&
          producto.codigo_barra.toLowerCase() === inputValue.toLowerCase()
      );

      if (matchedProduct) {
        handleProductoChange(matchedProduct.id_producto, matchedProduct);
        setCantidad();
        setCantidadPorUnidad();
        setInputValue("");
        setSelectedValue(null);
      }
    }
  };

  return (
    <FormControl fullWidth>
      <Box
        sx={{
          "& .MuiAutocomplete-input": {
            fontWeight: 500,
          },
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#f9f9f9",
            borderRadius: 1,
          },
          "& .MuiAutocomplete-endAdornment": {
            color: "#555",
          },
        }}
      >
        <Autocomplete
          options={productosConTotales || []}
          getOptionLabel={(producto) => {
            const nombre = producto?.nombre?.toUpperCase() || "";
            const prov = producto?.proveedor?.nombre?.toUpperCase() || "";
            const forma = producto?.forma_farmaceutica?.toUpperCase() || "";
            const conc = producto?.concentracion || "";
            const cod = producto?.codigo_barra || "";
            const stock = producto?.totalSubCantidad ?? 0;
            return `${nombre} ${forma} ${conc} - “${prov}” [${cod}] Stock: ${stock}u.`;
          }}
          value={selectedValue}
          onChange={(event, newValue) => {
            if (newValue) {
              handleProductoChange(newValue.id_producto, newValue);
            }
            setInputValue("");
            setSelectedValue(null);
          }}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          isOptionEqualToValue={(option, value) =>
            option?.id_producto === value?.id_producto
          }
          filterOptions={(options, { inputValue }) => {
            const searchWords = inputValue.toLowerCase().trim().split(/\s+/);

            return options.filter((option) => {
              const combined = [
                option?.nombre,
                option?.proveedor?.nombre,
                option?.codigo_barra,
                option?.forma_farmaceutica,
                option?.concentracion,
              ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

              return searchWords.every((word) => combined.includes(word));
            });
          }}
          renderOption={(props, option) => {
            const nombre = option.nombre || "";
            //const prov = option.metodoVentaBase ? "" : "b";
            const stock = option.totalSubCantidad ?? 0;
            const forma = option?.forma_farmaceutica || "";
            const conc = option?.concentracion || "";
            const cod = option?.codigo_barra || "";
            const precio = option?.metodoVentaBase
              ? option?.metodoVentaBase.precio
              : option.precio || "";

            return (
              <Box
                component="li"
                {...props}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  py: 1,
                  px: 2,
                  "&:hover": { backgroundColor: "#f0f4ff" },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 510, color: "#000", textAlign: "center" }}
                >
                  {nombre} {forma} {conc} {cod}
                  {/* <Typography
                    component="span"
                    variant="body1"
                    sx={{ fontWeight: 500, color: "#000", ml: 0.5 }}
                  >
                    “{prov}”
                  </Typography> */}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: stock > 0 ? "green" : "red", mt: 0.3 }}
                >
                  Stock: {stock} u.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: stock > 0 ? "green" : "red", mt: 0.3 }}
                >
                  Precio: {precio} Bs.
                </Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} label="Producto" onKeyDown={handleKeyDown} />
          )}
        />
      </Box>
    </FormControl>
  );
};

export default ProductoAutocompleteComponent;
