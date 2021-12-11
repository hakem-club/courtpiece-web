import { Badge } from "@mui/material";
import { styled } from '@mui/material/styles';
import { ReactElement } from "react";
import { PlayerIndex } from "../../common/types";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 9,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0',
    background: '#eee'
  },
}));

export default function Player(props: { name: string, index: PlayerIndex, lead?: PlayerIndex, highlighted?: PlayerIndex | null, score?: number }): ReactElement {
  const { name, index, highlighted, lead, score } = props;
  const className = `badge player player-${index} team-${index % 2} ${highlighted === index ? 'highlighted' : ''}`;
  const result = (<span className={className}>{name}</span>);

  if (lead === index) {
    return <StyledBadge badgeContent={<img src="/icons/crown.svg" style={{ width: '14px' }} />}>
      {result}
    </StyledBadge>;
  }

  if (score != null) {
    return <StyledBadge badgeContent={`${score}`}>
      {result}
    </StyledBadge>;
  }

  return result;
}
