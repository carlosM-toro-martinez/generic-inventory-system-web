import React from "react";
import DashboardComponent from "../../components/DashboardComponent";
import TableProductsComponent from "../../components/TableProductsComponent";
import DrawerComponent from "../../components/DrawerComponent";
import { Typography } from "@mui/material";
import DashboardInicioComponent from "../../components/DashboardInicioComponent";

function Inicio() {
  return (
    <DrawerComponent>
      <DashboardInicioComponent />
    </DrawerComponent>
  );
}

export default Inicio;
