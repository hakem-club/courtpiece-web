import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { Box, Container } from "@mui/material";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

ReactDOM.render(
  <React.StrictMode>
    <Container>
      <Box className="app-container">
        <Box>
          <Header />
        </Box>
        <Box>
          <App />
        </Box>
        <Box>
          <Footer />
        </Box>
      </Box>
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
