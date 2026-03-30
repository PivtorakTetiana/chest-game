import * as PIXI from 'pixi.js';
import { COLORS, CHEST_CONFIG, ANIMATION_CONFIG } from '../utils/constants';
import { GlassPanel } from '../effects/GlassPanel';
import { Tween } from '../utils/Tweening';

export class Chest extends PIXI.Container {
  public readonly id: number;
  private glassPanel!: GlassPanel;
  private chestLabel: PIXI.Text;
  private resultText: PIXI.Text | null = null;
  private _isOpened: boolean = false;
  private _enabled: boolean = false;
  private baseY: number;
  private hoverTicker?: (delta: PIXI.Ticker) => void;

  constructor(id: number, x: number, y: number) {
    super();
    this.id = id;
    this.position.set(x, y);
    this.baseY = y;
    this.chestLabel = new PIXI.Text();
    this.createGlassCard();
    this.createLabel();
    this.setupInteractivity();
  }

  private createGlassCard(): void {
    this.glassPanel = new GlassPanel({
      width: CHEST_CONFIG.WIDTH,
      height: CHEST_CONFIG.HEIGHT,
      borderRadius: CHEST_CONFIG.BORDER_RADIUS,
      borderWidth: CHEST_CONFIG.BORDER_WIDTH,
      borderColor: COLORS.CHEST_BORDER,
      shadowBlur: CHEST_CONFIG.SHADOW_BLUR,
      shadowDistance: CHEST_CONFIG.SHADOW_DISTANCE,
      shadowAlpha: CHEST_CONFIG.SHADOW_ALPHA,
    });
    this.addChild(this.glassPanel);
  }

  private createLabel(): void {
    this.chestLabel = new PIXI.Text({
      text: 'Chest',
      style: {
        fontSize: 20,
        fill: COLORS.TEXT_PURPLE,
        fontWeight: '500',
      },
    });
    this.chestLabel.anchor.set(0.5);
    this.chestLabel.position.set(CHEST_CONFIG.WIDTH / 2, CHEST_CONFIG.HEIGHT / 2);
    this.addChild(this.chestLabel);
  }

  private setupInteractivity(): void {
    this.eventMode = 'none';

    this.on('pointerover', () => {
      if (this._enabled && !this._isOpened) {
        this.playHoverAnimation(true);
      }
    });

    this.on('pointerout', () => {
      if (this._enabled && !this._isOpened) {
        this.playHoverAnimation(false);
      }
    });
  }

  private playHoverAnimation(isHovering: boolean): void {
    if (this.hoverTicker) {
      PIXI.Ticker.shared.remove(this.hoverTicker);
    }

    const targetY = isHovering ? this.y - CHEST_CONFIG.HOVER_LIFT : this.baseY;
    const targetScale = isHovering ? 1.02 : 1;
    const targetBorderAlpha = isHovering ? 1.5 : 1;
    const targetShadowDistance = isHovering 
      ? CHEST_CONFIG.SHADOW_DISTANCE + 4 
      : CHEST_CONFIG.SHADOW_DISTANCE;

    void Tween.to(this, 250, { y: targetY }, Tween.easeOutCubic);
    void Tween.to(this.scale, 250, { x: targetScale, y: targetScale }, Tween.easeOutCubic);
    
    this.glassPanel.updateBorderGlow(targetBorderAlpha);
    this.glassPanel.updateShadowDistance(targetShadowDistance);
    
    if (isHovering) {
      this.startSubtleTilt();
    } else {
      this.skew.set(0, 0);
    }
  }

  private startSubtleTilt(): void {
    const tiltAmount = ANIMATION_CONFIG.HOVER_TILT_AMOUNT;
    let time = 0;

    this.hoverTicker = (delta: PIXI.Ticker) => {
      time += delta.deltaMS * 0.001;
      this.skew.x = Math.sin(time * 2) * tiltAmount;
      this.skew.y = Math.cos(time * 2) * tiltAmount * 0.5;
    };

    PIXI.Ticker.shared.add(this.hoverTicker);
  }

  enable(): void {
    if (!this._isOpened) {
      this._enabled = true;
      this.eventMode = 'static';
      this.cursor = 'pointer';
      this.chestLabel.style.fill = COLORS.TEXT_CHEST_ACTIVE;
    }
  }

  disable(): void {
    this._enabled = false;
    this.eventMode = 'none';
    this.cursor = 'default';
    if (!this._isOpened) {
      this.chestLabel.style.fill = COLORS.TEXT_DISABLED;
    }
    if (this.hoverTicker) {
      PIXI.Ticker.shared.remove(this.hoverTicker);
      this.hoverTicker = undefined;
    }
    this.skew.set(0, 0);
  }

  setLoseState(): void {
    this._isOpened = true;
    this.glassPanel.setGlassColor(COLORS.LOSE, 0.5);
    this.chestLabel.text = 'LOSE';
    this.chestLabel.style.fill = 0xffffff;
  }

  setWinState(amount: number): void {
    this._isOpened = true;
    this.glassPanel.setGlassColor(COLORS.WIN_GLOW, 0.7);
    this.glassPanel.setBorderColor(COLORS.WIN_GLOW);
    this.chestLabel.text = `WIN\n$${amount}`;
    this.chestLabel.style.fill = 0xffffff;
    this.chestLabel.style.fontSize = 18;
    this.chestLabel.style.align = 'center';
  }

  setBonusState(): void {
    this._isOpened = true;
    this.glassPanel.setGlassColor(COLORS.BONUS_GLOW, 0.8);
    this.glassPanel.setBorderColor(COLORS.GOLD);
    this.chestLabel.text = 'BONUS!';
    this.chestLabel.style.fill = 0xffffff;
    this.chestLabel.style.fontWeight = 'bold';
  }

  reset(): void {
    this._isOpened = false;
    this._enabled = false;
    this.alpha = 1;
    this.scale.set(1);
    this.y = this.baseY;
    this.skew.set(0, 0);
    this.eventMode = 'none';
    this.cursor = 'default';

    if (this.hoverTicker) {
      PIXI.Ticker.shared.remove(this.hoverTicker);
      this.hoverTicker = undefined;
    }

    this.removeChild(this.glassPanel);
    this.createGlassCard();

    this.chestLabel.text = 'Chest';
    this.chestLabel.style.fill = COLORS.TEXT_PURPLE;
    this.chestLabel.style.fontSize = 20;
    this.chestLabel.style.fontWeight = '500';
    this.chestLabel.style.align = 'left';

    if (this.resultText) {
      this.removeChild(this.resultText);
      this.resultText = null;
    }
  }

  get isOpened(): boolean {
    return this._isOpened;
  }

  get enabled(): boolean {
    return this._enabled;
  }
}
