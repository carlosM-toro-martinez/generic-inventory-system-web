import React, { useState } from "react";
import { useStyles } from "./dashboard.styles";
import DrawerComponent from "../DrawerComponent";
import { Box } from "@mui/material";

function DashboardComponent({ children }) {
  const classes = useStyles();
  const [count, setCount] = useState(0);
  return (
    <Box style={{ display: "flex" }}>
      <DrawerComponent>{children}</DrawerComponent>
    </Box>
  );
}

export default DashboardComponent;
