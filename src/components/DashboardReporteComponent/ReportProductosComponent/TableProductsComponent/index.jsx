import React, { useState } from "react";
import MyAutocomplete from "../../../MyAutocomplete";
import { Box, CircularProgress } from "@mui/material";
import productHistoryService from "../../../../async/services/get/productHistoryService";
import { useQuery } from "react-query";
import HistoryProductComponent from "./HistoryProductComponent"; // Ajusta la ruta si es necesario

function TableProductsComponent({ products }) {
  const [producto, setProducto] = useState();
  const [productoName, setProductoName] = useState();
  const [idProduct, setIdProduct] = useState(null);

  const {
    data: historyData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery(
    ["product-history", idProduct],
    () => productHistoryService(idProduct),
    {
      enabled: !!idProduct,
    }
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <MyAutocomplete
        options={products}
        getOptionLabel={(opt) =>
          `${opt.nombre} ${opt.forma_farmaceutica ?? ""} ${
            opt.concentracion ?? ""
          }`
        }
        onChange={(opt) => {
          setProducto(opt ?? null);
          setProductoName(opt?.nombre ?? "");
          setIdProduct(opt?.id_producto ?? null);
        }}
        label="Producto"
        placeholder="Buscar producto..."
        disableClearable={true}
        productoName={productoName}
        producto={producto}
      />

      {isLoading && <CircularProgress sx={{ mt: 2 }} />}
      {isError && (
        <Box sx={{ mt: 2, color: "red" }}>Error al cargar historial</Box>
      )}
      {isSuccess && historyData && (
        <Box sx={{ width: "100%", mt: 3 }}>
          <HistoryProductComponent history={historyData} producto={producto} />
        </Box>
      )}
    </Box>
  );
}

export default TableProductsComponent;
