import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import darkTheme from "./theme";
import SearchPage from "./pages/SearchPage";

const App = () => (
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <SearchPage />
  </ThemeProvider>
);

export default App;
