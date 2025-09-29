import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "2rem",
    marginTop: "20px",
  },
  card: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  image: {
    width: "100px",
    height: "100px",
    objectFit: "contain",
  },
  title: {
    marginTop: "10px",
    fontSize: "40px",
    fontWeight: "bold",
    textAlign: "center",
  },
}));

export default useStyles;
