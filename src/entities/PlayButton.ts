import * as PIXI from 'pixi.js';
import { COLORS, PLAY_BUTTON_CONFIG } from '../utils/constants';
import { GlassPanel } from '../effects/GlassPanel';
import { InteractiveEntity } from './InteractiveEntity';

export class PlayButton extends InteractiveEntity {
  private buttonLabel: PIXI.Text;

  constructor() {
    super(PLAY_BUTTON_CONFIG.X, PLAY_BUTTON_CONFIG.Y);
    this.buttonLabel = new PIXI.Text();
    this._enabled = true;
    this.createGlassPanel();
    this.createLabel();
    this.setupInteractivity();
  }

  protected createGlassPanel(): void {
    this.glassPanel = new GlassPanel({
      width: PLAY_BUTTON_CONFIG.WIDTH,
      height: PLAY_BUTTON_CONFIG.HEIGHT,
      borderRadius: PLAY_BUTTON_CONFIG.BORDER_RADIUS,
      borderWidth: PLAY_BUTTON_CONFIG.BORDER_WIDTH,
      borderColor: COLORS.NEON_PURPLE,
      glassColor: 0x2d1b4e,
      glassAlpha: 0.7,
      shadowBlur: PLAY_BUTTON_CONFIG.SHADOW_BLUR,
      shadowDistance: PLAY_BUTTON_CONFIG.SHADOW_DISTANCE,
      shadowAlpha: 0.6,
    });
    this.addChild(this.glassPanel);
  }

  protected getHoverConfig() {
    return {
      liftAmount: 3,
      scaleAmount: 1.05,
      shadowDistance: PLAY_BUTTON_CONFIG.SHADOW_DISTANCE + 4,
    };
  }

  private createLabel(): void {
    this.buttonLabel = new PIXI.Text({
      text: 'PLAY',
      style: {
        fontSize: 28,
        fill: COLORS.TEXT_GOLD,
        fontWeight: 'bold',
        dropShadow: {
          alpha: 0.5,
          angle: Math.PI / 2,
          blur: 4,
          color: COLORS.GOLD_BRIGHT,
          distance: 0,
        },
      },
    });
    this.buttonLabel.anchor.set(0.5);
    this.buttonLabel.position.set(PLAY_BUTTON_CONFIG.WIDTH / 2, PLAY_BUTTON_CONFIG.HEIGHT / 2);
    this.addChild(this.buttonLabel);
  }

  protected onEnable(): void {
    this.buttonLabel.style.fill = COLORS.TEXT_GOLD;
  }

  protected onDisable(): void {
    this.alpha = 0.5;
    this.buttonLabel.style.fill = COLORS.TEXT_DISABLED;
  }
}
