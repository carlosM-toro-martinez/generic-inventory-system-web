import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  carouselContainer: {
    overflowX: "auto",
    padding: theme.spacing(2),
  },
  carousel: {
    display: "flex",
    gap: theme.spacing(2),
    scrollSnapType: "x mandatory",
    scrollBehavior: "smooth",
  },
  paperItem: {
    minWidth: 150,
    height: 160,
    borderRadius: 16,
    padding: theme.spacing(2),
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    scrollSnapAlign: "start",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  icon: {
    fontSize: "4rem",
    marginBottom: theme.spacing(1),
  },
  title: {
    textAlign: "center",
    fontWeight: 500,
  },
}));
