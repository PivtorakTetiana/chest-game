import * as PIXI from 'pixi.js';
import { COLORS, CANVAS_WIDTH, CHEST_CONFIG } from '../utils/constants';
import { Chest } from '../entities/Chest';
import { PlayButton } from '../entities/PlayButton';
import { BackgroundLayer } from '../effects/BackgroundLayer';

export class MainScene extends PIXI.Container {
  private background!: BackgroundLayer;
  private chests: Chest[] = [];
  private playButton!: PlayButton;
  private title!: PIXI.Text;

  constructor() {
    super();
    this.createBackground();
    this.createTitle();
    this.createChests();
    this.createPlayButton();
  }

  private createBackground(): void {
    this.background = new BackgroundLayer();
    this.addChild(this.background);
  }

  private createTitle(): void {
    this.title = new PIXI.Text({
      text: 'Chest Game',
      style: {
        fontSize: 38,
        fill: COLORS.TEXT,
        fontWeight: 'bold',
        dropShadow: {
          alpha: 0.6,
          angle: Math.PI / 2,
          blur: 8,
          color: COLORS.NEON_PURPLE,
          distance: 0,
        },
      },
    });
    this.title.anchor.set(0.5, 0);
    this.title.position.set(CANVAS_WIDTH / 2, 30);
    this.addChild(this.title);
  }

  private createChests(): void {
    for (let row = 0; row < CHEST_CONFIG.GRID_ROWS; row++) {
      for (let col = 0; col < CHEST_CONFIG.GRID_COLS; col++) {
        const id = row * CHEST_CONFIG.GRID_COLS + col;
        const x = CHEST_CONFIG.START_X + col * (CHEST_CONFIG.WIDTH + CHEST_CONFIG.PADDING);
        const y = CHEST_CONFIG.START_Y + row * (CHEST_CONFIG.HEIGHT + CHEST_CONFIG.PADDING);

        const chest = new Chest(id, x, y);
        this.chests.push(chest);
        this.addChild(chest);
      }
    }
  }

  private createPlayButton(): void {
    this.playButton = new PlayButton();
    this.addChild(this.playButton);
  }

  getChests(): Chest[] {
    return this.chests;
  }

  getPlayButton(): PlayButton {
    return this.playButton;
  }

  resetChests(): void {
    this.chests.forEach(chest => chest.reset());
  }
}
