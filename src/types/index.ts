export enum GameState {
  INITIAL = 'INITIAL',
  PLAYING = 'PLAYING',
  CHEST_OPENING = 'CHEST_OPENING',
}

export enum ChestResult {
  LOSE = 'LOSE',
  WIN = 'WIN',
  BONUS = 'BONUS',
}

export interface ChestData {
  id: number;
  isOpened: boolean;
  result?: ChestResult;
  winAmount?: number;
}
