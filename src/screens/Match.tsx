import { Alert, Avatar, Badge, Box, Button, CircularProgress, Divider, IconButton, LinearProgress, Stack, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlayerIndex, TeamIndex, TGameID, TGameStatus, TMatchData, TMatchID } from "../../common/types";
import CenterContainer from "../components/CenterContainer";
import Player from "../components/Player";
import useGameUpdate from "../SocketContext";
import { useMatchApi } from "../useApi";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { blue } from "@mui/material/colors";

interface RouteParams {
    matchId: TMatchID;
}

type TMatchGameProps = {
    ix: number,
    game_id: TGameID,
    wins: [number, number],
    scoreline?: [number, number],
    status?: TGameStatus,
    winner_team?: TeamIndex,
}

export const MatchGame: React.FC<TMatchGameProps> = (props: TMatchGameProps) => {
    const { ix, game_id, wins, scoreline, status, winner_team } = props;
    return <Step key={ix ?? 'current'}>
        <Stack direction="row" spacing={4} alignItems="center" sx={{ ml: -1 }}>
            <Badge badgeContent={<IconButton sx={{ top: "20px", right: "-5px", background: "white" }} aria-label="delete" size="small" href={`/game/${game_id}`} target="_blank">
                <OpenInNewIcon fontSize="inherit" />
            </IconButton>
            }>
                {scoreline == null ?
                    <Avatar sx={{ bgcolor: blue[100], color: blue[700] }}><CircularProgress sx={{position: "absolute", top: 0, left: 0}} />{ix}</Avatar> :
                    <Avatar sx={{ bgcolor: blue[700] }}>{ix}</Avatar>}
            </Badge>
            <Box>
                <Player name="Team A" index={0 as PlayerIndex} score={wins[0]} highlighted={winner_team} />
                {scoreline == null ? status : scoreline.join(' — ')}
                <Player name="Team B" index={1 as PlayerIndex} score={wins[1]} highlighted={winner_team} />
            </Box>
        </Stack>
    </Step>;
}

export const MatchScreen: React.FC = () => {
    const { matchId } = useParams<RouteParams>();
    const { updateToken } = useGameUpdate(matchId);
    const api = useMatchApi<TMatchData>(matchId, null);
    const resetApi = useMatchApi<{ match_id: TMatchID }>(matchId, 'reset');

    useEffect(() => {
        api.send();
    }, [updateToken]);

    if (!api.pending && api.data == null) {
        return <CenterContainer><Alert severity='error'>Oops! Something went wrong! Error Code: {api.error_code}</Alert></CenterContainer>;
    }

    return (<>
        <LinearProgress sx={{ opacity: api.pending || resetApi.pending ? 1 : 0, mb: -0.5 }} />
        <Box sx={{ p: 4 }}>
            {api.data == null ? null : <>
                <Stepper activeStep={api.data.finished_games.length} orientation="vertical">
                    {api.data.finished_games.map((game, ix) => <MatchGame ix={ix + 1} game_id={game.id} wins={game.wins} scoreline={game.scoreline} winner_team={game.winner_team} />)}
                    {api.data.current_game == null ? null : <MatchGame ix={api.data.finished_games.length + 1} game_id={api.data.current_game.id} wins={api.data.current_game.wins} status={api.data.current_game.status} />}
                </Stepper>
                <Divider sx={{ my: 2 }} />
                {api.data.current_game != null ? null : <>
                    {resetApi.data == null ? (<Button variant="contained" onClick={() => resetApi.send()} disabled={resetApi.pending}>
                        Restart!
                    </Button>) : (<Button
                        endIcon={<ChevronRightIcon />}
                        href={`/match/${resetApi.data.match_id}`}
                        variant="contained">Continue to Next Match!</Button>)
                    }</>}
            </>}
        </Box>
    </>);
};
