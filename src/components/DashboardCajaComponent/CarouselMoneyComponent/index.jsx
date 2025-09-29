import React, { useContext, useState } from "react";
import { useMutation } from "react-query";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { MainContext } from "../../../context/MainContext";
import cajaOpenAddService from "../../../async/services/post/cajaOpenAddService";
import moveCashAddService from "../../../async/services/post/moveCashAddService";
import cajaCloseAddService from "../../../async/services/post/cajaCloseAddService";
import { getLocalDateTime } from "../../../utils/getDate";
import TableMovementsComponent from "./TableMovementsComponent";

function CarouselMoneyComponent({
  caja,
  refetch,
  editingEnabled,
  setEditingEnabled,
  cajaState,
}) {
  const {
    user,
    refetch: refetchContext,
    setOpenCaja,
  } = useContext(MainContext);

  const [descripcion, setDescripcion] = useState("");
  const [montoAgregar, setMontoAgregar] = useState("");
  const [montoQuitar, setMontoQuitar] = useState("");
  const [montoInicial, setMontoInicial] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDescripcionChange = (event) => {
    setDescripcion(event.target.value);
  };

  const handleAgregarChange = (event) => {
    const value = event.target.value;
    setMontoAgregar(value);
    if (value !== "") setMontoQuitar(""); // Bloquear el otro
  };

  const handleQuitarChange = (event) => {
    const value = event.target.value;
    setMontoQuitar(value);
    if (value !== "") setMontoAgregar(""); // Bloquear el otro
  };

  const mutationOpenCaja = useMutation(
    () =>
      cajaOpenAddService({
        monto_inicial: montoInicial,
        id_trabajador: user?.id_trabajador,
      }),
    {
      onSuccess: () => {
        showSnackbar("Caja abierta exitosamente!", "success");
        setOpenCaja(true);
        refetch();
        refetchContext();
      },
      onError: (error) => {
        showSnackbar(`Error al abrir la caja: ${error.message}`, "error");
      },
    }
  );

  const mutationMoveCash = useMutation(
    () => {
      const monto =
        montoAgregar !== ""
          ? parseFloat(montoAgregar)
          : -parseFloat(montoQuitar);
      return moveCashAddService({
        id_caja: caja?.caja?.id_caja,
        tipo_movimiento: monto < 0 ? "retiro" : "ingreso",
        monto,
        motivo: descripcion,
        fecha_movimiento: getLocalDateTime(),
        id_trabajador: user?.id_trabajador,
      });
    },
    {
      onSuccess: () => {
        showSnackbar("Movimiento registrado exitosamente!", "success");
        setEditingEnabled(false);
        setMontoAgregar("");
        setMontoQuitar("");
        setDescripcion("");
        refetch();
        refetchContext();
      },
      onError: (error) => {
        showSnackbar(
          `Error al registrar el movimiento: ${error.message}`,
          "error"
        );
      },
    }
  );

  const mutationCloseCash = useMutation(
    () =>
      cajaCloseAddService({
        id_caja: caja?.caja?.id_caja,
        id_trabajador: user?.id_trabajador,
      }),
    {
      onSuccess: () => {
        showSnackbar("Caja cerrada exitosamente!", "success");
        setEditingEnabled(false);
        setOpenCaja(false);
        refetch();
        refetchContext();
      },
      onError: (error) => {
        showSnackbar(`Error al cerrar la caja: ${error.message}`, "error");
      },
    }
  );

  const handleSubmitMovimiento = () => {
    mutationMoveCash.mutate();
  };

  const handleSubmitApertura = () => {
    mutationOpenCaja.mutate();
  };

  const montoFinal = parseFloat(caja?.caja?.monto_final || 0);
  const cambio =
    montoAgregar !== ""
      ? parseFloat(montoAgregar)
      : montoQuitar !== ""
      ? -parseFloat(montoQuitar)
      : 0;

  return (
    <Box
      sx={{
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
        Caja actual
      </Typography>
      <Typography variant="h2" color="primary">
        Bs. {montoFinal.toFixed(2)}
      </Typography>

      {/* Botones de acción */}
      {!cajaState.isCajaVacia && !cajaState.isCajaCerrada && (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditingEnabled(!editingEnabled)}
          >
            {editingEnabled ? "Cancelar" : "Registrar movimiento"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={mutationCloseCash.mutate}
          >
            Cerrar caja
          </Button>
        </Box>
      )}

      {/* Formulario de movimiento */}
      {editingEnabled && !cajaState.isCajaVacia && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <TextField
            label="Motivo del movimiento"
            placeholder="Ej: Retiro para cambio"
            fullWidth
            multiline
            required
            value={descripcion}
            onChange={handleDescripcionChange}
          />
          <TextField
            label="Añadir a caja (Bs)"
            type="number"
            fullWidth
            value={montoAgregar}
            onChange={handleAgregarChange}
            disabled={montoQuitar !== ""}
          />
          <TextField
            label="Quitar de caja (Bs)"
            type="number"
            fullWidth
            value={montoQuitar}
            onChange={handleQuitarChange}
            disabled={montoAgregar !== ""}
          />

          <Typography color="text.secondary">
            Monto final estimado: Bs. {(montoFinal + cambio).toFixed(2)}
          </Typography>

          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSubmitMovimiento}
            fullWidth
            disabled={
              (!montoAgregar && !montoQuitar) ||
              parseFloat(montoAgregar || montoQuitar) <= 0 ||
              descripcion.trim() === ""
            }
          >
            Registrar movimiento
          </Button>
        </Box>
      )}

      {/* Formulario de apertura */}
      {cajaState.isCajaVacia && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            width: "100%",
            maxWidth: 400,
          }}
        >
          <TextField
            label="Monto inicial de apertura"
            type="number"
            fullWidth
            value={montoInicial}
            onChange={(e) => setMontoInicial(parseFloat(e.target.value) || "")}
            required
            helperText={montoInicial <= 0 ? "El monto debe ser mayor a 0" : ""}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSubmitApertura}
            fullWidth
            disabled={montoInicial <= 0}
          >
            Abrir caja
          </Button>
        </Box>
      )}
      {caja?.caja && <TableMovementsComponent caja={caja?.caja} />}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CarouselMoneyComponent;
