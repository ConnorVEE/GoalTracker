import { createTheme } from "@mui/material/styles";

const charcoalGrey = "#29333A";
const lighterGrey = "#678498";
const offWhite = "#F4F0E1";

const theme = createTheme({
  palette: {
    mode: "dark", // important
    primary: {
      main: charcoalGrey,
    },
    background: {
      default: charcoalGrey,
      paper: lighterGrey, // slightly lighter surface
    },
    text: {
      primary: offWhite,
      secondary: "#CFCFCF",
    },
    button: {
      main: offWhite,
      contrastText: charcoalGrey,
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
  },
});

export default theme;