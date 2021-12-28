import { Grid, Box, Stack, Divider, Button } from "@mui/material";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

export const Header: React.FC = () => {
    return <Grid container sx={{ color: '#aaa', alignItems: 'center' }} className="app-header">
        <Grid item xs={12} md={6}>
            <Box sx={{ py: 2 }}>
                <a href='/' className="logo-link"><img src="/logo.svg" alt="Hakem.club" style={{ height: '1.5rem' }} /></a>
            </Box>
        </Grid>
        <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />} justifyContent="flex-end">
                <Button startIcon={<SmartToyIcon />} href='/test-bot'>Bots</Button>
                <Button startIcon={<DeveloperModeIcon />} target="_blank" href='https://hakem-club.github.io/'>Developer Hub</Button>
            </Stack>
        </Grid>
    </Grid>
};
