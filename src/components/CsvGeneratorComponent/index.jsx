import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Snackbar, Alert } from "@mui/material";

const CsvGeneratorComponent = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  // 📂 Manejar subida de archivo
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        // Convertir a JSON
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!rows || rows.length === 0) {
          setSnackbar({
            open: true,
            message: "El archivo está vacío o no tiene encabezados válidos",
            severity: "error",
          });
          return;
        }

        generateCSVs(rows);
      } catch (error) {
        console.error(error);
        setSnackbar({
          open: true,
          message: "Error al procesar el archivo CSV",
          severity: "error",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // 🧩 Generar los dos CSVs
  const generateCSVs = (rows) => {
    // CSV 1 → productos.csv
    const productos = rows.map((row) => ({
      id_producto: row["id_producto"] || "",
      nombre: row["nombre"] || "",
      codigo_barra: row["codigo_barra"] || "",
      id_categoria: row["categoria"] || 9,
      precio: row["precio (venta)"] || "",
      uso_res: false,
    }));

    // CSV 2 → compras.csv
    const compras = rows.map((row, index) => ({
      id_proveedor: 1,
      id_producto: row["id_producto"] || "",
      numero_lote: `L${String(index + 1).padStart(3, "0")}`,
      cantidad: row["cantidad"] || "",
      precio_unitario: row["precio (compra)"] || row["precio (venta)"] || "",
      peso: "",
      subCantidad: row["cantidad"] || "",
      cantidadPorCaja: 1,
      fecha_caducidad: "2027-12-30",
      precioVenta: row["precio (venta)"] || "",
    }));

    // Descargar archivos
    downloadCSV(productos, "productos.csv");
    downloadCSV(compras, "compras.csv");

    setSnackbar({
      open: true,
      message: "CSVs generados correctamente 🎉",
      severity: "success",
    });
  };

  // 💾 Generar y descargar CSV
  const downloadCSV = (data, filename) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvData = XLSX.utils.sheet_to_csv(worksheet, { FS: ";" });
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Generar CSVs de Productos y Compras</h2>
      <p>
        Sube tu archivo original (.csv) y se generarán automáticamente los dos
        archivos nuevos.
      </p>

      <Button
        variant="contained"
        component="label"
        color="primary"
        sx={{ fontWeight: "bold", borderRadius: "2rem" }}
      >
        Seleccionar archivo CSV
        <input hidden type="file" accept=".csv" onChange={handleFileUpload} />
      </Button>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CsvGeneratorComponent;
