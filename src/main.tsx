import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { Box, Container } from "@mui/material";

ReactDOM.render(
  <React.StrictMode>
    <Container fixed sx={{ px: 0 }}>
      <Box sx={{ p: 1 }}>
        <a href='/'><img src="/logo.svg" alt="Hakem.club" style={{ height: '1.5rem' }} /></a>
      </Box>
      <Box sx={{ boxShadow: '0 3px 10px rgb(0 0 0 / 5%)', backgroundColor: 'white' }}>
        <App />
      </Box>
      <Box sx={{ margin: 1, color: '#aaa' }}>
        <div>by Mo Valipour — <a href='https://twitter.com/mvalipour'>@mvalipour</a></div>
        <div>special thanks to: Farzad Yousefzadeh — <a href='https://twitter.com/farzad_yz'>@farzad_yz</a></div>
      </Box>
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
