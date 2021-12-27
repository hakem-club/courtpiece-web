import { Grid, Box } from "@mui/material";

export const Header: React.FC = () => {
    return <Grid container sx={{ color: '#aaa', alignItems: 'center' }} className="app-header">
        <Grid item xs={12} md={6}>
            <Box sx={{ py: 2 }}>
                <a href='/' className="logo-link"><img src="/logo.svg" alt="Hakem.club" style={{ height: '1.5rem' }} /></a>
            </Box>
        </Grid>
        <Grid item xs={12} md={6} textAlign='right'>
            <a target="_blank" href='https://hakem-club.github.io/'>Developer Hub</a>
        </Grid>
    </Grid>
};
