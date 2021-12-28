import { Grid } from "@mui/material";

export const Footer: React.FC = () => {
    return <Grid container sx={{ py: 2, color: '#aaa' }} className="app-footer">
        <Grid item xs={12} md={6}>
            Source code on GitHub: <a href='https://github.com/hakem-club'>@hakem-club</a>
        </Grid>
    </Grid>
};
