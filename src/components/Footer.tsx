import { Grid } from "@mui/material";

export const Footer: React.FC = () => {
    return <Grid container sx={{ py: 2, color: '#aaa' }} className="app-footer">
        <Grid item xs={12} md={6}>
            open source client: <a href='https://github.com/hakem-club/courtpiece-web'>@hakem-club/courtpiece-web</a>
        </Grid>
        <Grid item xs={12} md={6} textAlign='right'>
            <a href='/test-bot'>Test Your Bot!</a>
        </Grid>
    </Grid>
};
