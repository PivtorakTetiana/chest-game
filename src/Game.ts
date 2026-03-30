import * as PIXI from 'pixi.js';
import { StateManager } from './StateManager';
import { MainScene } from './scenes/MainScene';
import { BonusScene } from './scenes/BonusScene';
import { GameState, ChestResult } from './types/index';
import { Chest } from './entities/Chest';
import { PROBABILITIES, WIN_AMOUNTS } from './utils/constants';
import { AnimationController } from './AnimationController';

export class Game {
  private app: PIXI.Application;
  private stateManager: StateManager;
  private mainScene: MainScene;
  private bonusScene: BonusScene;
  private animationController: AnimationController;

  constructor(app: PIXI.Application) {
    this.app = app;
    this.stateManager = new StateManager();
    this.mainScene = new MainScene();
    this.bonusScene = new BonusScene();
    this.animationController = new AnimationController();
    this.init();
  }

  private init(): void {
    this.app.stage.addChild(this.mainScene);
    this.app.stage.addChild(this.bonusScene);
    this.setupEventListeners();
    this.setInitialState();
  }

  private setInitialState(): void {
    this.mainScene.getPlayButton().enable();
    this.mainScene.getChests().forEach(chest => chest.disable());
  }

  async playChestSpawnAnimation(): Promise<void> {
    await this.animationController.playChestSpawnAnimation(this.mainScene.getChests());
  }

  private setupEventListeners(): void {
    this.mainScene.getPlayButton().on('click', () => {
      void this.onPlayClick();
    });
    
    this.mainScene.getChests().forEach(chest => {
      chest.on('click', () => {
        void this.onChestClick(chest);
      });
    });
  }

  private async onPlayClick(): Promise<void> {
    if (this.stateManager.getState() !== GameState.INITIAL) return;

    if (this.stateManager.areAllChestsOpened()) {
      this.resetGame();
    }

    try {
      this.stateManager.setState(GameState.PLAYING);
      this.mainScene.getPlayButton().disable();

      await this.animationController.playChestSpawnAnimation(this.mainScene.getChests());

      this.mainScene.getChests().forEach(chest => {
        chest.enable();
      });
    } catch (error) {
      console.error('Error during play button animation:', error);
      this.mainScene.getPlayButton().enable();
      this.stateManager.setState(GameState.INITIAL);
    }
  }

  private async onChestClick(chest: Chest): Promise<void> {
    if (this.stateManager.getState() !== GameState.PLAYING) return;
    if (chest.isOpened) return;

    try {
      this.disableAllInteractions();
      this.stateManager.setState(GameState.CHEST_OPENING);

      const result = this.determineResult();
      const amount = this.calculateWinAmount(result);

      await this.animationController.playChestAnimation(chest, result, amount);

      this.stateManager.markChestOpened(chest.id, result, amount);

      if (result === ChestResult.BONUS) {
        await this.showBonusScreen(amount);
      }

      if (this.stateManager.areAllChestsOpened()) {
        this.mainScene.getPlayButton().enable();
        this.stateManager.setState(GameState.INITIAL);
      } else {
        this.enableUnopenedChests();
        this.stateManager.setState(GameState.PLAYING);
      }
    } catch (error) {
      console.error('Error during chest animation:', error);
      this.enableUnopenedChests();
      this.stateManager.setState(GameState.PLAYING);
    }
  }

  private determineResult(): ChestResult {
    const isWinner = Math.random() < PROBABILITIES.WIN_CHANCE;

    if (!isWinner) {
      return ChestResult.LOSE;
    }

    const isBonus = Math.random() < PROBABILITIES.BONUS_FROM_WIN;
    return isBonus ? ChestResult.BONUS : ChestResult.WIN;
  }

  private calculateWinAmount(result: ChestResult): number {
    if (result === ChestResult.LOSE) return 0;

    if (result === ChestResult.WIN) {
      return Math.floor(
        Math.random() * (WIN_AMOUNTS.REGULAR_MAX - WIN_AMOUNTS.REGULAR_MIN) +
          WIN_AMOUNTS.REGULAR_MIN
      );
    }

    return Math.floor(
      Math.random() * (WIN_AMOUNTS.BONUS_MAX - WIN_AMOUNTS.BONUS_MIN) + WIN_AMOUNTS.BONUS_MIN
    );
  }

  private async showBonusScreen(amount: number): Promise<void> {
    this.mainScene.visible = false;
    this.bonusScene.visible = true;
    this.bonusScene.reset();

    await this.animationController.playBonusAnimation(this.bonusScene, amount);

    this.bonusScene.visible = false;
    this.mainScene.visible = true;
  }

  private disableAllInteractions(): void {
    this.mainScene.getChests().forEach(chest => chest.disable());
    this.mainScene.getPlayButton().disable();
  }

  private enableUnopenedChests(): void {
    this.mainScene.getChests().forEach(chest => {
      if (!chest.isOpened) {
        chest.enable();
      }
    });
  }

  resetGame(): void {
    this.stateManager.resetGame();
    this.mainScene.resetChests();
  }

  destroy(): void {
    this.mainScene.getPlayButton().removeAllListeners();
    this.mainScene.getChests().forEach(chest => {
      chest.removeAllListeners();
    });

    this.mainScene.destroy({ children: true });
    this.bonusScene.destroy({ children: true });
    this.animationController.destroy();
  }
}
