import { Badge, Box, Button, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router";
import { isNameValid } from "../../common/utils";
import CenterContainer from "../components/CenterContainer";
import { usePlayer } from "../GameContext";
import SmartToyIcon from '@mui/icons-material/SmartToy';

export const HomeScreen: React.FC = () => {
  const player_id = usePlayer();
  const history = useHistory();
  const changeRoute = useCallback((gameId: string) => {
    history.push(gameId);
  }, []);

  const [cookies, setCookie] = useCookies(['player_name']);
  const defaultName = cookies.player_name ?? '';
  const [selectedName, setSelectedName] = useState(defaultName);
  const [bot_id, setBotId] = useState<string | null>(null);
  const [apiState, setApiState] = useState<{
    status: "idle" | "pending" | "success" | "error";
    gameId?: string;
    message?: string;
  }>({ status: "idle" });

  useEffect(() => {
    if (player_id != null && apiState.status === "pending") {
      setCookie('player_name', selectedName, { path: '/', maxAge: 31622400 });
      fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/game?player_id=${player_id}&name=${selectedName}${bot_id != null ? `&bot_id=${bot_id}` : ''}`, { method: "POST" })
        .then((res) => res.json())
        .then(({ game_id }) => {
          setApiState({ status: "success", gameId: game_id });
        })
        .catch((err) => {
          setApiState({
            status: "error",
            message: err.toString() || "Something went wrong",
          });
        });
    }
  }, [apiState.status]);

  useEffect(() => {
    if (apiState.status === "success") {
      changeRoute(`game/${apiState.gameId}`);
    }
  }, [apiState.status]);

  const invalid_form = !isNameValid(selectedName);

  return (
    <Stack>
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" gutterBottom>
          Courtpiece (Game)
        </Typography>
        <Typography variant="body1" gutterBottom>
          Court Piece (also known as Hokm Persian: حکم) is a trick-taking card game similar to the card game
          whist in which eldest hand makes trumps after the first five cards have been dealt,
          and trick-play is typically stopped after one party has won seven tricks. A bonus is awarded if
          one party wins the first seven tricks, or even all tricks. The game is played by four players in two teams,
          but there are also adaptations for two or three players.
          — <a href="https://en.wikipedia.org/wiki/Court_piece" target="_blank">Wikipedia</a>
        </Typography>
      </Box>
      <Grid container spacing={2} justifyContent="space-around" alignItems="center">
        <Grid item>
          <Paper sx={{ p: 7 }}>
            <Box>
              <TextField
                error={selectedName.length > 0 && invalid_form}
                helperText="Only characters and numbers, 3 to 8 characters long"
                defaultValue={defaultName}
                label="Pick a name..."
                sx={{ width: '100%' }}
                onChange={({ target }) => setSelectedName(target.value)}
              />
            </Box>
            <Box sx={{ my: 2 }}>
              <Button variant="contained" onClick={() => setApiState({ status: "pending" })}
                disabled={apiState.status === "pending" || invalid_form}>Play with your friends!</Button>
            </Box>
            {['random-bot', 'highcard-bot'].map(bot => <Box key={bot} sx={{ my: 4 }}>
              <Badge color="info" badgeContent={bot}>
                <Button variant="outlined" startIcon={<SmartToyIcon />} onClick={() => {
                  setBotId(bot);
                  setApiState({ status: "pending" });
                }}
                  disabled={apiState.status === "pending" || invalid_form}>Play against Bots!</Button>
              </Badge>
            </Box>)}
          </Paper>
        </Grid>
        <Grid item>
          <Paper>
            <img src="/graphics/home.svg" alt="Hakem.club" style={{}} />
          </Paper>
        </Grid>
      </Grid>
    </Stack>
  );
};
