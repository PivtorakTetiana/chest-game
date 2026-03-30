import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from '../utils/constants';

export interface Particle {
  graphics: PIXI.Graphics;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export class ParticleSystem extends PIXI.Container {
  private particles: Particle[] = [];
  private isActive: boolean = false;
  private tickerFunction?: (delta: PIXI.Ticker) => void;

  constructor() {
    super();
  }

  createExplosion(centerX: number, centerY: number, count: number = 30): void {
    this.clear();

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.2;
      const speed = Math.random() * 3 + 2;

      const particle = new PIXI.Graphics();
      const size = Math.random() * 3 + 1;
      particle.circle(0, 0, size);

      const isGold = Math.random() > 0.5;
      particle.fill({
        color: isGold ? COLORS.GOLD : COLORS.NEON_PURPLE_BRIGHT,
        alpha: 0.8,
      });

      particle.x = centerX;
      particle.y = centerY;

      this.addChild(particle);

      this.particles.push({
        graphics: particle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1000,
        maxLife: 1000,
      });
    }

    this.startAnimation();
  }

  createFloatingParticles(count: number = 20): void {
    this.clear();

    for (let i = 0; i < count; i++) {
      const particle = new PIXI.Graphics();
      const size = Math.random() * 2 + 0.5;
      particle.circle(0, 0, size);
      particle.fill({ color: COLORS.GOLD, alpha: Math.random() * 0.4 + 0.2 });

      particle.x = Math.random() * CANVAS_WIDTH;
      particle.y = Math.random() * CANVAS_HEIGHT;

      this.addChild(particle);

      this.particles.push({
        graphics: particle,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 0.5 - 0.2,
        life: Infinity,
        maxLife: Infinity,
      });
    }

    this.startAnimation();
  }

  private startAnimation(): void {
    if (this.isActive) return;
    this.isActive = true;

    this.tickerFunction = (delta: PIXI.Ticker) => {
      this.particles = this.particles.filter(p => {
        if (p.life !== Infinity) {
          p.life -= delta.deltaMS;
          if (p.life <= 0) {
            this.removeChild(p.graphics);
            return false;
          }
          p.graphics.alpha = (p.life / p.maxLife) * 0.8;
        }

        p.graphics.x += p.vx;
        p.graphics.y += p.vy;

        if (p.life === Infinity) {
          if (p.graphics.y < -10) {
            p.graphics.y = CANVAS_HEIGHT + 10;
            p.graphics.x = Math.random() * CANVAS_WIDTH;
          }
        }

        return true;
      });

      if (this.particles.length === 0) {
        this.stopAnimation();
      }
    };

    PIXI.Ticker.shared.add(this.tickerFunction);
  }

  private stopAnimation(): void {
    if (this.tickerFunction) {
      PIXI.Ticker.shared.remove(this.tickerFunction);
      this.tickerFunction = undefined;
    }
    this.isActive = false;
  }

  clear(): void {
    this.particles.forEach(p => this.removeChild(p.graphics));
    this.particles = [];
    this.stopAnimation();
  }

  destroy(): void {
    this.clear();
    super.destroy();
  }
}
