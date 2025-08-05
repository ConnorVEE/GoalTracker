import { createTheme } from "@mui/material/styles";

const pastelPurple = "#9D7BC1";

const theme = createTheme({
  palette: {
    primary: {
      main: pastelPurple,
      contrastText: "#fff",
    },
    secondary: {
      main: "#C8A2C8",
    },
    background: {
      default: "#EADCF8", // sets the page background
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#EADCF8",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
});

export default theme;