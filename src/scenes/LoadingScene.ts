import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../utils/constants';
import { GlassPanel } from '../effects/GlassPanel';

export class LoadingScene extends PIXI.Container {
  private spinner!: PIXI.Graphics;
  private loadingText!: PIXI.Text;
  private panel!: GlassPanel;
  private rotationSpeed: number = 0.05;
  private animationTicker?: (delta: PIXI.Ticker) => void;

  constructor() {
    super();
    this.createPanel();
    this.createSpinner();
    this.createLoadingText();
    this.startAnimation();
  }

  private createPanel(): void {
    this.panel = new GlassPanel({
      width: 300,
      height: 150,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: COLORS.NEON_PURPLE_BRIGHT,
      glassColor: 0x1a0033,
      glassAlpha: 0.9,
      shadowBlur: 24,
      shadowDistance: 12,
      shadowAlpha: 0.7,
    });
    this.panel.position.set((CANVAS_WIDTH - 300) / 2, (CANVAS_HEIGHT - 150) / 2);
    this.addChild(this.panel);
  }

  private createSpinner(): void {
    this.spinner = new PIXI.Graphics();

    this.spinner.moveTo(30, 0);
    this.spinner.arc(0, 0, 30, 0, Math.PI * 1.5);
    this.spinner.stroke({
      width: 4,
      color: COLORS.NEON_PURPLE_BRIGHT,
      cap: 'round',
    });

    this.spinner.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    this.addChild(this.spinner);
  }

  private createLoadingText(): void {
    this.loadingText = new PIXI.Text({
      text: 'Loading...',
      style: {
        fontSize: 24,
        fill: COLORS.TEXT_PURPLE,
        fontWeight: '600',
        dropShadow: {
          alpha: 0.6,
          angle: Math.PI / 2,
          blur: 8,
          color: COLORS.NEON_PURPLE,
          distance: 0,
        },
      },
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.position.set(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    this.addChild(this.loadingText);
  }

  private startAnimation(): void {
    this.animationTicker = () => {
      this.spinner.rotation += this.rotationSpeed;
    };

    PIXI.Ticker.shared.add(this.animationTicker);
  }

  destroy(): void {
    if (this.animationTicker) {
      PIXI.Ticker.shared.remove(this.animationTicker);
      this.animationTicker = undefined;
    }
    super.destroy({ children: true });
  }
}
