import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2rem",
  },
  denomItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    marginBottom: theme.spacing(2),
  },
  image: {
    width: 130,
    height: "auto",
    marginBottom: theme.spacing(1),
  },
  amount: {
    marginBottom: theme.spacing(1),
  },
  buttons: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    maxWidth: 150,
  },
}));

export default useStyles;
