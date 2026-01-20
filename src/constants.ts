import { CardRank } from "./types";

// Scoring
export const ACE_HIGH_VALUE = 11;
export const ACE_LOW_VALUE = 1;
export const FACE_CARD_VALUE = 10;

// Game Constants
export const FACE_CARDS = new Set([CardRank.Jack, CardRank.Queen, CardRank.King]);
export const BLACKJACK_MAX = 21;
export const DEALER_MIN_STAND = 17;
