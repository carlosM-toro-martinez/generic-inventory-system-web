import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Typography,
  Paper,
  Box,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import useStyles from "./tableCaja.styles";
import background from "../../../../assets/images/logos/3.png";

function TableCajaReport({ reportData }) {
  const classes = useStyles();
  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte de Caja", 80, 10);

    // Datos principales de la tabla
    const tableData = reportData.map((caja) => [
      caja.monto_inicial,
      caja.monto_final,
      new Date(caja.fecha_apertura).toLocaleString(),
      caja.fecha_cierre
        ? new Date(caja.fecha_cierre).toLocaleString()
        : "No cerrado",
      `${caja.trabajadorCierre?.nombre || ""} ${
        caja.trabajadorCierre?.apellido_paterno || ""
      }`,
    ]);

    doc.autoTable({
      head: [
        [
          "Monto Inicial",
          "Monto Final",
          "Fecha Apertura",
          "Fecha Cierre",
          "Trabajador",
        ],
      ],
      body: tableData,
      startY: 20,
      theme: "grid",
    });

    // Detalles de movimientos
    reportData.forEach((caja) => {
      doc.autoTable({
        head: [
          [
            "Tipo Movimiento",
            "Monto",
            "Fecha Movimiento",
            "Motivo",
            "Trabajador",
          ],
        ],
        body: caja.movimientos.map((movimiento) => [
          movimiento.tipo_movimiento,
          movimiento.monto,
          new Date(movimiento.fecha_movimiento).toLocaleString(),
          movimiento.motivo,
          `${movimiento?.trabajadorMovimiento?.nombre} ${movimiento?.trabajadorMovimiento?.apellido_paterno}`,
        ]),
        startY: doc.previousAutoTable.finalY + 20,
        theme: "striped",
        didDrawPage: (data) => {
          doc.text(`Movimientos de Caja`, 15, data.settings.startY - 5);
        },
      });
    });

    // Agregar imagen de fondo
    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", 80, doc.previousAutoTable.finalY + 80, 40, 40);
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
          <TableHead style={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell />
              <TableCell style={{ fontWeight: "bold" }}>
                Monto Inicial
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Monto Final</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>
                Fecha Apertura
              </TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Fecha Cierre</TableCell>
              <TableCell style={{ fontWeight: "bold" }}>Trabajador</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reportData.map((caja) => (
              <CajaRow key={caja.id_caja} caja={caja} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={generatePDF}
          style={{ marginBottom: "10px" }}
        >
          Guardar Reporte
        </Button>
      </Box>
    </>
  );
}

function CajaRow({ caja }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

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
        <TableCell>{caja.monto_inicial}</TableCell>
        <TableCell>{caja.monto_final}</TableCell>
        <TableCell>{new Date(caja.fecha_apertura).toLocaleString()}</TableCell>
        <TableCell>
          {caja.fecha_cierre
            ? new Date(caja.fecha_cierre).toLocaleString()
            : "No cerrado"}
        </TableCell>
        <TableCell>{`${caja.trabajadorCierre?.nombre || ""} ${
          caja.trabajadorCierre?.apellido_paterno || ""
        }`}</TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className={classes.collapseContainer}>
              <Typography variant="h6" gutterBottom>
                Movimientos de Caja
              </Typography>
              <Table size="small" aria-label="movimientos">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo Movimiento</TableCell>
                    <TableCell>Monto</TableCell>
                    <TableCell>Fecha Movimiento</TableCell>
                    <TableCell>Motivo</TableCell>
                    <TableCell>Trabajador</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {caja.movimientos.map((movimiento, index) => (
                    <TableRow key={index}>
                      <TableCell>{movimiento.tipo_movimiento}</TableCell>
                      <TableCell>{movimiento.monto}</TableCell>
                      <TableCell>
                        {new Date(movimiento.fecha_movimiento).toLocaleString()}
                      </TableCell>
                      <TableCell>{movimiento.motivo}</TableCell>
                      <TableCell>{`${movimiento?.trabajadorMovimiento?.nombre} ${movimiento?.trabajadorMovimiento?.apellido_paterno}`}</TableCell>
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

export default TableCajaReport;
