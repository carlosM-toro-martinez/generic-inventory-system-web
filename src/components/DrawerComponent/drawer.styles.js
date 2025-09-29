import { makeStyles } from "@material-ui/core";

const drawerWidth = 240;

const useStyles = makeStyles(() => ({
  drawerOpen: {
    width: 240,
    transition: "width 225ms ease-in-out",
    overflowX: "hidden",
  },
  drawerClose: {
    transition: "width 225ms ease-in-out",
    overflowX: "hidden",
    width: 64,
    "@media (min-width: 600px)": {
      width: 90,
    },
  },
  drawerHeader: {
    padding: "0 8px",
    minHeight: 50,
  },
}));

export default useStyles;
