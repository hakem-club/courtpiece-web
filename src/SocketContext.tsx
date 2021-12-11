import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { SOCKET_IO_UPDATE_EVENT } from "../common/constants";

const useGameUpdate = (game_id: string) => {
  const [updateToken, setUpdateTokenBase] = useState(+new Date());
  const setUpdateToken = () => setUpdateTokenBase(+new Date());

  useEffect(() => {
    // Creates a WebSocket connection
    const socket = io(import.meta.env.VITE_SERVER_DOMAIN as string, {query: { game_id }});

    // listen to update events
    socket.on(SOCKET_IO_UPDATE_EVENT, () => setUpdateToken());

    // Destroys the socket reference when the connection is closed
    return () => {
        socket.disconnect();
    };
  }, [game_id]);

  return {updateToken, setUpdateToken};
};

export default useGameUpdate;
