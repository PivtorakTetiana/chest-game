import * as PIXI from 'pixi.js';

export class TextureCache {
  private static cache = new Map<string, PIXI.Texture>();

  static get(key: string, generator: () => PIXI.Texture): PIXI.Texture {
    if (!this.cache.has(key)) {
      const texture = generator();
      this.cache.set(key, texture);
    }
    return this.cache.get(key)!;
  }

  static clear(): void {
    this.cache.forEach(texture => {
      texture.destroy(true);
    });
    this.cache.clear();
  }

  static remove(key: string): void {
    const texture = this.cache.get(key);
    if (texture) {
      texture.destroy(true);
      this.cache.delete(key);
    }
  }

  static has(key: string): boolean {
    return this.cache.has(key);
  }
}
