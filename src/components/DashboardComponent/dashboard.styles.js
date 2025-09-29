import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles((theme) => ({
  profileJob: {
    fontSize: "0.875rem",
    color: "#71717A",
  },
  nav: {
    padding: "8px 0",
    "& a": {
      color: "#52525B",
      textDecoration: "none",
    },
    "& a.active": {
      color: "#3B82F6",
    },
  },
  main: {
    flex: 1,
    padding: "16px",
    backgroundColor: "#F5F5F5",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  headerTitle: {
    fontSize: "2rem",
    fontWeight: 700,
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
  },
  select: {
    marginLeft: "8px",
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    padding: "4px",
  },
  button: {
    backgroundColor: "#3B82F6",
    color: "white",
    padding: "8px 16px",
    borderRadius: "4px",
    marginLeft: "8px",
  },
  resetButton: {
    backgroundColor: "#D1D5DB",
    color: "#52525B",
    padding: "8px 16px",
    borderRadius: "4px",
    marginLeft: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "16px",
  },
  card: {
    backgroundColor: "white",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "16px",
    borderRadius: "8px",
  },
  cardTitle: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  cardStat: {
    fontSize: "2rem",
    fontWeight: 700,
  },
  cardBar: {
    height: "4px",
    backgroundColor: "#EF4444",
  },
  input: {
    border: "1px solid #E5E7EB",
    borderRadius: "4px",
    width: "100%",
    marginTop: "8px",
    padding: "4px",
  },
  cardText: {
    color: "#71717A",
    marginTop: "8px",
  },
}));
// barras 1600 zcateco
// cpu 2900
// solido 256
// hdd 500
