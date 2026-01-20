export enum CardSuit {
  Clubs = "clubs",
  Diamonds = "diamonds",
  Hearts = "hearts",
  Spades = "spades",
}

export enum CardRank {
  Ace = "ace",
  Two = "2",
  Three = "3",
  Four = "4",
  Five = "5",
  Six = "6",
  Seven = "7",
  Eight = "8",
  Nine = "9",
  Ten = "10",
  Jack = "jack",
  Queen = "queen",
  King = "king",
}

export enum GameResult {
  NoResult = "no_result",
  PlayerWin = "player_win",
  DealerWin = "dealer_win",
  Draw = "draw",
}

export enum Turn {
  PlayerTurn = "player_turn",
  DealerTurn = "dealer_turn",
}

export type Card = {
  suit: CardSuit;
  rank: CardRank;
};

export type CardDeck = Array<Card>;
export type Hand = Array<Card>;
export type HandAndDeck = {
  hand: Hand;
  deck: CardDeck;
};
export type GameState = {
  cardDeck: CardDeck;
  playerHand: Hand;
  dealerHand: Hand;
  turn: Turn;
};
