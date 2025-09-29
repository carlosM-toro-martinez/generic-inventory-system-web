import React from "react";
import { Autocomplete, TextField, Button, FormControl } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const ClienteAutocompleteComponent = ({
  clientes,
  ventaData,
  setCliente,
  handleOpenClientModal,
  productosSeleccionados,
}) => {
  return (
    <FormControl fullWidth style={{ display: "flex", flexDirection: "row" }}>
      <Autocomplete
        options={clientes || []}
        getOptionLabel={(cliente) =>
          cliente?.codigo
            ? `${cliente.nombre} ${cliente.apellido || ""} - ${cliente.codigo}`
            : `${cliente.nombre} ${cliente.apellido || ""}`
        }
        value={
          clientes.find(
            (cliente) => cliente.id_cliente === ventaData.clienteId
          ) || null
        }
        onChange={(event, newValue) => {
          if (newValue) {
            setCliente(newValue.id_cliente);
          }
        }}
        isOptionEqualToValue={(option, value) =>
          option.id_cliente === value.id_cliente
        }
        disabled={productosSeleccionados?.length > 0}
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
            {option.codigo ? `${option.codigo}` : ""}
            {` - ${option.nombre}`} {option.apellido || ""}{" "}
          </li>
        )}
        renderInput={(params) => (
          <TextField {...params} label="Cliente" required />
        )}
        style={{ width: "100%" }}
      />
      <Button
        onClick={handleOpenClientModal}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <AddCircleOutlineIcon color="error" />
      </Button>
    </FormControl>
  );
};

export default ClienteAutocompleteComponent;
