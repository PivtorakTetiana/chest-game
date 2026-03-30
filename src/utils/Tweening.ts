import * as PIXI from 'pixi.js';

type EasingFunction = (t: number) => number;

type TweenableProperties = {
  x?: number;
  y?: number;
  alpha?: number;
  rotation?: number;
  [key: string]: number | undefined;
};

interface ActiveTween {
  target: object;
  ticker: (delta: PIXI.Ticker) => void;
  properties: Set<string>;
}

export class Tween {
  private static activeTweens: ActiveTween[] = [];
  static easeInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  static linear(t: number): number {
    return t;
  }

  static easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  static easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  static easeInOutQuint(t: number): number {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
  }

  static to(
    target: PIXI.Container | PIXI.ObservablePoint | TweenableProperties,
    duration: number,
    properties: TweenableProperties,
    easing: EasingFunction = Tween.easeInOut
  ): Promise<void> {
    return new Promise(resolve => {
      const startValues: Record<string, number> = {};
      const changes: Record<string, number> = {};

      Object.keys(properties).forEach(key => {
        const value = (target as Record<string, unknown>)[key];
        if (typeof value === 'number') {
          startValues[key] = value;
          const targetValue = properties[key];
          if (targetValue !== undefined) {
            changes[key] = targetValue - startValues[key];
          }
        }
      });

      let elapsed = 0;
      const ticker = (delta: PIXI.Ticker) => {
        elapsed += delta.deltaMS;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easing(progress);

        Object.keys(properties).forEach(key => {
          if (changes[key] !== undefined) {
            (target as Record<string, number>)[key] =
              startValues[key] + changes[key] * easedProgress;
          }
        });

        if (progress >= 1) {
          PIXI.Ticker.shared.remove(ticker);
          Tween.removeActiveTween(target, ticker);
          resolve();
        }
      };

      PIXI.Ticker.shared.add(ticker);
      Tween.activeTweens.push({
        target,
        ticker,
        properties: new Set(Object.keys(properties)),
      });
    });
  }

  static wait(duration: number): Promise<void> {
    return new Promise(resolve => {
      let elapsed = 0;
      const ticker = (delta: PIXI.Ticker) => {
        elapsed += delta.deltaMS;
        if (elapsed >= duration) {
          PIXI.Ticker.shared.remove(ticker);
          resolve();
        }
      };
      PIXI.Ticker.shared.add(ticker);
    });
  }

  static cancel(target: object, property?: string): void {
    const tweensToCancel = Tween.activeTweens.filter(tween => {
      if (tween.target !== target) return false;
      if (property && !tween.properties.has(property)) return false;
      return true;
    });

    tweensToCancel.forEach(tween => {
      PIXI.Ticker.shared.remove(tween.ticker);
    });

    Tween.activeTweens = Tween.activeTweens.filter(tween => {
      return !tweensToCancel.includes(tween);
    });
  }

  static cancelAll(): void {
    Tween.activeTweens.forEach(tween => {
      PIXI.Ticker.shared.remove(tween.ticker);
    });
    Tween.activeTweens = [];
  }

  private static removeActiveTween(target: object, ticker: (delta: PIXI.Ticker) => void): void {
    Tween.activeTweens = Tween.activeTweens.filter(
      tween => tween.target !== target || tween.ticker !== ticker
    );
  }
}
