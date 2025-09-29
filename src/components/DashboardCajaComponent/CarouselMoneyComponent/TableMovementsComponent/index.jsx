import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Divider,
  Box,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    borderRadius: 16,
    boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
    marginBottom: 24,
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
  headerText: {
    fontWeight: 600,
    color: "#333",
  },
  positiveAmount: {
    color: "#2e7d32", // Verde
  },
  negativeAmount: {
    color: "#c62828", // Rojo
  },
  collapseToggle: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  divider: {
    margin: "16px 0",
  },
}));

export default function TableMovementsComponent({ caja }) {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const formatFecha = (fecha) =>
    new Date(fecha).toLocaleString("es-BO", {
      dateStyle: "short",
      timeStyle: "short",
    });

  const trabajador = caja?.movimientos[0]?.trabajadorMovimiento;

  return (
    <Card className={classes.card}>
      <CardContent
        sx={{
          borderColor: "red",
          border: "solid",
          borderWidth: ".2px",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Información de la Caja
        </Typography>

        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
          gap={2}
        >
          <Typography>
            <strong>Monto Inicial:</strong> Bs {caja.monto_inicial}
          </Typography>
          <Typography>
            <strong>Monto Final:</strong>{" "}
            {caja.monto_final ? `Bs ${caja.monto_final}` : "No cerrado"}
          </Typography>
          <Typography>
            <strong>Fecha de Apertura:</strong>{" "}
            {formatFecha(caja.fecha_apertura)}
          </Typography>
          <Typography>
            <strong>Abierta por:</strong>{" "}
            {`${trabajador?.nombre} ${trabajador?.apellido_paterno}`}
          </Typography>
        </Box>

        <div className={classes.collapseToggle}>
          <IconButton onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </div>

        <Collapse in={expanded}>
          <Divider className={classes.divider} />
          <Typography variant="subtitle1" gutterBottom>
            Movimientos
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead className={classes.tableHeader}>
                <TableRow>
                  <TableCell className={classes.headerText}>Fecha</TableCell>
                  <TableCell className={classes.headerText}>Tipo</TableCell>
                  <TableCell className={classes.headerText}>Monto</TableCell>
                  <TableCell className={classes.headerText}>Motivo</TableCell>
                  <TableCell className={classes.headerText}>
                    Responsable
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {caja.movimientos.map((mov) => (
                  <TableRow key={mov.id_movimiento}>
                    <TableCell>{formatFecha(mov.fecha_movimiento)}</TableCell>
                    <TableCell>{mov.tipo_movimiento}</TableCell>
                    <TableCell
                      className={
                        parseFloat(mov.monto) < 0
                          ? classes.negativeAmount
                          : classes.positiveAmount
                      }
                    >
                      Bs {parseFloat(mov.monto).toFixed(2)}
                    </TableCell>
                    <TableCell>{mov.motivo}</TableCell>
                    <TableCell>
                      {mov.trabajadorMovimiento?.nombre}{" "}
                      {mov.trabajadorMovimiento?.apellido_paterno}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </CardContent>
    </Card>
  );
}
