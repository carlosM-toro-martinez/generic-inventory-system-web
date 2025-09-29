import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: "50rem",
    padding: "16px",
  },
  header: {
    backgroundColor: "#1976d2",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "4px 4px 0 0",
    marginBottom: "8px",
    textAlign: "center",
    fontWeight: "bold",
  },
  paper: {
    width: "100%",
    marginBottom: "16px",
    borderRadius: "0 0 4px 4px",
  },
  table: {
    minWidth: 750,
    padding: "2rem",
  },
  tableRow: {
    cursor: "pointer",
  },
  evenRow: {
    backgroundColor: "#f9f9f9",
  },
  oddRow: {
    backgroundColor: "#fff",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
    textAlign: "center",
  },
  tableHeadText: {
    color: "#fff",
  },
  actionsCell: {
    display: "flex",
    justifyContent: "flex-end",
  },
}));

export default useStyles;
