import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";
import FormProveedor from "../../FormProveedorComponent";

const ProveedorModalComponent = ({ open, handleClose, refetchProveedores }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir Proveedor</DialogTitle>
      <DialogContent>
        <FormProveedor
          handleClose={handleClose}
          refetchProveedores={refetchProveedores}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProveedorModalComponent;
