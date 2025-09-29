import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  tableContainer: {
    width: "45rem",
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  tableCell: {
    fontWeight: "bold",
  },
  cell: {
    fontWeight: "bold",
    color: "#000",
    fontSize: "1.2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    textTransform: "capitalize",
  },
}));

export default useStyles;
