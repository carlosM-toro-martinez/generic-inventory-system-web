import { createTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
///import NotoSerifDisplay_ExtraCondensed from '../assets/font/NotoSerifDisplay_ExtraCondensed-BlackItalic.ttf';

// const NotoSerifDisplayExtraCondensed = {
//     fontFamily: 'NotoSerifDisplay_ExtraCondensed-BlackItalic',
//     src: `url(${NotoSerifDisplay_ExtraCondensed})`
// }
const theme = createTheme({
  // typography: {
  //     fontFamily: [
  //         `"${NotoSerifDisplayExtraCondensed.fontFamily}"`,
  //     ].join(','),
  // },
  palette: {
    primary: {
      // green dark
      main: "#f5f5f5",
    },
    secondary: {
      // green ligth
      main: "#178435",
    },
    third: {
      // gray
      main: "#D4D4D4",
    },
    fourth: {
      main: "#CFFF8D",
    },
    neutro1: {
      //white
      main: "#ffffff",
    },
    neutro2: {
      //black
      main: "#000000",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        // '@font-face': [
        //     NotoSerifDisplayExtraCondensed
        // ],
      },
      body: {
        fontFamily: ["Roboto-bold"],
      },
      "h1, h2, h3, h4, h5, h6": {
        margin: 0,
        padding: 0,
      },
    },
  },
});
const Theme = ({ children }) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
export default Theme;
