import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  IconButton,
  Paper,
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useStyles from "./tableAlmacenes.styles";
import background from "../../../../assets/images/logos/3.png";

function Row({ row }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const totalPrecio = row.lotes.reduce((acc, lote) => {
    const precio = parseFloat(lote.detalleCompra.precio_unitario) || 0;
    return acc + precio * lote.detalleCompra.cantidad;
  }, 0);

  return (
    <>
      <TableRow style={{ backgroundColor: "#c7e3ff" }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell style={{ fontWeight: "bold" }}>{row.nombre}</TableCell>
        <TableCell>{row.lotes.length}</TableCell>
        <TableCell style={{ fontWeight: "bold" }}>
          {totalPrecio.toFixed(2)}
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell>Nº Lote</TableCell>
                    <TableCell>Fecha Ingreso</TableCell>
                    <TableCell>Fecha Caducidad</TableCell>
                    <TableCell>Cantidad</TableCell>
                    <TableCell>SubCantidad</TableCell>
                    <TableCell>Cantidad por Caja</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.lotes.map((lote) => (
                    <TableRow key={lote.id_lote}>
                      <TableCell>
                        {lote.detalleCompra.producto.nombre}
                      </TableCell>
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
                          (parseFloat(lote.detalleCompra.precio_unitario) ||
                            0) * lote.detalleCompra.cantidad
                        ).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function TableAlmacenesReport({ reportData }) {
  const classes = useStyles();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte por Proveedor", 80, 10);

    reportData.forEach((prov) => {
      doc.autoTable({
        head: [["Proveedor", "Total Lotes", "Total Precio"]],
        body: [
          [
            prov.nombre,
            prov.lotes.length,
            prov.lotes
              .reduce(
                (acc, lote) =>
                  acc +
                  (parseFloat(lote.detalleCompra.precio_unitario) || 0) *
                    lote.detalleCompra.cantidad,
                0
              )
              .toFixed(2),
          ],
        ],
        startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 20,
      });

      doc.autoTable({
        head: [
          [
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
        body: prov.lotes.map((lote) => [
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
        ]),
        startY: doc.lastAutoTable.finalY + 5,
      });
    });

    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", 80, doc.previousAutoTable.finalY + 10, 40, 40);
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
              <TableCell />
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Proveedor
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Total Productos
              </TableCell>
              <TableCell style={{ color: "white", fontWeight: "bold" }}>
                Total Precio
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((row) => (
              <Row key={row.id_proveedor} row={row} />
            ))}
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
