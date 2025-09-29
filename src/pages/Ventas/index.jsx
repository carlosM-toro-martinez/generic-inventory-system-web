import React, { useContext, useEffect, useState } from "react";
import DashboardComponent from "../../components/DashboardComponent";
import DrawerComponent from "../../components/DrawerComponent";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { MainContext } from "../../context/MainContext";
import FormMetodoVentaComponent from "../../components/FormMetodoVentaComponent";
import productosService from "../../async/services/get/productosService";
import metodoVentasService from "../../async/services/get/metodoVentasService.js";
import TableMetodoVentaComponent from "../../components/TableMetodoVentaComponent";
import { useQuery } from "react-query";
import ReportVentasComponent from "../../components/DashboardReporteComponent/ReportVentasComponent/index.jsx";
import TableVentasReport from "../../components/DashboardReporteComponent/ReportVentasComponent/TableVentasReport/index.jsx";
import ventasTodayService from "../../async/services/get/ventasTodayService.js";
import empty from "../../assets/images/empty.svg";
function Ventas() {
  const { data, user } = useContext(MainContext);

  const sumarTotalPorQR = (ventas) => {
    return ventas
      .filter((venta) => venta.metodo_pago === "QR")
      .reduce((acc, venta) => acc + parseFloat(venta.total), 0);
  };

  const sumarTotalContado = (ventas) => {
    return ventas
      .filter((venta) => venta.metodo_pago === "Contado")
      .reduce((acc, venta) => acc + parseFloat(venta.total), 0);
  };

  const {
    data: reportVentas,
    isLoading: isLoadingVentas,
    isError: isErrorVentas,
    refetch: refetchVentas,
  } = useQuery("ventasToday", ventasTodayService);

  const totalQR =
    reportVentas && Array.isArray(reportVentas)
      ? sumarTotalPorQR(reportVentas)
      : 0;

  const totalContado =
    reportVentas && Array.isArray(reportVentas)
      ? sumarTotalContado(reportVentas)
      : 0;

  const { data: productos, isLoading: isLoadingProductos } = useQuery(
    "products",
    productosService
  );
  const [selectedProductId, setSelectedProductId] = useState(null);
  const { data: metodoVentasData, refetch } = useQuery(
    ["metodoVentas", selectedProductId],
    () => metodoVentasService(selectedProductId),
    {
      enabled: !!selectedProductId,
    }
  );
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormDialog, setOpenFormDialog] = useState(false);

  const handleButtonClick = () => {
    if (data?.caja?.fecha_cierre) {
      setOpenDialog(true);
    } else {
      navigate("/ventas/crear");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleGoToCaja = () => {
    navigate("/movimiento-caja");
  };

  const handleOpenForm = () => {
    setOpenFormDialog(true);
  };

  const handleCloseForm = () => {
    setOpenFormDialog(false);
  };

  const handleProductSelect = (id) => {
    setSelectedProductId(id);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  return (
    <>
      <DrawerComponent>
        <Box style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}
          >
            <Typography
              component={"h2"}
              style={{
                textAlign: "center",
                fontSize: "2rem",
                fontWeight: "bold  ",
                marginTop: "2rem",
              }}
            >
              Ventas
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleButtonClick}
            >
              Crear Nueva Venta
            </Button>
            {/* Condición para mostrar un loading o el reporte de ventas */}
            {isLoadingVentas ? (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <CircularProgress />
              </Box>
            ) : isErrorVentas ? (
              <Box
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                <p>Error al cargar el reporte de ventas</p>
              </Box>
            ) : (
              <>
                <Typography
                  component={"h2"}
                  style={{
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: "bold  ",
                  }}
                >
                  Ventas de hoy
                </Typography>
                <Box sx={{ display: "flex", gap: 10 }}>
                  <Typography
                    component={"h3"}
                    style={{
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: "normal",
                      marginTop: "1rem",
                    }}
                  >
                    Ventas por QR: Bs. {totalQR.toFixed(2)}
                  </Typography>
                  <Typography
                    component={"h3"}
                    style={{
                      textAlign: "center",
                      fontSize: "1.2rem",
                      fontWeight: "normal",
                      marginTop: "1rem",
                    }}
                  >
                    Ventas al contado: Bs. {totalContado.toFixed(2)}
                  </Typography>
                </Box>

                {reportVentas &&
                Array.isArray(reportVentas) &&
                reportVentas.length > 0 ? (
                  <TableVentasReport
                    reportData={reportVentas}
                    ventaToday={true}
                    refetchVentas={refetchVentas}
                    caja={data}
                  />
                ) : (
                  <img
                    src={empty}
                    alt="No hay datos"
                    style={{
                      width: "10rem",
                      height: "auto",
                      display: "block",
                      margin: "auto",
                    }}
                  />
                )}
              </>
            )}
          </Box>
          <Box
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
              gap: 30,
            }}
          >
            <Typography
              component={"h2"}
              style={{
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: "bold  ",
              }}
            >
              Presentaciones
            </Typography>
            <TableMetodoVentaComponent
              data={metodoVentasData || []}
              products={productos || []}
              onProductSelect={handleProductSelect}
              refetch={refetch}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenForm}
              style={{ width: "15rem" }}
            >
              Crear presentacion
            </Button>
          </Box>
        </Box>
      </DrawerComponent>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Caja Cerrada</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Por favor, abre la caja para registrar las ventas.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleGoToCaja} color="primary">
            Ir a Caja
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFormDialog} onClose={handleCloseForm}>
        <DialogTitle>Crear Método de Venta</DialogTitle>
        <DialogContent>
          <FormMetodoVentaComponent
            handleClose={handleCloseForm}
            productos={productos}
            isLoadingProductos={isLoadingProductos}
            refetchMetodoVentas={refetch}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Ventas;
