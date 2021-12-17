import { Badge, Box, Button, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router";
import CenterContainer from "../components/CenterContainer";
import { usePlayer } from "../GameContext";
import SmartToyIcon from '@mui/icons-material/SmartToy';

function validURL(value: string): boolean {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(value);
}


export const TestBotScreen: React.FC = () => {
  const player_id = usePlayer();
  const history = useHistory();
  const changeRoute = useCallback((gameId: string) => {
    history.push(gameId);
  }, []);

  const defaultBotApiHost = "https://hakemclub-bot-random.herokuapp.com/bots/highcard-bot";
  const [botApiHost, setBotApiHost] = useState(defaultBotApiHost);
  const [bot_id, setBotId] = useState<string | null>(null);
  const [apiState, setApiState] = useState<{
    status: "idle" | "pending" | "success" | "error";
    gameId?: string;
    message?: string;
  }>({ status: "idle" });

  useEffect(() => {
    if (player_id != null && apiState.status === "pending") {
      fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/game?player_id=${player_id}&bot_host=${botApiHost}&bot_id=${bot_id}`, { method: "POST" })
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

  const invalid_form = !validURL(botApiHost);

  return (
    <CenterContainer>
      <Box>
        <Box>
          <TextField
            error={botApiHost.length > 0 && invalid_form}
            label="Enter your bots API host"
            defaultValue={defaultBotApiHost}
            sx={{ width: '100%' }}
            onChange={({ target }) => setBotApiHost(target.value)}
          />
        </Box>
        {['random-bot', 'highcard-bot'].map(bot => <Box key={bot} sx={{ my: 4 }}>
          <Badge color="info" badgeContent={bot}>
            <Button variant="outlined" startIcon={<SmartToyIcon />} onClick={() => {
              setBotId(bot);
              setApiState({ status: "pending" });
            }}
              disabled={apiState.status === "pending" || invalid_form}>Play against other Bots!</Button>
          </Badge>
        </Box>)}
      </Box>
    </CenterContainer>
  );
};
