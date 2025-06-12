import { createTheme } from "@mui/material/styles";

const pastelPurple = "#9D7BC1";

const theme = createTheme({
  palette: {
    primary: {
      main: pastelPurple,
      contrastText: "#fff",
    },
    secondary: {
      main: "#C8A2C8", // softer lilac for accents
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
  },
  components: {
    // Override some default styles globally here if you want
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;