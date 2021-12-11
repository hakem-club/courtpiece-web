import { PlayingCard, PlayingCardSuite, PlayingCardRank } from "./types";

export const getSuiteOfCard = (card: PlayingCard): PlayingCardSuite => {
  return Math.floor(Math.floor((card as number) / 13)) as PlayingCardSuite;
};

export const getRankOfCard = (card: PlayingCard): PlayingCardRank => {
  return ((card as number) % 13) as PlayingCardRank;
};

export function canCardBePlayed(player_cards: PlayingCard[], card: PlayingCard, floor_suite: PlayingCardSuite | null): boolean {
  if (floor_suite == null) {
    return true;
  }

  const card_suite = getSuiteOfCard(card);
  if (card_suite === floor_suite) {
    return true;
  }

  const player_has_suite =
    player_cards.map(getSuiteOfCard).indexOf(floor_suite) >= 0;
  return !player_has_suite;
}

export function isNameValid(name: string) {
  return /^[a-z\d]{3,8}$/gi.test(name);
}
