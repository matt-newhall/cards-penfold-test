import { CardRank } from "./types";

export const ACE_HIGH_VALUE = 11;
export const ACE_LOW_VALUE = 1;
export const FACE_CARD_VALUE = 10;
export const BLACKJACK_MAX = 21;

export const FACE_CARDS = new Set([CardRank.Jack, CardRank.Queen, CardRank.King]);
