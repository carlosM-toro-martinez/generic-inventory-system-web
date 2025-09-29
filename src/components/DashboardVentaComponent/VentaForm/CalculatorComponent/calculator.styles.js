import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  container: {
    padding: "2.5rem",
    borderRadius: "12px",
    maxWidth: "400px",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#34495e",
    fontWeight: "bold",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  label: {
    fontWeight: 500,
    color: "#2c3e50",
  },
  value: {
    fontSize: "16px",
    fontWeight: 600,
  },
  input: {
    width: "140px",
  },
});

export default useStyles;
