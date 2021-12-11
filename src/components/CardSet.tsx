import { Box, IconButton } from "@mui/material";
import { ReactElement } from "react";
import { PlayingCard } from "../../common/types";
import Card from "./Card";

export default function CardSet(props: {
    cards: PlayingCard[];
    sort?: boolean;
    disabled?: boolean;
    onSelectFactory?: ((card: PlayingCard) => ((() => void) | null));
  }): ReactElement {
    const { cards, sort = false, onSelectFactory, disabled } = props;
    return (
      <Box sx={{whiteSpace: 'nowrap', overflowX: 'auto', pb: onSelectFactory == null ? 0 : 2  }}>
        {(sort ? cards.sort((a, b) => a - b) : cards).map(card => {
          const onSelect = onSelectFactory == null ? null : onSelectFactory(card);
          return <Card card={card} {...(onSelect == null ? {} : {onSelect})} />;
        })}
      </Box>
    );
  }
