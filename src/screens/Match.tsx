import { Alert, Box, IconButton, LinearProgress, Step, StepLabel, Stepper } from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlayerIndex, TMatchData, TMatchID } from "../../common/types";
import CenterContainer from "../components/CenterContainer";
import Player from "../components/Player";
import useGameUpdate from "../SocketContext";
import { useMatchApi } from "../useApi";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface RouteParams {
    matchId: TMatchID;
}

export const MatchScreen: React.FC = () => {
    const { matchId } = useParams<RouteParams>();
    const { updateToken } = useGameUpdate(matchId);
    const api = useMatchApi<TMatchData>(matchId, null);

    useEffect(() => {
        api.send();
    }, [updateToken]);

    if (!api.pending && api.data == null) {
        return <CenterContainer><Alert severity='error'>Oops! Something went wrong! Error Code: {api.error_code}</Alert></CenterContainer>;
    }

    return (<>
        <LinearProgress sx={{ opacity: api.pending ? 1 : 0, mb: -0.5 }} />
        {api.data == null ? null : <>
            <Stepper activeStep={api.data.finished_games.length + 1} orientation="vertical" sx={{ p: 4 }}>
                {api.data.finished_games.map((game, ix) => <Step key={ix}>
                    <StepLabel>
                        <Player name="Team A" index={0 as PlayerIndex} score={game.wins[0]} highlighted={game.winner_team} />
                        {game.scoreline.join(' — ')}
                        <Player name="Team B" index={1 as PlayerIndex} score={game.wins[1]} highlighted={game.winner_team} />
                        <Box sx={{ mx: 2 }} display="inline-block">
                            Game #{ix+1}
                            <IconButton aria-label="delete" size="small" href={`/game/${game.id}`} target="_blank">
                                <OpenInNewIcon fontSize="inherit" />
                            </IconButton>
                        </Box>
                    </StepLabel>
                </Step>)}
                {api.data.current_game == null ? null : <Step>
                    <Player name="Team A" index={0 as PlayerIndex} score={api.data.current_game.wins[0]} />
                    {api.data.current_game.status}
                    <Player name="Team B" index={1 as PlayerIndex} score={api.data.current_game.wins[1]} />
                    <Box sx={{ mx: 2 }} display="inline-block">
                        Game #{api.data.finished_games.length+1}
                        <IconButton aria-label="delete" size="small" href={`/game/${api.data.current_game.id}`} target="_blank">
                            <OpenInNewIcon fontSize="inherit" />
                        </IconButton>
                    </Box>
                </Step>}
            </Stepper>
        </>}
    </>);
};
