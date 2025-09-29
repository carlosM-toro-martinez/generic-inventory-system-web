import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    margin: "0 auto",
    textAlign: "center",
  },
  imagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
  },
  imageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  image: {
    width: "160",
    height: "80px",
    objectFit: "contain",
  },
  counterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "10px 0",
  },
  counter: {
    fontSize: "1.5rem",
    margin: "0 10px",
  },
  button: {
    padding: "5px",
  },
  total: {
    marginBottom: "5px",
    display: "flex",
    justifyContent: "center",
    gap: 20,
  },
  toggleButton: {
    marginTop: "2rem",
  },
  saveButton: {
    marginTop: "5px",
  },
}));
