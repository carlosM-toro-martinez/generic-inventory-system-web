// Ventas.js
import React, { useContext, useState } from "react";
import DrawerComponent from "../../components/DrawerComponent";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { MainContext } from "../../context/MainContext";

function MovimientoInventario() {
  const { data } = useContext(MainContext);
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/movimiento-inventario/crear");
  };

  return (
    <>
      <DrawerComponent>
        <Box style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Box style={{ display: "flex", justifyContent: "center" }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleButtonClick}
            >
              Realizar Movimiento
            </Button>
          </Box>
        </Box>
      </DrawerComponent>
    </>
  );
}

export default MovimientoInventario;
