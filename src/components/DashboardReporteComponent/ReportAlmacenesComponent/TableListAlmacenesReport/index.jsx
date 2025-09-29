import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useStyles from "./tableAlmacenes.styles";
import background from "../../../../assets/images/logos/3.png";

export default function TableListAlmacenesReport({ reportData }) {
  const classes = useStyles();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte General de Lotes", 80, 10);

    const allLotes = [];

    reportData.forEach((prov) => {
      prov.lotes.forEach((lote) => {
        allLotes.push([
          prov.nombre,
          lote.detalleCompra.producto.nombre,
          lote.numero_lote,
          new Date(lote.fecha_ingreso).toLocaleDateString(),
          new Date(lote.fecha_caducidad).toLocaleDateString(),
          lote.cantidad,
          lote.subCantidad,
          lote.cantidadPorCaja || "N/A",
          (
            (parseFloat(lote.detalleCompra.precio_unitario) || 0) *
            lote.detalleCompra.cantidad
          ).toFixed(2),
        ]);
      });
    });

    doc.autoTable({
      head: [
        [
          "Proveedor",
          "Producto",
          "Nº Lote",
          "F. Ingreso",
          "F. Caducidad",
          "Cantidad",
          "SubCantidad",
          "Caja",
          "Precio",
        ],
      ],
      body: allLotes,
      startY: 20,
    });

    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", 80, doc.lastAutoTable.finalY + 10, 40, 40);
      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
      setOpenDialog(true);
    };
  };

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="500px"
              title="Vista previa del PDF"
            ></iframe>
          )}
        </DialogContent>
      </Dialog>

      <TableContainer component={Paper} className={classes.tableContainer}>
        <Table>
          <TableHead style={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Proveedor
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Producto
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Nº Lote
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                F. Ingreso
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                F. Caducidad
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Cantidad
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                SubCantidad
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Caja
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Precio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.flatMap((prov) =>
              prov.lotes.map((lote) => (
                <TableRow key={lote.id_lote}>
                  <TableCell>{prov.nombre}</TableCell>
                  <TableCell>{lote.detalleCompra.producto.nombre}</TableCell>
                  <TableCell>{lote.numero_lote}</TableCell>
                  <TableCell>
                    {new Date(lote.fecha_ingreso).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(lote.fecha_caducidad).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{lote.cantidad}</TableCell>
                  <TableCell>{lote.subCantidad}</TableCell>
                  <TableCell>{lote.cantidadPorCaja || "N/A"}</TableCell>
                  <TableCell>
                    {(
                      (parseFloat(lote.detalleCompra.precio_unitario) || 0) *
                      lote.detalleCompra.cantidad
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Button variant="contained" color="primary" onClick={generatePDF}>
          Guardar Reporte
        </Button>
      </Box>
    </>
  );
}
