import { useState, useEffect } from "react";
import { TGameID, TMatchID } from "../common/types";
import { usePlayer } from "./GameContext";

type TApiAction = 'join' | 'play' | 'reset' | 'choose_trump_suite';
type TState<T> = {
    error_code?: string,
    data?: T,
};
type TParams = Object;

export function useGameApi<T>(game_id: TGameID, action: TApiAction | null) {
  return useApiFactory<T>('game')(game_id, action);
}

export function useMatchApi<T>(match_id: TMatchID, action: TApiAction | null) {
  return useApiFactory<T>('match')(match_id, action);
}

function useApiFactory<T>(noun: string) {
  return (identifier: string, action: TApiAction | null) => {
    const [pending, setPending] = useState<boolean>(false);

    const [params, setParamsBase] = useState({});
    const setParams = (value: TParams) => {
      setPending(true);
      setParamsBase(value);
    }

    const [{error_code, data}, setStateBase] = useState<TState<T>>({});
    const setState = (value: TState<T>) => {
      setPending(false);
      setStateBase(value);
    }

    const player_id = usePlayer();

    useEffect(() => {
      if (pending) {
        fetch(`${import.meta.env.VITE_SERVER_DOMAIN}/api/${noun}/${identifier}/${action ?? ''}?${new URLSearchParams({ ...params, player_id }).toString()}`, { method: action == null ? "GET" : "POST" })
          .then(async (res) => {
            if (res.ok) {
              setState({ data: await res.json()});
            }
            else {
              setState({ error_code: await res.text()});
            }
          })
          .catch((_err) => setState({ error_code: "UNKNOWN"}));
      }
    }, [pending]);

    return {
      pending,
      data,
      error_code,
      send: (params: TParams = {}) => {
        setParams(params);
      },
    }
  };
};
