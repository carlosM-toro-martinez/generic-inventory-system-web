import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Collapse,
  IconButton,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  productItem: {
    paddingLeft: theme.spacing(4),
    textTransform: "capitalize",
    fontWeight: "bold",
    fontSize: "3rem",
  },
  expandIcon: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandIconOpen: {
    transform: "rotate(180deg)",
  },
}));

const TableProveedorComponent = ({ data }) => {
  const classes = useStyles();

  // Estado por proveedor
  const [openStates, setOpenStates] = useState({});

  const toggleOpen = (id) => {
    setOpenStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getInventarioPorProducto = (detallesCompra) => {
    const productosMap = {};
    detallesCompra.forEach((detalle) => {
      detalle.lotes.forEach((lote) => {
        const nombreProducto = lote.producto?.nombre || "Producto sin nombre";
        const inventario = lote.inventarios?.[0];

        if (inventario) {
          if (!productosMap[nombreProducto]) {
            productosMap[nombreProducto] = {
              cantidad: 0,
              subCantidad: 0,
            };
          }
          productosMap[nombreProducto].cantidad += inventario.cantidad;
          productosMap[nombreProducto].subCantidad += inventario.subCantidad;
        }
      });
    });
    return productosMap;
  };

  return (
    <>
      {data.map((proveedor) => {
        const productosInventario = getInventarioPorProducto(
          proveedor.detallesCompra
        );
        const isOpen = openStates[proveedor.id_proveedor] || false;

        return (
          <Card key={proveedor.id_proveedor} className={classes.card}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    textTransform: "capitalize",
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                  }}
                >
                  Proveedor: {proveedor.nombre}
                </Typography>
                <IconButton
                  size="small"
                  className={
                    isOpen
                      ? `${classes.expandIcon} ${classes.expandIconOpen}`
                      : classes.expandIcon
                  }
                  aria-expanded={isOpen}
                  aria-label="mostrar productos"
                  onClick={() => toggleOpen(proveedor.id_proveedor)}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Box>
              <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List>
                  {Object.entries(productosInventario).map(
                    ([nombre, inventario], idx, arr) => (
                      <React.Fragment key={nombre}>
                        <ListItem className={classes.productItem}>
                          <ListItemText
                            primary={
                              <Typography
                                sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
                              >
                                {nombre}
                              </Typography>
                            }
                            secondary={
                              <Typography>
                                {`Cantidad de cajas: ${inventario.cantidad} | unidades: ${inventario.subCantidad}`}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {idx < arr.length - 1 && <Divider />}
                      </React.Fragment>
                    )
                  )}
                </List>
              </Collapse>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};

export default TableProveedorComponent;
