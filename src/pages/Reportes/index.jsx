import React from "react";
import DrawerComponent from "../../components/DrawerComponent";
import { Typography } from "@mui/material";
import DashboardReporteComponent from "../../components/DashboardReporteComponent";

function Reportes() {
  return (
    <>
      <DrawerComponent>
        <Typography
          component={"h2"}
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "bold  ",
            marginTop: "2rem",
          }}
        >
          Reportes
        </Typography>
        <DashboardReporteComponent />
      </DrawerComponent>
    </>
  );
}

export default Reportes;
