import React from "react";
import DrawerComponent from "../../components/DrawerComponent";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import TableTrabajadoresComponent from "../../components/TableTrabajadoresComponent";
import trabajadoresService from "../../async/services/get/trabajadoresService.js";
import { useQuery } from "react-query";

function Trabajadores() {
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useQuery(`workers`, () =>
    trabajadoresService()
  );

  const handleButtonClick = () => {
    navigate("/trabajadores/crear");
  };
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
          Trabajadores
        </Typography>
        <Box
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
            gap: 30,
          }}
        >
          {!isLoading && !error ? (
            <TableTrabajadoresComponent trabajadores={data} refetch={refetch} />
          ) : null}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleButtonClick}
            sx={{ width: "10rem" }}
          >
            Crear
          </Button>
        </Box>
      </DrawerComponent>
    </>
  );
}

export default Trabajadores;
