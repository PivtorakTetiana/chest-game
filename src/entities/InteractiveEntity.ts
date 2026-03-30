import * as PIXI from 'pixi.js';
import { GlassPanel } from '../effects/GlassPanel';
import { Tween } from '../utils/Tweening';

export abstract class InteractiveEntity extends PIXI.Container {
  protected glassPanel!: GlassPanel;
  protected _enabled: boolean = false;
  protected baseY: number;

  constructor(x: number, y: number) {
    super();
    this.position.set(x, y);
    this.baseY = y;
  }

  protected abstract createGlassPanel(): void;
  protected abstract getHoverConfig(): {
    liftAmount: number;
    scaleAmount: number;
    shadowDistance: number;
  };

  protected setupInteractivity(): void {
    this.eventMode = 'none';
    this.cursor = 'default';

    this.on('pointerover', () => {
      if (this._enabled) {
        this.playHoverAnimation(true);
      }
    });

    this.on('pointerout', () => {
      if (this._enabled) {
        this.playHoverAnimation(false);
      }
    });
  }

  protected playHoverAnimation(isHovering: boolean): void {
    const config = this.getHoverConfig();
    
    const targetY = isHovering ? this.y - config.liftAmount : this.baseY;
    const targetScale = isHovering ? config.scaleAmount : 1;
    const targetBorderAlpha = isHovering ? 1.5 : 1;

    void Tween.to(this, 250, { y: targetY }, Tween.easeOutCubic);
    void Tween.to(this.scale, 250, { x: targetScale, y: targetScale }, Tween.easeOutCubic);
    
    this.glassPanel.updateBorderGlow(targetBorderAlpha);
    this.glassPanel.updateShadowDistance(config.shadowDistance);
  }

  enable(): void {
    this._enabled = true;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.alpha = 1;
    this.onEnable();
  }

  disable(): void {
    this._enabled = false;
    this.eventMode = 'none';
    this.cursor = 'default';
    this.onDisable();
  }

  protected onEnable(): void {}
  protected onDisable(): void {}

  get enabled(): boolean {
    return this._enabled;
  }
}
