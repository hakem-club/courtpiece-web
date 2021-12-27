import { Badge, Box, Button, Grid, TextField } from "@mui/material";
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
    <Grid container spacing={2} sx={{ pt: 16 }}>
      <Grid item>
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
      </Grid>
    </Grid>
  );
};
