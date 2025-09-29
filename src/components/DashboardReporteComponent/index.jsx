import React from "react";
import almacen from "../../assets/images/icons/almacen.png";
import caja from "../../assets/images/icons/caja.png";
import ventas from "../../assets/images/icons/ventas.png";
import proveedor from "../../assets/images/icons/proveedor.png";
import clientes from "../../assets/images/icons/clientes.png";
import producto from "../../assets/images/icons/producto.png";
import sales from "../../assets/images/icons/sales.png";
import useStyles from "./dasboardReporte.styles";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function DasboardReporteComponent() {
  const classes = useStyles();

  const data = [
    {
      image: almacen,
      title: "Compras",
      path: "almacen",
    },
    {
      image: caja,
      title: "Caja",
      path: "caja",
    },
    {
      image: ventas,
      title: "Ventas",
      path: "venta",
    },
    {
      image: clientes,
      title: "Clientes",
      path: "cliente",
    },
    {
      image: proveedor,
      title: "Proveedores",
      path: "proveedor",
    },
    {
      image: producto,
      title: "Productos",
      path: "producto",
    },
    // {
    //   image: sales,
    //   title: "Utilidades",
    //   path: "utilidades",
    // },
  ];
  const navigate = useNavigate();
  const handleNavigate = (route) => {
    navigate(`/reportes/${route}`);
  };
  return (
    <Box className={classes.container}>
      {data.map((item, index) => (
        <Box
          key={index}
          className={classes.card}
          onClick={() => handleNavigate(item.path)}
        >
          <img src={item.image} alt={item.title} className={classes.image} />
          <Typography
            variant="h6"
            style={{
              marginTop: "10px",
              fontSize: "40px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {item.title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export default DasboardReporteComponent;
