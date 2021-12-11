import "./css/App.css";
import "./css/playing_cards.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { HomeScreen } from "./screens/Home";
import { GameScreen } from "./screens/Game";
import { PlayerProvider } from "./GameContext";

import { useEffect } from "react";
import { useCookies } from 'react-cookie'
import { v4 as uuid } from "uuid";

export default function App() {
  const [cookies, setCookie] = useCookies(['player_id']);
  const { player_id } = cookies;
  useEffect(() => {
    if (player_id == null) {
      setCookie('player_id', uuid(), { path: '/', maxAge: 31622400 });
    }
  });

  if (player_id == null) {
    return (<>
      initialising...
    </>);
  }

  return (
    <PlayerProvider value={player_id}>
      <BrowserRouter>
        <Switch>
          <Route path="/" exact component={HomeScreen} />
          <Route path="/game/:gameId" component={GameScreen} />
        </Switch>
      </BrowserRouter>
    </PlayerProvider>
  );
}
