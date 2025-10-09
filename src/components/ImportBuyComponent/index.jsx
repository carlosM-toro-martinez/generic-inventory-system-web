import React, { useState, useContext } from "react";
import { Button, Grid, Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import { useMutation } from "react-query";
import buyAddService from "../../async/services/post/buyAddService";
import { MainContext } from "../../context/MainContext";
import { getLocalDateTime } from "../../utils/getDate";

function ImportBuyComponent({
  refetchProducts,
  refetchProveedores,
  refetchLote,
}) {
  const { user } = useContext(MainContext);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation(buyAddService, {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: "Compras importadas exitosamente!",
        severity: "success",
      });
      refetchProducts && refetchProducts();
      refetchProveedores && refetchProveedores();
      refetchLote && refetchLote();
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al importar compras: ${
          error.message || "Intenta de nuevo"
        }`,
        severity: "error",
      });
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ✅ Divide un array en grupos de tamaño "size"
  const chunkArray = (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Leer primera hoja
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet);

      // Transformar filas en el formato esperado por el endpoint
      const transformedArray = rows.map((row) => ({
        detalleCompraData: {
          id_proveedor: row["id_proveedor"],
          id_producto: row["id_producto"],
          numero_lote: row["numero_lote"] || "",
          cantidad: row["cantidad"] || 0,
          precio_unitario: row["precio_unitario"] || 0,
          peso: row["peso"] || null,
          subCantidad: row["subCantidad"] || 0,
          cantidadPorCaja: row["cantidadPorCaja"] || 1,
          fecha_ingreso: row["fecha_ingreso"] || getLocalDateTime(),
          fecha_compra: row["fecha_compra"] || getLocalDateTime(),
          fecha_caducidad: "2027-12-30",
          id_trabajador: user?.id_trabajador,
        },
        loteData: {
          id_proveedor: row["id_proveedor"],
          id_producto: row["id_producto"],
          numero_lote: row["numero_lote"] || "",
          cantidad: row["cantidad"] || 0,
          precio_unitario: row["precio_unitario"] || 0,
          peso: row["peso"] || null,
          subCantidad: row["subCantidad"] || 0,
          cantidadPorCaja: row["cantidadPorCaja"] || 1,
          fecha_ingreso: row["fecha_ingreso"] || getLocalDateTime(),
          fecha_compra: row["fecha_compra"] || getLocalDateTime(),
          fecha_caducidad: "2027-12-30",
          id_trabajador: user?.id_trabajador,
          precioVenta: row["precioVenta"] || 0,
        },
        productId: row["id_producto"],
        productUpdateData: {
          tipo_movimiento: "compra",
          cantidad: row["cantidad"] || 0,
          precio_unitario: row["precio_unitario"] || 0,
          fecha_caducidad: "2027-12-30",
          peso: row["peso"] || null,
          subCantidad: row["subCantidad"] || 0,
          cantidadPorCaja: row["cantidadPorCaja"] || 1,
          id_trabajador: user?.id_trabajador,
        },
      }));

      // Enviar en grupos de 10
      const chunks = chunkArray(transformedArray, 10);
      for (const chunk of chunks) {
        await mutation.mutateAsync(chunk);
      }

      setSnackbar({
        open: true,
        message: "Todas las compras fueron importadas exitosamente!",
        severity: "success",
      });

      setIsProcessing(false);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <input
            accept=".xlsx, .xls, .csv"
            type="file"
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="import-buy-input"
          />
          <label htmlFor="import-buy-input">
            <Button
              variant="contained"
              component="span"
              color="primary"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Importando compras..."
                : "Importar Compras Excel/CSV"}
            </Button>
          </label>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
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

export default ImportBuyComponent;
