import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    marginTop: theme.spacing(5),
    maxWidth: "80%",
    margin: "0 auto",
  },
  collapseContainer: {
    padding: theme.spacing(2),
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
}));

export default useStyles;
