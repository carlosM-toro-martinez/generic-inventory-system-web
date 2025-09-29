import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  FormControl,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useQuery, useMutation } from "react-query";
import clientesService from "../../../../async/services/get/clientesService";
import reportClientsSalesServices from "../../../../async/services/get/reportClientsSalesServices";
import jsPDF from "jspdf";
import "jspdf-autotable";
import background from "../../../../assets/images/logos/3.png";

const ClienteAutocompleteComponent = ({ clientes, onClienteSeleccionado }) => {
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const handleClienteChange = (newValue) => {
    setClienteSeleccionado(newValue);
    if (newValue) {
      onClienteSeleccionado(newValue.id_cliente);
    }
  };

  return (
    <FormControl
      fullWidth
      style={{ display: "flex", flexDirection: "row", width: "20rem" }}
    >
      <Autocomplete
        options={clientes || []}
        getOptionLabel={(cliente) =>
          cliente?.codigo
            ? `${cliente.nombre} ${cliente.apellido || ""} - ${cliente.codigo}`
            : `${cliente.nombre} ${cliente.apellido || ""}`
        }
        value={clienteSeleccionado}
        onChange={(event, newValue) => handleClienteChange(newValue)}
        isOptionEqualToValue={(option, value) =>
          option.id_cliente === value?.id_cliente
        }
        filterOptions={(options, { inputValue }) =>
          options.filter(
            (option) =>
              `${option.nombre} ${option.apellido}`
                .toLowerCase()
                .includes(inputValue.toLowerCase()) ||
              (option.codigo &&
                option.codigo.toLowerCase().includes(inputValue.toLowerCase()))
          )
        }
        renderOption={(props, option) => (
          <li {...props} key={option.id_cliente}>
            {option.codigo ? `${option.codigo}` : ""} - {option.nombre}{" "}
            {option.apellido || ""}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Cliente" required />
        )}
        style={{ width: "100%" }}
      />
    </FormControl>
  );
};

function TableClientsSalesTotal() {
  const {
    data: clientsData,
    isLoading: isLoadingClient,
    error: errorCliente,
    refetch: refetchClients,
  } = useQuery(`clients`, clientesService);

  const mutation = useMutation((id_cliente) =>
    reportClientsSalesServices(id_cliente)
  );

  const handleClienteSeleccionado = (id_cliente) => {
    mutation.mutate(id_cliente, {
      onSuccess: (data) => {
        console.log("Reporte obtenido exitosamente:", data);
      },
      onError: (error) => {
        console.error("Error al obtener el reporte:", error);
      },
    });
  };

  const [pdfBlob, setPdfBlob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Reporte Total Gastado por Cliente", 65, 10);

    const tableData = [
      [
        mutation?.data?.totalGastado?.cliente?.nombre,
        mutation?.data?.totalGastado?.cliente?.apellido,
        mutation?.data?.totalGastado?.cliente?.codigo,
        mutation?.data?.totalGastado?.totalGastado,
      ],
    ];

    doc.autoTable({
      head: [["Cliente", "Apellido", "Código", "Total Gastado"]],
      body: tableData,
      startY: 20,
      theme: "grid",
    });

    const img = new Image();
    img.src = background;
    img.onload = () => {
      doc.addImage(img, "PNG", 80, doc.previousAutoTable.finalY + 20, 40, 40);
      const pdfOutput = doc.output("blob");
      setPdfBlob(pdfOutput);
      setOpenDialog(true);
    };
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
      }}
    >
      <ClienteAutocompleteComponent
        clientes={clientsData}
        onClienteSeleccionado={handleClienteSeleccionado}
      />
      {mutation.isLoading && <p>Cargando reporte...</p>}
      {mutation.isError && <p>Error al cargar el reporte.</p>}
      {mutation.isSuccess && (
        <Box sx={{ marginTop: 4, width: "80%" }}>
          <Table>
            <TableHead style={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Cliente
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Apellido
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Código
                </TableCell>
                <TableCell align="center" style={{ fontWeight: "bold" }}>
                  Total Gastado
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell align="center">
                  {mutation?.data?.totalGastado?.cliente?.nombre}
                </TableCell>
                <TableCell align="center">
                  {mutation?.data?.totalGastado?.cliente?.apellido}
                </TableCell>
                <TableCell align="center">
                  {mutation?.data?.totalGastado?.cliente?.codigo}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ color: "green", fontWeight: "bold" }}
                >
                  {mutation?.data?.totalGastado?.totalGastado}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {pdfBlob && (
            <iframe
              src={URL.createObjectURL(pdfBlob)}
              width="100%"
              height="500px"
              title="Vista previa del PDF"
            ></iframe>
          )}
        </DialogContent>
      </Dialog>
      <Box
        sx={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={generatePDF}
          style={{ marginBottom: "10px" }}
        >
          Guardar Reporte
        </Button>
      </Box>
    </Box>
  );
}

export default TableClientsSalesTotal;
