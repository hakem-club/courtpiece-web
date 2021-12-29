import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GameProvider, useGame, usePlayer } from "../GameContext";
import { PlayerIndex, PlayingCard, PlayingCardSuite, TGameData, TGameID } from "../../common/types";
import CardSet from "../components/CardSet";
import CardSuite from "../components/CardSuite";
import { canCardBePlayed, isNameValid } from "../../common/utils";
import useGameUpdate from "../SocketContext";
import Player from "../components/Player";
import { Alert, Box, Button, Container, Divider, Grid, LinearProgress, TextField } from "@mui/material";
import Card from "../components/Card";
import CenterContainer from "../components/CenterContainer";
import BoltIcon from '@mui/icons-material/Bolt';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useCookies } from "react-cookie";
import SelectableItem from "../components/SelectableItem";
import { useGameApi } from "../useApi";

interface RouteParams {
  gameId: string;
}


const InPlayView: React.FC = () => {
  const game = useGame();
  const api = useGameApi(game.game_id, 'play');

  const canPlayCard = function (card: PlayingCard): boolean {
    if (game.game_status !== 'in_play') {
      return false;
    }

    if (game.whos_turn !== game.your_index) {
      return false;
    }

    return canCardBePlayed(game.your_cards, card, game.floor_suite);
  };

  const playerProps = { lead: game.whos_lead, highlighted: game.whos_turn };
  const who_started_this_round = ((game.whos_turn ?? 0) - game.floor_cards.length + 4) % 4;

  return (
    <>
      {game.match_id == null ? null : <Alert severity="warning"
        action={<Button color="inherit" size="small" to={`/match/${game.match_id}`} component={Link} endIcon={<ChevronRightIcon />}>
          Go to Match
        </Button>}>
        This game is part of a match.
      </Alert>}
      {game.your_index >= 0 ? <Box>
        <Alert severity="info">
          Welcome
          <Player name={game.players[game.your_index]} index={game.your_index} {...playerProps} />
        </Alert>
      </Box> : <Box>
        <Alert severity="info">This game already has all it's players — you can still watch it</Alert>
      </Box>}
      <Box sx={{ py: 2 }}>
        {/* PLAYERS AND TEAMS */}
        <Grid container spacing={2} textAlign='center' sx={{ pb: 8 }}>
          <Grid item xs={12} md={8}>
            {[0, 1, 2, 3].map(index => <Player key={index} name={game.players[index]} index={index as PlayerIndex} {...playerProps} />)}
          </Grid>
          <Grid item xs={12} md={4}>
            <Player name="Team A" index={0 as PlayerIndex} score={game.wins[0]} />
            {game.scoreline.join(' — ')}
            <Player name="Team B" index={1 as PlayerIndex} score={game.wins[1]} />
          </Grid>
        </Grid>

        <Divider />

        {/* TRUMP SUITE */}
        <Box sx={{ textAlign: 'center', mt: -1.7 }}>
          {[0, 1, 2, 3].map(suite => <CardSuite key={suite} suite={suite as PlayingCardSuite} highlighted={game.trump_suite} />)}
        </Box>

        {/* PLAYER CARDS */}
        <Box sx={{ textAlign: 'center', py: 2 }}>
          <CardSet cards={game.your_cards} sort={true}
            onSelectFactory={card => canPlayCard(card) ? () => api.send({ card }) : null}
            disabled={api.pending}
          />
        </Box>

        <Divider />

        {/* FLOOR CARDS */}
        {game.game_status !== 'in_play' ? null : <Box sx={{ textAlign: 'center', py: 2 }}>
          {[0, 1, 2, 3].map(ix => <Box key={ix} display="inline-block">
            <Box flexDirection="row">
              <Box>
                <Player name={game.players[(who_started_this_round + ix) % 4]} index={(who_started_this_round + ix) % 4 as PlayerIndex} {...playerProps} />
              </Box>
              <Box>
                <Card card={game.floor_cards[ix]} />
              </Box>
            </Box>
          </Box>)}
        </Box>}

        {/* GAME ACTIONS */}
        {game.game_status !== 'finished' ? null : <>
          <Divider />
          <Container maxWidth="sm" sx={{ py: 4 }}>
            <ResetGamePane />
          </Container>
        </>}
        {game.game_status !== 'awaiting_trump_suite' ? null : (game.your_index === game.whos_turn ? <ChooseTrumpSuiteView /> : <AwaitingTrumpSuiteView />)}

        {/* TRICKS */}
        {game.tricks.length < 1 ? null : <>
          <Divider />
          <Box sx={{ textAlign: 'center', py: 2 }}>
            {game.tricks.map(({ starting_player, winner, cards }, ix) => <Box key={ix} sx={{ mb: 2 }}>
              {cards.map((card, ix) => <Box key={ix} display="inline-block">
                <Box flexDirection="row">
                  <Box>
                    <Player name={game.players[(starting_player + ix) % 4]} index={(starting_player + ix) % 4 as PlayerIndex} highlighted={winner} lead={game.whos_lead} />
                  </Box>
                  <Box>
                    <Card card={card} highlighted={winner === (starting_player + ix) % 4} />
                  </Box>
                </Box>
              </Box>)}
            </Box>)}
          </Box>
        </>}
      </Box>
    </>
  );
};



const ResetGamePane: React.FC = () => {
  const game = useGame();
  const api = useGameApi(game.game_id, 'reset');

  if (game.next_game_id != null) {
    return <Button
      endIcon={<ChevronRightIcon />}
      href={`/game/${game.next_game_id}`}
      variant="contained">Continue to Next Game!</Button>;
  }

  if (game.whos_admin !== game.your_index) {
    return <Alert severity="info">Admin of this game can create the next game.</Alert>;
  }

  return (
    <Box>
      <Box sx={{ py: 2 }}>
        <Alert severity="info">You're the admin and you can create the next game!</Alert>
      </Box>
      <Button variant="contained" startIcon={<BoltIcon />} onClick={api.send}
        disabled={api.pending}>Create the Next Game!</Button>
    </Box>
  );
};

const AwaitingPlayersView: React.FC = () => {
  const { your_index, players } = useGame();
  return (
    <CenterContainer>
      <Box textAlign='center' sx={{ mb: 4 }}>
        {players.map((name, ix) => <Player key={ix} name={name} index={ix as PlayerIndex} />)}
      </Box>
      {your_index < 0 ? <JoinGameView /> : <AwaitingMorePlayersView />}
    </CenterContainer>
  );
}

const JoinGameView: React.FC = () => {
  const [cookies, setCookie] = useCookies(['player_name']);
  const defaultName = cookies.player_name ?? '';
  const [selectedName, setSelectedName] = useState(defaultName);
  const game = useGame();
  const api = useGameApi(game.game_id, 'join');

  const invalid_form = !isNameValid(selectedName);

  return (
    <>
      <Box>
        <TextField
          error={selectedName.length > 0 && invalid_form}
          helperText="Only characters and numbers, 3 to 8 characters long"
          label="Pick a name..."
          defaultValue={defaultName}
          sx={{ width: '100%' }}
          onChange={({ target }) => setSelectedName(target.value)}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button variant="contained" onClick={() => {
          api.send({ name: selectedName });
          setCookie('player_name', selectedName, { path: '/', maxAge: 31622400 });
        }}
          disabled={api.pending || invalid_form}>Join This Game!</Button>
      </Box>
    </>
  );
};

const AwaitingMorePlayersView: React.FC = () => {
  const game = useGame();
  return (
    <>
      <Box sx={{ my: 4 }}>
        <Alert severity="info">Waiting for <b>{4 - game.players.length} more player</b> to join...</Alert>
      </Box>
      <TextField
        label="Share this link with your friends..."
        defaultValue={window.location.href}
        sx={{ width: '100%' }}
        onFocus={event => event.target.select()}
        InputProps={{ readOnly: true }}
      />
    </>
  );
};

const ChooseTrumpSuiteView: React.FC = () => {
  const game = useGame();
  const api = useGameApi(game.game_id, 'choose_trump_suite');

  return (
    <Box sx={{ m: 4 }}>
      <Box sx={{ my: 2 }}>
        <Alert severity="info">Please choose a trump suite:</Alert>
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        {[0, 1, 2, 3].map(suite => (<SelectableItem key={suite}
          onSelect={() => api.send({ trump_suite: suite })}
          disabled={api.pending}
        >
          <Box sx={{ mx: 1, px: 1, py: 3, border: 'solid 1px #ccc', borderRadius: '1rem' }}>
            <CardSuite suite={suite as PlayingCardSuite} />
          </Box>
        </SelectableItem>))}
      </Box>
    </Box>
  );
};

const AwaitingTrumpSuiteView: React.FC = () => {
  const { whos_lead, players } = useGame();
  return (
    <Box sx={{ m: 4 }}>
      <Alert severity="info">Waiting for <Player name={players[whos_lead]} index={whos_lead} lead={whos_lead} /> to choose trump suite...</Alert>
    </Box>
  );
};

const GameView: React.FC = () => {
  const game = useGame();
  const { game_status } = game;
  switch (game_status) {
    case 'awaiting_trump_suite':
    case 'in_play':
    case 'finished':
      return <InPlayView />;
    case 'awaiting_players':
      return <AwaitingPlayersView />;
  }
};

export const GameScreen: React.FC = () => {
  const { gameId } = useParams<RouteParams>();
  const { updateToken } = useGameUpdate(gameId);
  const api = useGameApi<TGameData>(gameId, null);

  useEffect(() => {
    api.send();
  }, [updateToken]);

  if (!api.pending && api.data == null) {
    return <CenterContainer><Alert severity='error'>Oops! Something went wrong! Error Code: {api.error_code}</Alert></CenterContainer>;
  }

  return (<>
    <LinearProgress sx={{ opacity: api.pending ? 1 : 0, mb: -0.5 }} />
    {api.data == null ? null : <GameProvider value={{ ...api.data, game_id: gameId }}>
      <Box sx={{py:2}}>
        <GameView />
      </Box>
    </GameProvider>}
  </>);
};
