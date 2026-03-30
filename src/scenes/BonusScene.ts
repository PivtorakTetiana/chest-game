import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../utils/constants';
import { GlassPanel } from '../effects/GlassPanel';
import { ParticleSystem } from '../effects/ParticleSystem';
import { TextureCache } from '../utils/TextureCache';

export class BonusScene extends PIXI.Container {
  private darkOverlay!: PIXI.Graphics;
  private radialGlow!: PIXI.Sprite;
  private textPanel!: GlassPanel;
  private amountPanel!: GlassPanel;
  private animationText!: PIXI.Text;
  private amountText!: PIXI.Text;
  private particleSystem!: ParticleSystem;

  constructor() {
    super();
    this.visible = false;
    this.createDarkOverlay();
    this.createRadialGlow();
    this.createTextPanel();
    this.createAnimationText();
    this.createAmountPanel();
    this.createAmountText();
    this.createParticleSystem();
  }

  private createDarkOverlay(): void {
    this.darkOverlay = new PIXI.Graphics();
    this.darkOverlay.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.darkOverlay.fill({ color: 0x000000, alpha: 0.8 });
    this.addChild(this.darkOverlay);
  }

  private createRadialGlow(): void {
    const cacheKey = 'bonus-radial-glow';

    const texture = TextureCache.get(cacheKey, () => {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        0,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        CANVAS_HEIGHT * 0.5
      );

      gradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
      gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      return PIXI.Texture.from(canvas);
    });

    this.radialGlow = new PIXI.Sprite(texture);
    this.addChild(this.radialGlow);
  }

  private createTextPanel(): void {
    this.textPanel = new GlassPanel({
      width: 560,
      height: 80,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: COLORS.NEON_PURPLE_BRIGHT,
      glassColor: 0x1a0033,
      glassAlpha: 0.8,
      shadowBlur: 20,
      shadowDistance: 10,
      shadowAlpha: 0.7,
    });
    this.textPanel.position.set(120, 180);
    this.addChild(this.textPanel);
  }

  private createAnimationText(): void {
    this.animationText = new PIXI.Text({
      text: 'BONUS WIN!',
      style: {
        fontSize: 36,
        fill: COLORS.NEON_PURPLE_BRIGHT,
        fontWeight: 'bold',
        dropShadow: {
          alpha: 0.8,
          angle: Math.PI / 2,
          blur: 12,
          color: COLORS.NEON_PURPLE_BRIGHT,
          distance: 0,
        },
      },
    });
    this.animationText.anchor.set(0.5);
    this.animationText.position.set(CANVAS_WIDTH / 2, 220);
    this.addChild(this.animationText);
  }

  private createAmountPanel(): void {
    this.amountPanel = new GlassPanel({
      width: 400,
      height: 100,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: COLORS.GOLD,
      glassColor: 0x2d1b00,
      glassAlpha: 0.7,
      shadowBlur: 24,
      shadowDistance: 12,
      shadowAlpha: 0.8,
    });
    this.amountPanel.position.set(200, 300);
    this.addChild(this.amountPanel);
  }

  private createAmountText(): void {
    this.amountText = new PIXI.Text({
      text: '$0',
      style: {
        fontSize: 48,
        fill: COLORS.TEXT_GOLD,
        fontWeight: 'bold',
        dropShadow: {
          alpha: 0.9,
          angle: Math.PI / 2,
          blur: 16,
          color: COLORS.GOLD_BRIGHT,
          distance: 0,
        },
      },
    });
    this.amountText.anchor.set(0.5);
    this.amountText.position.set(CANVAS_WIDTH / 2, 350);
    this.addChild(this.amountText);
  }

  private createParticleSystem(): void {
    this.particleSystem = new ParticleSystem();
    this.addChild(this.particleSystem);
  }

  getAnimationText(): PIXI.Text {
    return this.animationText;
  }

  getAmountText(): PIXI.Text {
    return this.amountText;
  }

  getRadialGlow(): PIXI.Sprite {
    return this.radialGlow;
  }

  getParticleSystem(): ParticleSystem {
    return this.particleSystem;
  }

  getTextPanel(): GlassPanel {
    return this.textPanel;
  }

  getAmountPanel(): GlassPanel {
    return this.amountPanel;
  }

  setWinAmount(amount: number): void {
    this.amountText.text = `$${amount}`;
  }

  reset(): void {
    this.alpha = 1;
    this.amountText.text = '$0';
    this.animationText.scale.set(1);
    this.amountText.scale.set(1);
    this.textPanel.scale.set(1);
    this.amountPanel.scale.set(1);
    this.radialGlow.alpha = 0;
    this.particleSystem.clear();
  }
}
