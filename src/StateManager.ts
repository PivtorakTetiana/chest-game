import { GameState, ChestResult, type ChestData } from './types/index';

export class StateManager {
  private currentState: GameState;
  private chests: ChestData[];

  constructor() {
    this.currentState = GameState.INITIAL;
    this.chests = Array(6)
      .fill(null)
      .map((_, i) => ({
        id: i,
        isOpened: false,
      }));
  }

  setState(state: GameState): void {
    if (this.currentState === state) return;

    if (!this.isValidTransition(state)) {
      console.error(`Invalid state transition: ${this.currentState} -> ${state}`);
      return;
    }
    this.currentState = state;
  }

  private isValidTransition(newState: GameState): boolean {
    const validTransitions: Record<GameState, GameState[]> = {
      [GameState.INITIAL]: [GameState.PLAYING],
      [GameState.PLAYING]: [GameState.CHEST_OPENING, GameState.INITIAL],
      [GameState.CHEST_OPENING]: [GameState.PLAYING, GameState.INITIAL],
    };

    return validTransitions[this.currentState]?.includes(newState) ?? false;
  }

  getState(): GameState {
    return this.currentState;
  }

  areAllChestsOpened(): boolean {
    return this.chests.every(chest => chest.isOpened);
  }

  markChestOpened(id: number, result: ChestResult, winAmount?: number): void {
    const chest = this.chests[id];
    if (chest) {
      chest.isOpened = true;
      chest.result = result;
      chest.winAmount = winAmount;
    }
  }

  resetGame(): void {
    this.chests.forEach(chest => {
      chest.isOpened = false;
      chest.result = undefined;
      chest.winAmount = undefined;
    });
    this.currentState = GameState.INITIAL;
  }

  getChestData(id: number): ChestData | undefined {
    return this.chests[id];
  }
}
