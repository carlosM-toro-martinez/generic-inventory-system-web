import React from "react";
import PropTypes from "prop-types";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";
import useStyles from "../table.styles";

const headCells = [
  { id: "nombre", numeric: false, disablePadding: false, label: "Nombre" },
  {
    id: "Codigo",
    numeric: true,
    disablePadding: false,
    label: "Codigo",
  },
  {
    id: "Precio",
    numeric: false,
    disablePadding: false,
    label: "Precio",
  },
  // {
  //   id: "Cantidad",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Cantidad (Caja/Paquete)",
  // },
  {
    id: "Cantidad (u)",
    numeric: true,
    disablePadding: false,
    label: "Cantidad (u)",
  },
  // {
  //   id: "Cantidad (c/p)",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Cantidad (c/p)",
  // },
  // {
  //   id: "Unidades sueltas",
  //   numeric: true,
  //   disablePadding: false,
  //   label: "Unidades sueltas",
  // },
  // {
  //   id: "forma_farmaceutica",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "Forma",
  // },
  // {
  //   id: "concentracion",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "concentracion",
  // },
  // {
  //   id: "restringido",
  //   numeric: false,
  //   disablePadding: false,
  //   label: "restringido",
  // },
  { id: "actions", numeric: true, disablePadding: false, label: "Acciones" },
];

const EnhancedTableHead = () => {
  const classes = useStyles();

  return (
    <TableHead
      className={classes.tableHead}
      sx={{ backgroundColor: "#f5f5f5" }}
    >
      {headCells.map((headCell) => (
        <TableCell
          key={headCell.id}
          sx={{ fontWeight: "bold", textTransform: "capitalize" }}
        >
          {headCell.label}
        </TableCell>
      ))}
    </TableHead>
  );
};

EnhancedTableHead.propTypes = {
  order: PropTypes.string,
  orderBy: PropTypes.string,
};

export default EnhancedTableHead;
