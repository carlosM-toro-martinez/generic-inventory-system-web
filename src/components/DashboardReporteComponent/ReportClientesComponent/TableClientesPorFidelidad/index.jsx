import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function TableClientesPorFidelidad({ data }) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead style={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell style={{ fontWeight: "bold" }}>ID Cliente</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Nombre</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Apellido</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>Código</TableCell>
            <TableCell style={{ fontWeight: "bold" }}>
              Puntos Fidelidad
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((cliente) => (
            <TableRow key={cliente.id_cliente}>
              <TableCell>{cliente.id_cliente}</TableCell>
              <TableCell>{cliente.nombre}</TableCell>
              <TableCell>{cliente.apellido || "N/A"}</TableCell>
              <TableCell>{cliente.codigo || "N/A"}</TableCell>
              <TableCell style={{ color: "green" }}>
                {cliente.puntos_fidelidad}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableClientesPorFidelidad;
