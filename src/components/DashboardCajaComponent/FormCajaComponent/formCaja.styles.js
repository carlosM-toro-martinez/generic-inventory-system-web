import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  form: {
    padding: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    width: "100%",
    maxWidth: 600,
  },
}));
