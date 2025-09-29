import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import FormCliente from "../../FormClientComponent";

function ClientModal({ open, handleClose, refetchClients }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir Cliente</DialogTitle>
      <DialogContent>
        <FormCliente
          handleClose={handleClose}
          refetchClients={refetchClients}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ClientModal;
