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
//import FormProveedor from "../../../FormProveedorComponent";

function ModalUpdateProduct({ handleClose, refetchProducts, product }) {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Editar Producto</DialogTitle>
      <DialogContent>
        <FormProduct
          handleClose={handleClose}
          refetchProducts={refetchProducts}
          productData={product}
        />
      </DialogContent>
    </Dialog>
  );
}

export default ModalUpdateProduct;
