import React, { useState } from "react";
import { Button, Snackbar, Grid } from "@mui/material";
import Alert from "@mui/material/Alert";
import * as XLSX from "xlsx";
import { useMutation } from "react-query";
import productsAddService from "../../async/services/post/productsAddServices";

function ImportProducts() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const mutation = useMutation((product) => productsAddService(product), {
    onSuccess: () => {
      setSnackbar({
        open: true,
        message: `Producto creado exitosamente!`,
        severity: "success",
      });
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al crear producto: ${error.message}`,
        severity: "error",
      });
      setIsProcessing(false);
    },
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
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

      // Procesar uno por uno
      for (const row of rows) {
        const product = {
          id_producto: row["id_producto"] || "",
          nombre: row["nombre"] || "",
          codigo_barra: row["codigo_barra"] || "",
          id_categoria: row["id_categoria"] || "",
          precio: row["precio"] || 0,
          stock: row["stock"] || 0,
          cantCaja: row["cantCaja"] || 0,
          forma_farmaceutica: row["forma_farmaceutica"] || "",
          concentracion: row["concentracion"] || "",
          uso_res: row["uso_res"] === "true" || row["uso_res"] === true,
        };

        // esperar cada uno antes de seguir
        await mutation.mutateAsync(product);
      }

      setSnackbar({
        open: true,
        message: "Productos importados exitosamente!",
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
            id="import-products-input"
          />
          <label htmlFor="import-products-input">
            <Button
              variant="contained"
              component="span"
              color="primary"
              disabled={isProcessing}
            >
              {isProcessing ? "Importando..." : "Importar Excel/CSV"}
            </Button>
          </label>
        </Grid>
      </Grid>

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

export default ImportProducts;
