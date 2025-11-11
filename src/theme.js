import { createTheme } from "@mui/material";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#202124",
      paper: "#2c2c30",
      secondaryPaper: "#3a3a3e",
    },
    primary: { main: "#8ab4f8" },
    success: { main: "#6AA84F" },
    error: { main: "#CC0000" },
    warning: { main: "#FFCC00" },
  },
  typography: {
    h4: { color: "#e8eaed" },
    subtitle1: { color: "#bdc1c6" },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-root": { backgroundColor: "background.paper" },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "search" },
          style: {
            backgroundColor: "#8ab4f8",
            color: "#202124",
            "&:hover": { backgroundColor: "#6c9ce3" },
            borderRadius: 24,
            padding: "12px 30px",
            fontWeight: "bold",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          },
        },
      ],
    },
    MuiPaper: {
      styleOverrides: { root: { backgroundColor: "#2c2c30" } },
    },
  },
});

export default darkTheme;
