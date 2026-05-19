import { createTheme } from "@mui/material/styles";

const charcoalGrey = "#29333A"; // Main App Background
const midGrey = "#3A4750"; // Nested Components / Secondary Background
const mutedBlue = "#4C6170"; // Borders, Dividers, or Muted Text
const lighterGrey = "#678498"; // Major Structural Elements (Sidebars, Cards)
const offWhite = "#F4F0E1"; // Primary Text / High-contrast Icons
const softText = "#A9B4BC"; // Secondary/Hint Text (so off-white stays special)
// The Accent
const matteYellow = "#E5B842"; // The Pop (Interactive states, Alerts, Focus)

const theme = createTheme({
  palette: {
    mode: "dark", // important
    primary: {
      main: charcoalGrey,
    },
    background: {
      default: charcoalGrey,
      lev1: midGrey, // slightly lighter surface
      lev2: lighterGrey, // for cards or nested surfaces
    },
    text: {
      primary: offWhite,
      secondary: softText,
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