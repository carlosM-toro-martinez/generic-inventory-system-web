import React from "react";
import DrawerComponent from "../../../components/DrawerComponent";
import { useQuery } from "react-query";
import productosService from "../../../async/services/get/productosService";
import proveedoresService from "../../../async/services/get/proveedoresService";
import loteService from "../../../async/services/get/loteService";
import RegisterBuyComponent from "../../../components/RegisterBuyComponent";
import { Paper } from "@mui/material";

function CreateAlmacenes() {
  const {
    data: productsData,
    isLoading: isLoadingProducts,
    error: errorProducts,
    refetch: refetchProducts,
  } = useQuery(`products`, productosService);
  const {
    data: proveedoresData,
    isLoading: isLoadingProveedores,
    error: errorProveedores,
    refetch: refetchProveedores,
  } = useQuery(`proveedores`, proveedoresService);
  const {
    data: loteData,
    isLoading: isLoadingLote,
    error: errorLote,
    refetch: refetchLote,
  } = useQuery(`loteData`, loteService);

  return (
    <>
      <DrawerComponent>
        {!isLoadingProducts && !isLoadingProveedores && !isLoadingLote ? (
          <Paper
            elevation={3}
            style={{
              padding: "1rem",
              backgroundColor: "#fff",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginTop: "1rem",
            }}
          >
            <RegisterBuyComponent
              products={productsData}
              refetchProducts={refetchProducts}
              proveedores={proveedoresData}
              refetchProveedores={refetchProveedores}
              lotes={loteData}
              refetchLote={refetchLote}
            />
          </Paper>
        ) : null}
      </DrawerComponent>
    </>
  );
}

export default CreateAlmacenes;
