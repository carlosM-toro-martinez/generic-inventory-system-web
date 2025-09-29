import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  TextField,
  Box,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  Snackbar,
  InputAdornment,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { useMutation } from "react-query";
import useStyles from "./login.styles";
import loginAddServices from "../../async/services/post/loginAddServices";
import { MainContext } from "../../context/MainContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/icons/logoWhite.png";
import FooterComponent from "../DrawerComponent/FooterComponent";

function LoginComponent() {
  const { token, setToken, user, setUser, setSuperAdmin } =
    useContext(MainContext);
  const navigate = useNavigate();
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
  }, [user, navigate]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState("trabajador");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const mutation = useMutation(loginAddServices, {
    onSuccess: (data) => {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      if (tipo === "trabajador") {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else if (tipo === "administrador") {
        localStorage.setItem("superAdmin", JSON.stringify(data.user));
        setSuperAdmin(data.user);
      }
      setSnackbar({
        open: true,
        message: "¡Inicio de sesión exitoso!",
        severity: "success",
      });
      navigate("/");
    },
    onError: (error) => {
      setSnackbar({
        open: true,
        message: `Error al iniciar sesión: ${error}`,
        severity: "error",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password || !tipo) {
      setSnackbar({
        open: true,
        message: "Todos los campos son requeridos",
        severity: "error",
      });
      return;
    }
    const requestBody = { username, password, tipo };
    mutation.mutate(requestBody);
  };

  return (
    <Box className={classes.root}>
      {/* <Typography
        variant="h1"
        style={{ fontSize: "5rem", color: "white", fontWeight: "bold" }}
      >
        Name App
      </Typography> */}
      <Paper className={classes.paper} elevation={10}>
        <Box className={classes.titleContainer}>
          <img
            src={logo}
            alt=""
            style={{ width: "15rem", margin: "-4rem 0 -4rem 0" }}
          />
          <Typography
            component={"h2"}
            style={{
              textAlign: "center",
              fontSize: "3rem",
              fontWeight: "bold  ",
            }}
          >
            Iniciar Sesion
          </Typography>
        </Box>
        <Box component="form" className={classes.form} onSubmit={handleSubmit}>
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* <FormControl variant="outlined" fullWidth margin="normal" required>
            <InputLabel id="tipo-label">Tipo</InputLabel>
            <Select
              labelId="tipo-label"
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              label="Tipo"
              fullWidth
            >
              <MenuItem value="administrador">Administrador</MenuItem>
              <MenuItem value="trabajador">Trabajador</MenuItem>
            </Select>
          </FormControl> */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            className={classes.submitButton}
            type="submit"
            disabled={mutation.isLoading}
            style={{ width: "10rem", marginTop: "1rem" }}
          >
            {mutation.isLoading ? "Iniciando..." : "Iniciar Sesión"}
          </Button>
        </Box>
      </Paper>

      {/* Snackbar para mostrar mensajes de éxito o error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <FooterComponent />
    </Box>
  );
}

export default LoginComponent;
