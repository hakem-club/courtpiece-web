import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { Box, Container, Paper } from "@mui/material";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

ReactDOM.render(
  <React.StrictMode>
    <Box className="app-container">
      <Paper elevation={1} square>
        <Container>
          <Header />
        </Container>
      </Paper>
      <Container>
        <Box>
          <App />
        </Box>
      </Container>
      <Paper elevation={1} square>
        <Container>
          <Footer />
        </Container>
      </Paper>
    </Box>
  </React.StrictMode>,
  document.getElementById("root")
);
