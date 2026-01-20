import { useState } from "react";
import {
  Card,
  CardRank,
  CardDeck,
  CardSuit,
  GameState,
  Hand,
  GameResult,
  HandAndDeck,
  Turn,
} from "./types";
import {
  ACE_HIGH_VALUE,
  ACE_LOW_VALUE,
  FACE_CARD_VALUE,
  BLACKJACK_MAX,
  FACE_CARDS,
  DEALER_MIN_STAND,
} from "./constants";

//UI Elements
const CardBackImage = () => (
  <img src={process.env.PUBLIC_URL + `/SVG-cards/png/1x/back.png`} />
);

const CardImage = ({ suit, rank }: Card) => {
  const card = rank === CardRank.Ace ? 1 : rank;
  return (
    <img
      src={
        process.env.PUBLIC_URL +
        `/SVG-cards/png/1x/${suit.slice(0, -1)}_${card}.png`
      }
    />
  );
};

//Setup
const newCardDeck = (): CardDeck =>
  Object.values(CardSuit)
    .map((suit) =>
      Object.values(CardRank).map((rank) => ({
        suit,
        rank,
      }))
    )
    .reduce((a, v) => [...a, ...v]);

const shuffle = (deck: CardDeck): CardDeck => {
  return deck.sort(() => Math.random() - 0.5);
};

const takeCard = (deck: CardDeck): { card: Card; remaining: CardDeck } => {
  const card = deck[deck.length - 1];
  const remaining = deck.slice(0, deck.length - 1);
  return { card, remaining };
};

const setupGame = (): GameState => {
  const cardDeck = shuffle(newCardDeck());
  return {
    playerHand: cardDeck.slice(cardDeck.length - 2, cardDeck.length),
    dealerHand: cardDeck.slice(cardDeck.length - 4, cardDeck.length - 2),
    cardDeck: cardDeck.slice(0, cardDeck.length - 4), // remaining cards after player and dealer have been give theirs
    turn: Turn.PlayerTurn,
  };
};

//Scoring
const getCardValue = (card: Card): number => {
  if (card.rank === CardRank.Ace) return ACE_HIGH_VALUE;
  if (FACE_CARDS.has(card.rank)) return FACE_CARD_VALUE;
  return parseInt(card.rank);
};

const calculateHandScore = (hand: Hand): number => {
  let acesCount = 0;

  let score = hand.reduce((acc, card) => {
    const value = getCardValue(card);

    if (card.rank === CardRank.Ace) {
      acesCount++;
    };

    return acc + value;
  }, 0);

  while (score > BLACKJACK_MAX && acesCount > 0) {
    score -= ACE_HIGH_VALUE - ACE_LOW_VALUE;
    acesCount--;
  }

  return score;
};

const determineGameResult = (state: GameState): GameResult => {
  const playerScore = calculateHandScore(state.playerHand);
  const dealerScore = calculateHandScore(state.dealerHand);

  const isPlayerBust = playerScore > BLACKJACK_MAX;
  const isDealerBust = dealerScore > BLACKJACK_MAX;
  const isPlayerBlackjack = playerScore === 21 && state.playerHand.length === 2;
  const isDealerBlackjack = dealerScore === 21 && state.dealerHand.length === 2;

  if (isPlayerBust && isDealerBust) return GameResult.NoResult;
  if (isPlayerBust) return GameResult.DealerWin;
  if (isDealerBust) return GameResult.PlayerWin;

  if (isPlayerBlackjack && isDealerBlackjack) return GameResult.Draw;
  if (isPlayerBlackjack) return GameResult.PlayerWin;
  if (isDealerBlackjack) return GameResult.DealerWin;

  if (playerScore > dealerScore) return GameResult.PlayerWin;
  if (dealerScore > playerScore) return GameResult.DealerWin;

  return GameResult.Draw;
};

const dealerPlaysHand = ({ hand, deck }: HandAndDeck): HandAndDeck => {
  if (calculateHandScore(hand) >= DEALER_MIN_STAND) {
    return { hand, deck };
  }

  if (deck.length === 0) {
    throw Error("No cards left in deck");
  }

  const { card, remaining } = takeCard(deck);
  return dealerPlaysHand({ deck: remaining, hand: [...hand, card] });
}

//Player Actions
const playerStands = (state: GameState): GameState => {
  const { hand, deck } = dealerPlaysHand({ hand: state.dealerHand, deck: state.cardDeck });

  return {
    ...state,
    dealerHand: hand,
    cardDeck: deck,
    turn: Turn.DealerTurn,
  };
};

const playerHits = (state: GameState): GameState => {
  const { card, remaining } = takeCard(state.cardDeck);
  return {
    ...state,
    cardDeck: remaining,
    playerHand: [...state.playerHand, card],
  };
};

//UI Component
const Game = (): JSX.Element => {
  const [state, setState] = useState(setupGame());

  const gameResult = determineGameResult(state)

  return (
    <>
      <div>
        <p>There are {state.cardDeck.length} cards left in deck</p>
        <button
          disabled={state.turn === Turn.DealerTurn}
          onClick={(): void => setState(playerHits)}
        >
          Hit
        </button>
        <button
          disabled={state.turn === Turn.DealerTurn}
          onClick={(): void => setState(playerStands)}
        >
          Stand
        </button>
        <button onClick={(): void => setState(setupGame())}>Reset</button>
      </div>
      <p>Player Cards</p>
      <div>
        {state.playerHand.map(CardImage)}
        <p>Player Score {calculateHandScore(state.playerHand)}</p>
      </div>
      <p>Dealer Cards</p>
      {state.turn === Turn.PlayerTurn && state.dealerHand.length > 0 ? (
        <div>
          <CardBackImage />
          <CardImage {...state.dealerHand[1]} />
        </div>
      ) : (
        <div>
          {state.dealerHand.map(CardImage)}
          <p>Dealer Score {calculateHandScore(state.dealerHand)}</p>
        </div>
      )}
      {state.turn === Turn.DealerTurn &&
      gameResult !== "no_result" ? (
        <p>{gameResult}</p>
      ) : (
        <p>{state.turn}</p>
      )}
    </>
  );
};

export {
  Game,
  playerHits,
  playerStands,
  determineGameResult,
  calculateHandScore,
  setupGame,
};
