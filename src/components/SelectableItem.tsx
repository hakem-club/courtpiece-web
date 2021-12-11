
import { Box, IconButton } from "@mui/material";
import { ReactElement } from "react";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';

export default function SelectableItem(props: { children: ReactElement, onSelect: () => any, disabled?: boolean}): ReactElement {
  const { children, onSelect, disabled} = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      {onSelect == null ? null : <Box sx={{ position: 'absolute', width: '100%', bottom: '-1.5rem', left: 0, textAlign: 'center', display: 'inline-block' }}>
        <IconButton color="primary" aria-label="play" onClick={onSelect} size="large" disabled={disabled}>
          <PlayCircleFilledWhiteIcon fontSize="inherit" />
        </IconButton>
      </Box>}
      {children}
    </Box>
  );
}
