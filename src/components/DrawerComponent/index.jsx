import { useContext } from "react";
import { Box, Divider, Drawer, List, Typography } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ReportIcon from "@mui/icons-material/Report";
import StoreIcon from "@mui/icons-material/Store";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Link, useLocation } from "react-router-dom";
import useStyles from "./drawer.styles";
import { MainContext } from "../../context/MainContext";
import NavBarComponent from "./NavBarComponent";
import FooterComponent from "./FooterComponent";
import logo from "../../assets/images/icons/logoWhite.png";
import logo2 from "../../assets/images/logos/3.png";

export default function DrawerComponent({ children }) {
  const { open, setOpen, user } = useContext(MainContext);
  const classes = useStyles({ open });
  const location = useLocation();

  const handleDrawerOpen = () => setOpen(!open);

  const routes = [
    { path: "/", name: "Inicio", icon: <HomeIcon /> },
    { path: "/ventas", name: "Ventas", icon: <ShoppingCartIcon /> },
    { path: "/movimiento-caja", name: "Caja", icon: <AttachMoneyIcon /> },
    { path: "/reportes", name: "Reportes", icon: <ReportIcon /> },
    { path: "/almacenes", name: "Almacenes", icon: <StoreIcon /> },
    { path: "/clientes", name: "Clientes", icon: <PersonIcon /> },
    { path: "/trabajadores", name: "Trabajadores", icon: <GroupIcon /> },
    {
      path: "/movimiento-inventario",
      name: "Movimientos",
      icon: <RotateLeftIcon />,
    },
  ];

  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", backgroundColor: "#f5f5f5" }}
    >
      <Drawer
        variant="permanent"
        className={open ? classes.drawerOpen : classes.drawerClose}
        classes={{
          paper: open ? classes.drawerOpen : classes.drawerClose,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: "#ffffff",
            color: "#333",
            paddingTop: ".8rem",
            boxShadow: "2px 0 10px rgba(0,0,0,0.05)",
          },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            marginBottom: "1rem",
            paddingX: 2,
          }}
        >
          <div
            style={{
              width: open ? "200px" : "60px",
              height: open ? "80px" : "60px",
              overflow: "hidden",
              borderRadius: "8px",
            }}
          >
            <img
              src={open ? logo : logo2}
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "all 0.3s ease-in-out",
              }}
            />
          </div>
        </Box>
        <Divider />
        <List>
          {routes.map(({ path, name, icon }) => {
            const isActive =
              path === "/"
                ? location.pathname === path
                : location.pathname.includes(path);

            return (
              <Box key={path} sx={{ padding: "5px", display: "block" }}>
                <Link
                  to={path}
                  style={{
                    display: "flex",
                    justifyContent: open ? "flex-start" : "center",
                    alignItems: "center",
                    textDecoration: "none",
                    backgroundColor: isActive ? "#ffe5d0" : "transparent",
                    color: isActive ? "#d35400" : "#333",
                    padding: open
                      ? "10px 10px 10px 20px"
                      : "10px 10px 10px 10px",
                    borderRadius: "8px",
                    fontWeight: isActive ? "bold" : "normal",
                    transition: "background 0.3s",
                  }}
                >
                  <span
                    style={{
                      marginRight: open ? "8px" : "0",
                      color: isActive ? "#d35400" : "#666",
                    }}
                  >
                    {icon}
                  </span>
                  <Typography
                    variant="body1"
                    style={{
                      display: open ? "block" : "none",
                      fontWeight: 500,
                    }}
                  >
                    {name}
                  </Typography>
                </Link>
              </Box>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          flexDirection: "column",
          backgroundColor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <NavBarComponent
          user={user}
          handleDrawerOpen={handleDrawerOpen}
          open={open}
        />
        {children}
        <FooterComponent />
      </Box>
    </Box>
  );
}
