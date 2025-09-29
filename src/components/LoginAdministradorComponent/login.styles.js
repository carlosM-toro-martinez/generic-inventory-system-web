import { makeStyles } from "@material-ui/core/styles";
import moneda from "../../assets/images/moneda.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${moneda})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  },
  paper: {
    marginTop: "4rem",
    padding: theme.spacing(4),
    maxWidth: 400,
    width: "100%",
    borderRadius: 20,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing(2),
  },
  iconButton: {
    margin: theme.spacing(0.5),
    color: "#fff",
    backgroundColor: "#3b5998", // Color por defecto (Facebook)
    "&:nth-child(2)": { backgroundColor: "#333" }, // GitHub color
    "&:nth-child(3)": { backgroundColor: "#db4437" }, // Google color
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  rememberMe: {
    marginTop: theme.spacing(1),
  },
  footer: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
