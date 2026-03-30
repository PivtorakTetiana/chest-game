import { describe, it, expect } from 'vitest';
import { TextureCache } from '../../../src/utils/TextureCache';
import * as PIXI from 'pixi.js';

describe('TextureCache', () => {
  describe('get', () => {
    it('should create and cache texture on first call', () => {
      const generator = () => PIXI.Texture.WHITE;
      const texture = TextureCache.get('test-key', generator);

      expect(texture).toBeDefined();
      expect(TextureCache.has('test-key')).toBe(true);
    });

    it('should return cached texture on subsequent calls', () => {
      let callCount = 0;
      const generator = () => {
        callCount++;
        return PIXI.Texture.WHITE;
      };

      const texture1 = TextureCache.get('test-key-2', generator);
      const texture2 = TextureCache.get('test-key-2', generator);

      expect(texture1).toBe(texture2);
      expect(callCount).toBe(1);
    });
  });

  describe('has', () => {
    it('should return false for non-existent key', () => {
      expect(TextureCache.has('non-existent')).toBe(false);
    });

    it('should return true for existing key', () => {
      TextureCache.get('exists', () => PIXI.Texture.WHITE);
      expect(TextureCache.has('exists')).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove texture from cache', () => {
      TextureCache.get('remove-me', () => PIXI.Texture.WHITE);
      expect(TextureCache.has('remove-me')).toBe(true);

      TextureCache.remove('remove-me');
      expect(TextureCache.has('remove-me')).toBe(false);
    });

    it('should handle removing non-existent key', () => {
      expect(() => TextureCache.remove('does-not-exist')).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should remove all textures from cache', () => {
      TextureCache.get('key1', () => PIXI.Texture.WHITE);
      TextureCache.get('key2', () => PIXI.Texture.WHITE);

      TextureCache.clear();

      expect(TextureCache.has('key1')).toBe(false);
      expect(TextureCache.has('key2')).toBe(false);
    });
  });
});
