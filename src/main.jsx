import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme";
import SearchPage from "./pages/SearchPage";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <SearchPage />
    </ThemeProvider>
  </StrictMode>
);
