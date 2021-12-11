import React from "react";
import { useLocation } from "react-router-dom";
import { TGameData, TGameID, TPlayerID } from "../common/types";

import { createRequiredContext } from "./utils";

export function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

type TGame = TGameData & { game_id: TGameID };

export const [GameProvider, useGame] = createRequiredContext<TGame>("game");
export const [PlayerProvider, usePlayer] = createRequiredContext<TPlayerID>(
  "player",
  () => useQuery().get("pid") // TODO: only for local dev
);
