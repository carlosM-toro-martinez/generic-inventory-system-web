import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import BreadcrumbsComponent from "./BreadcrumbsComponent";
import { MainContext } from "../../../context/MainContext";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

function NavBarComponent({ handleDrawerOpen, open, user }) {
  const { setToken, setUser, setSuperAdmin } = useContext(MainContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleCloseSession = () => {
    localStorage.setItem("token", null);
    setToken();
    localStorage.setItem("user", null);
    setUser();
    localStorage.setItem("superAdmin", null);
    setSuperAdmin();
    navigate("/login");

    setAnchorEl(null);
  };

  const handleNavigateProfile = () => {
    navigate("/perfil");
  };

  const now = new Date();
  const fechaActual = format(now, "EEEE, d 'de' MMMM 'de' yyyy", {
    locale: es,
  });
  const horaActual = format(now, "HH:mm");

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 1rem",
        alignItems: "start",
      }}
    >
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerOpen}
        edge="start"
        sx={{ marginTop: ".7rem" }}
      >
        {open ? <MenuOpenIcon /> : <MenuIcon />}
      </IconButton>
      <Paper elevation={3} sx={{ p: 3, mb: 3, width: "92%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {user && (
            <Box
              sx={{
                display: "flex",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "block" }}>
                <Typography
                  variant="h5"
                  sx={{
                    textTransform: "capitalize",
                    fontWeight: "bold",
                    mb: 1,
                  }}
                >
                  {user.nombre} {user.apellido_paterno} {user.apellido_materno}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 2 }}
                >
                  {fechaActual} — {horaActual}
                </Typography>
              </Box>
              <IconButton
                color="inherit"
                aria-label="account options"
                onClick={handleMenuOpen}
                edge="start"
              >
                <AccountCircleIcon sx={{ fontSize: "2rem" }} />
              </IconButton>
            </Box>
          )}
          <BreadcrumbsComponent />
        </Box>
      </Paper>

      <Menu
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleNavigateProfile}>Perfil</MenuItem>
        <MenuItem onClick={handleCloseSession}>Cerrar sesión</MenuItem>
      </Menu>
    </Box>
  );
}

export default NavBarComponent;
