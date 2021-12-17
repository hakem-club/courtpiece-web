import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import { Box, Container, Grid } from "@mui/material";
import { PlayerIndex } from "../common/types";
import Player from "./components/Player";

ReactDOM.render(
  <React.StrictMode>
    <Container fixed sx={{ px: 0 }}>
      <Grid container spacing={2} sx={{ p: 1, color: '#aaa', alignItems: 'center' }} className="app-header">
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 1, py: 2 }}>
            <a href='/' className="logo-link"><img src="/logo.svg" alt="Hakem.club" style={{ height: '1.5rem' }} /></a>
          </Box>
        </Grid>
        <Grid item xs={12} md={6} textAlign='right'>
          <a target="_blank" href='https://hakem-club.github.io/'>Developer Hub</a>
        </Grid>
      </Grid>
      <Box sx={{ boxShadow: '0 3px 10px rgb(0 0 0 / 5%)', backgroundColor: 'white' }}>
        <App />
      </Box>
      <Grid container spacing={2} sx={{ p: 1, color: '#aaa' }} className="app-footer">
        <Grid item xs={12} md={6}>
          open source client: <a href='https://github.com/hakem-club/courtpiece-web'>@hakem-club/courtpiece-web</a>
        </Grid>
        <Grid item xs={12} md={6} textAlign='right'>
        <a href='/test-bot'>Test Your Bot!</a>
        </Grid>
      </Grid>
    </Container>
  </React.StrictMode>,
  document.getElementById("root")
);
