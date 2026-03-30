import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../utils/constants';
import { TextureCache } from '../utils/TextureCache';

export class BackgroundLayer extends PIXI.Container {
  private gradientLayer!: PIXI.Graphics;
  private particleContainer?: PIXI.Container;
  private particles: PIXI.Graphics[] = [];
  private animationTicker?: (delta: PIXI.Ticker) => void;

  constructor() {
    super();
    this.createGradientBackground();
    this.createVignette();
    this.createSubtleParticles();
    this.startIdleAnimation();
  }

  private createGradientBackground(): void {
    this.gradientLayer = new PIXI.Graphics();

    const gradient = this.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      Math.max(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.6
    );

    this.gradientLayer.rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.gradientLayer.fill(gradient);
    this.addChild(this.gradientLayer);
  }

  private createRadialGradient(centerX: number, centerY: number, radius: number): PIXI.Texture {
    const cacheKey = `radial-gradient-${centerX}-${centerY}-${radius}`;

    return TextureCache.get(cacheKey, () => {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, '#2d1b4e');
      gradient.addColorStop(0.5, '#1a0033');
      gradient.addColorStop(1, '#000000');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      return PIXI.Texture.from(canvas);
    });
  }

  private createVignette(): void {
    const vignetteTexture = this.createVignetteTexture();
    const sprite = new PIXI.Sprite(vignetteTexture);
    sprite.width = CANVAS_WIDTH;
    sprite.height = CANVAS_HEIGHT;
    this.addChild(sprite);
  }

  private createVignetteTexture(): PIXI.Texture {
    const cacheKey = 'vignette';

    return TextureCache.get(cacheKey, () => {
      const canvas = document.createElement('canvas');
      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        CANVAS_HEIGHT * 0.2,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2,
        CANVAS_HEIGHT * 0.8
      );

      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      return PIXI.Texture.from(canvas);
    });
  }

  private createSubtleParticles(): void {
    this.particleContainer = new PIXI.Container();

    for (let i = 0; i < 8; i++) {
      const particle = new PIXI.Graphics();
      particle.circle(0, 0, Math.random() * 1.5 + 0.5);
      particle.fill({ color: COLORS.NEON_PURPLE, alpha: Math.random() * 0.3 + 0.1 });

      particle.x = Math.random() * CANVAS_WIDTH;
      particle.y = Math.random() * CANVAS_HEIGHT;

      this.particles.push(particle);
      this.particleContainer.addChild(particle);
    }

    this.addChild(this.particleContainer);
  }

  private startIdleAnimation(): void {
    this.animationTicker = () => {
      const time = Date.now() * 0.0005;

      this.particles.forEach((particle, index) => {
        particle.x += Math.sin(time + index) * 0.1;
        particle.y += Math.cos(time + index * 0.5) * 0.1;

        if (particle.x < -20) particle.x = CANVAS_WIDTH + 20;
        if (particle.x > CANVAS_WIDTH + 20) particle.x = -20;
        if (particle.y < -20) particle.y = CANVAS_HEIGHT + 20;
        if (particle.y > CANVAS_HEIGHT + 20) particle.y = -20;
      });
    };

    PIXI.Ticker.shared.add(this.animationTicker);
  }

  destroy(): void {
    if (this.animationTicker) {
      PIXI.Ticker.shared.remove(this.animationTicker);
      this.animationTicker = undefined;
    }
    super.destroy();
  }
}
