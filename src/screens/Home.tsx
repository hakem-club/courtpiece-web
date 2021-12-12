import { Box, Button, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { isNameValid } from "../../common/utils";
import CenterContainer from "../components/CenterContainer";
import { usePlayer } from "../GameContext";

export const HomeScreen: React.FC = () => {
  const { t } = useTranslation();
  const player_id = usePlayer();
  const history = useHistory();
  const changeRoute = useCallback((gameId: string) => {
    history.push(gameId);
  }, []);

  const [cookies, setCookie] = useCookies(["player_name"]);
  const defaultName = cookies.player_name ?? "";
  const [selectedName, setSelectedName] = useState(defaultName);
  const [apiState, setApiState] = useState<{
    status: "idle" | "pending" | "success" | "error";
    gameId?: string;
    message?: string;
  }>({ status: "idle" });

  useEffect(() => {
    if (player_id != null && apiState.status === "pending") {
      fetch(
        `${
          import.meta.env.VITE_SERVER_DOMAIN
        }/api/game?player_id=${player_id}&name=${selectedName}`,
        { method: "POST" }
      )
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
    <CenterContainer>
      <Box>
        <TextField
          error={selectedName.length > 0 && invalid_form}
          helperText={t("name-field-helper")}
          defaultValue={defaultName}
          label={t("pick-a-name")}
          sx={{ width: "100%" }}
          onChange={({ target }) => setSelectedName(target.value)}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button
          variant="contained"
          onClick={() => {
            setApiState({ status: "pending" });
            setCookie("player_name", selectedName, {
              path: "/",
              maxAge: 31622400,
            });
          }}
          disabled={apiState.status === "pending" || invalid_form}
        >
          {t("start-new-game")}
        </Button>
      </Box>
    </CenterContainer>
  );
};
