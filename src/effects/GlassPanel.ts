import * as PIXI from 'pixi.js';
import { COLORS } from '../utils/constants';

export interface GlassPanelOptions {
  width: number;
  height: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: number;
  glassAlpha?: number;
  glassColor?: number;
  shadowBlur?: number;
  shadowDistance?: number;
  shadowAlpha?: number;
  innerGlow?: boolean;
}

export class GlassPanel extends PIXI.Container {
  private shadow!: PIXI.Graphics;
  private glassBackground!: PIXI.Graphics;
  private innerGlowGraphics?: PIXI.Graphics;
  private border!: PIXI.Graphics;
  private options: Required<GlassPanelOptions>;

  constructor(options: GlassPanelOptions) {
    super();

    this.options = {
      borderRadius: options.borderRadius ?? 12,
      borderWidth: options.borderWidth ?? 1.5,
      borderColor: options.borderColor ?? COLORS.NEON_PURPLE,
      glassAlpha: options.glassAlpha ?? 0.6,
      glassColor: options.glassColor ?? 0x14280a,
      shadowBlur: options.shadowBlur ?? 12,
      shadowDistance: options.shadowDistance ?? 6,
      shadowAlpha: options.shadowAlpha ?? 0.5,
      innerGlow: options.innerGlow ?? true,
      width: options.width,
      height: options.height,
    };

    this.createShadow();
    this.createGlassBackground();
    if (this.options.innerGlow) {
      this.createInnerGlow();
    }
    this.createBorder();
  }

  private createShadow(): void {
    this.shadow = new PIXI.Graphics();
    this.shadow.roundRect(
      this.options.shadowDistance,
      this.options.shadowDistance,
      this.options.width,
      this.options.height,
      this.options.borderRadius
    );
    this.shadow.fill({ color: 0x000000, alpha: this.options.shadowAlpha });
    this.shadow.filters = [new PIXI.BlurFilter({ strength: this.options.shadowBlur })];
    this.addChild(this.shadow);
  }

  private createGlassBackground(): void {
    this.glassBackground = new PIXI.Graphics();
    this.glassBackground.roundRect(
      0,
      0,
      this.options.width,
      this.options.height,
      this.options.borderRadius
    );
    this.glassBackground.fill({
      color: this.options.glassColor,
      alpha: this.options.glassAlpha,
    });
    this.addChild(this.glassBackground);
  }

  private createInnerGlow(): void {
    this.innerGlowGraphics = new PIXI.Graphics();
    this.innerGlowGraphics.roundRect(
      2,
      2,
      this.options.width - 4,
      this.options.height - 4,
      this.options.borderRadius - 2
    );
    this.innerGlowGraphics.stroke({
      width: 1,
      color: this.options.borderColor,
      alpha: 0.3,
    });
    this.addChild(this.innerGlowGraphics);
  }

  private createBorder(): void {
    this.border = new PIXI.Graphics();
    this.border.roundRect(0, 0, this.options.width, this.options.height, this.options.borderRadius);
    this.border.stroke({
      width: this.options.borderWidth,
      color: this.options.borderColor,
    });
    this.addChild(this.border);
  }

  updateShadowDistance(distance: number): void {
    this.shadow.x = distance;
    this.shadow.y = distance;
  }

  updateBorderGlow(alpha: number): void {
    this.border.alpha = alpha;
  }

  setGlassColor(color: number, alpha?: number): void {
    this.glassBackground.tint = color;
    if (alpha !== undefined) {
      this.glassBackground.alpha = alpha;
    }
  }

  setBorderColor(color: number): void {
    this.border.clear();
    this.border.roundRect(0, 0, this.options.width, this.options.height, this.options.borderRadius);
    this.border.stroke({
      width: this.options.borderWidth,
      color: color,
    });
  }
}
