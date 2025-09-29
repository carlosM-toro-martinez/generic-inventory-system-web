import React, { useContext } from "react";
import { Paper, Typography, Button, Avatar, Divider, Box } from "@mui/material";
import useStyles from "./profile.styles";
import { MainContext } from "../../context/MainContext";
import background from "../../assets/images/moneda.jpg";

const ProfileComponent = () => {
  const { user } = useContext(MainContext);
  const classes = useStyles();

  return (
    <Paper elevation={3} className={classes.root}>
      <Box className={classes.coverPhotoContainer}>
        <img src={background} alt="Cover" className={classes.coverPhoto} />
      </Box>

      <Box className={classes.profileInfo}>
        <Typography variant="h4" className={classes.name}>
          {user.nombre} {user.apellido_paterno} {user.apellido_materno}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {user.cargo}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Fecha de Contratación:{" "}
          {new Date(user.fecha_contratacion).toLocaleDateString()}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Username: {user.username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Rol: {user.rol.nombre}
        </Typography>
        <Divider className={classes.divider} />

        <Typography variant="h6" className={classes.sectionTitle}>
          Permisos
        </Typography>
        <ul className={classes.permissionsList}>
          {user.rol.permisos.map((permiso) => (
            <li key={permiso.id_permiso} className={classes.permissionItem}>
              {permiso.nombre}
            </li>
          ))}
        </ul>
        <Button variant="contained" color="primary" className={classes.button}>
          Editar Perfil
        </Button>
      </Box>
    </Paper>
  );
};

export default ProfileComponent;
