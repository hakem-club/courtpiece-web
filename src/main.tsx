import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { Box, Container } from "@mui/material";

ReactDOM.render(
  <React.StrictMode>
    <Container fixed sx={{ px: 0 }}>
      <Box sx={{ px: 1, py: 2 }}>
        <a href='/'><img src="/logo.svg" alt="Hakem.club" style={{ height: '1.5rem' }} /></a>
      </Box>
      <Box sx={{ boxShadow: '0 3px 10px rgb(0 0 0 / 5%)', backgroundColor: 'white' }}>
        <App />
      </Box>
      <Box sx={{ margin: 1, color: '#aaa' }}>
        <div>open source client: <a href='https://github.com/hakem-club/courtpiece-web'>@hakem-club/courtpiece-web</a></div>
      </Box>
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
