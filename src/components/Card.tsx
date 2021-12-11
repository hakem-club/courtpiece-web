import { Box } from "@mui/material";
import { ReactElement } from "react";
import { PlayingCard } from "../../common/types";
import SelectableItem from "./SelectableItem";

export default function Card(props: { card: PlayingCard, highlighted?: boolean, onSelect?: () => any }): ReactElement {
  const { card, highlighted, onSelect } = props;
  const image = <Box
    component="img"
    src={`/cards/${card}.svg`}
    sx={{ boxShadow: 'rgb(0 0 0 / 25%) 1px 1px 2px' }}
    className={`card ${highlighted ? 'highlighted' : ''}`}
  />;
  return onSelect == null ? image : <SelectableItem {...{onSelect}}>{image}</SelectableItem>;
}
