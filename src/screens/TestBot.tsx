import { Badge, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
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

const KNOWN_BOT_IDS = ['highcard-bot', 'random-bot', 'custom'];

type TBot = {id: string, host?: string};
type TBotSelectorProps = {
  label: string,
  bot: TBot,
  setBot: (bot: TBot) => any,
}

export const BotSelector: React.FC<TBotSelectorProps> = (props: TBotSelectorProps) => {
  const {bot, setBot} = props;
  const invalid_host = bot.host != null && !validURL(bot.host);

  return (<FormControl fullWidth sx={{ my: 2 }}>
    <InputLabel id="demo-simple-select-label">{props.label}</InputLabel>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={bot.id}
      label="Age"
      onChange={({target}) => setBot({ id: target.value })}
    >
      {KNOWN_BOT_IDS.map(id => <MenuItem key={id} value={id}>{id}</MenuItem>)}
    </Select>
    {bot.id === 'custom' ? <TextField
      error={invalid_host}
      label="Enter your bots API host"
      sx={{ width: '100%', my: 2 }}
      onChange={({ target }) => setBot({ ...bot, host: target.value })}
    /> : null}
    </FormControl>
  );
}

export const TestBotScreen: React.FC = () => {
  const player_id = usePlayer();
  const history = useHistory();
  const changeRoute = useCallback((match_id: string) => {
    history.push(match_id);
  }, []);

  const [apiState, setApiState] = useState<{
    status: "idle" | "pending" | "success" | "error";
    match_id?: string;
    message?: string;
  }>({ status: "idle" });

  const [bot1, setBot1] = useState<TBot>({ id: KNOWN_BOT_IDS[0] });
  const [bot2, setBot2] = useState<TBot>({ id: KNOWN_BOT_IDS[0] });

  useEffect(() => {
    if (player_id != null && apiState.status === "pending") {
      const bot1_params = `bot1_id=${bot1.id}${bot1.host == null ? '' : `&bot1_host=${bot1.host}`}`
      const bot2_params = `bot2_id=${bot2.id}${bot2.host == null ? '' : `&bot2_host=${bot2.host}`}`
      fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/match?player_id=${player_id}&${bot1_params}&${bot2_params}`, { method: "POST" })
        .then((res) => res.json())
        .then(({ match_id }) => {
          setApiState({ status: "success", match_id: match_id });
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
      changeRoute(`match/${apiState.match_id}`);
    }
  }, [apiState.status]);

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <BotSelector label="Team A Bot" bot={bot1} setBot={setBot1} />
        </Grid>
        <Grid item xs={12} md={6}>
          <BotSelector label="Team B Bot" bot={bot2} setBot={setBot2} />
        </Grid>
      </Grid>
      <Box sx={{ my: 2 }}>
        <Button variant="contained" onClick={() => setApiState({ status: "pending" })}
          disabled={apiState.status === "pending"}>
            Start a Single Game!
        </Button>
      </Box>
      <Box sx={{ my: 2 }}>
        <Button variant="outlined" onClick={() => setApiState({ status: "pending" })}
          disabled={apiState.status === "pending"}>
            Start a Match (Best of 13!)
        </Button>
      </Box>
    </Box>
  );
};
