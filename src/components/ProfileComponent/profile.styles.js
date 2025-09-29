import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    borderRadius: "10px",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  coverPhotoContainer: {
    position: "relative",
    width: "100%",
    height: "400px",
    overflow: "hidden",
    backgroundColor: "#000",
    display: "flex",
    justifyContent: "center",
  },
  coverPhoto: {
    width: "55rem",
    height: "40rem",
    objectFit: "cover",
  },
  avatar: {
    position: "absolute",
    bottom: "-40px",
    left: "20px",
    width: theme.spacing(10),
    height: theme.spacing(10),
    border: `4px solid ${theme.palette.background.paper}`,
  },
  profileInfo: {
    marginTop: ".5rem",
    padding: theme.spacing(2),
    textAlign: "left",
  },
  name: {
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: theme.spacing(2),
    fontWeight: "bold",
  },
  permissionsList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  permissionItem: {
    padding: ".4rem",
    borderBottom: "1px solid #ddd",
  },
  button: {
    marginTop: "2rem",
    //    width: "100%",
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
}));

export default useStyles;
