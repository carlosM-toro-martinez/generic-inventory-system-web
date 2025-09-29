import React, { useState } from "react";
import TableClientsComponent from "./TableClientsComponent";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import FormClientComponent from "../FormClientComponent";

function DashboardClientesComponent({ clients, refetchClients }) {
  const [open, setOpen] = useState(false);
  const [clientUpdate, setClientUpdate] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TableClientsComponent
        clients={clients}
        refetchClients={refetchClients}
        setClientUpdate={setClientUpdate}
        setOpen={setOpen}
      />

      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
        style={{ marginTop: "1rem" }}
      >
        Agregar Cliente
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Agregar Nuevo Cliente</DialogTitle>
        <DialogContent>
          <FormClientComponent
            handleClose={handleClose}
            refetchClients={refetchClients}
            clienteData={clientUpdate}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default DashboardClientesComponent;
