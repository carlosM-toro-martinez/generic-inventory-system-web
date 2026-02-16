import React, { useContext, useEffect } from "react";
import { Grid, Typography, Paper } from "@material-ui/core";
import { Link, useNavigate } from "react-router-dom";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PeopleIcon from "@mui/icons-material/People";
import StorefrontIcon from "@mui/icons-material/Storefront";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { Box } from "@mui/material";
import MetricsMainComponent from "./MetricsMainComponent";
import { useStyles } from "./dashboardInicio.styles";
import { MainContext } from "../../context/MainContext";

function DashboardInicioComponent() {
  const classes = useStyles();
  const { user, superAdmin } = useContext(MainContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const items = [
    {
      title: "REPORTES",
      icon: <ReceiptIcon className={classes.icon} />,
      path: "/reportes",
      color: "#1565c0",
    },
    {
      title: "ALMACÉN",
      icon: <LocalShippingIcon className={classes.icon} />,
      path: "/almacenes",
      color: "#5d4037",
    },
    // {
    //   title: "CATEGORÍAS",
    //   icon: <CategoryIcon className={classes.icon} />,
    //   path: "/almacenes",
    //   color: "#f57c00",
    // },
    {
      title: "TRABAJADORES",
      icon: <PeopleIcon className={classes.icon} />,
      path: "/trabajadores",
      color: "#0288d1",
    },
    // {
    //   title: "PRODUCTOS",
    //   icon: <StorefrontIcon className={classes.icon} />,
    //   path: "/ventas",
    //   color: "#2e7d32",
    // },
    {
      title: "CLIENTES",
      icon: <PeopleIcon className={classes.icon} />,
      path: "/clientes",
      color: "#66bb6a",
    },
    {
      title: "CAJA",
      icon: <CreditCardIcon className={classes.icon} />,
      path: "/movimiento-caja",
      color: "#6a1b9a",
    },
    {
      title: "VENTAS",
      icon: <AttachMoneyIcon className={classes.icon} />,
      path: "/ventas",
      color: "#fbc02d",
    },
    // {
    //   title: "MOVIMIENTOS",
    //   icon: <MoveUpIcon className={classes.icon} />,
    //   path: "/movimiento-inventario",
    //   color: "#d84315",
    // },
  ];

  return (
    <>
      <Box className={classes.carouselContainer}>
        <Box className={classes.carousel}>
          {items.map((item, index) => (
            <Link to={item.path} style={{ textDecoration: "none" }} key={index}>
              <Paper
                className={classes.paperItem}
                style={{ backgroundColor: item.color }}
              >
                {item.icon}
                <Typography variant="h6" className={classes.title}>
                  {item.title}
                </Typography>
              </Paper>
            </Link>
          ))}
        </Box>
      </Box>
      {/* <Box sx={{ marginTop: "2rem" }}>
        <Paper>
          <MetricsMainComponent />
        </Paper>
      </Box> */}
    </>
  );
}

export default DashboardInicioComponent;
