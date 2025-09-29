import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
} from "@material-ui/core";
import FormProduct from "../../FormProductComponent";

const ProductoModalComponent = ({ open, handleClose, refetchProducts }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Añadir Producto</DialogTitle>
      <DialogContent>
        <FormProduct
          handleClose={handleClose}
          refetchProducts={refetchProducts}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ProductoModalComponent;
