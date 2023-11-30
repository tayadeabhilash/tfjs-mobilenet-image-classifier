import React from "react";
import { createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccuracyCalculator from "./components/accuracy";
import Dashboard from "./components/dashboard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#006D77",
    },
    secondary: {
      main: "#83C5BE",
    },
    tertiary: {
      main: "#EDF6F9",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/accuracy" element={<AccuracyCalculator />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
