import { beforeAll, vi } from 'vitest';

declare const global: typeof globalThis;

beforeAll(() => {
  const mockContext = {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    rect: vi.fn(),
    roundRect: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    createPattern: vi.fn(() => ({
      setTransform: vi.fn(),
    })),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    setTransform: vi.fn(),
    resetTransform: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    })),
    measureText: vi.fn(() => ({ width: 0 })),
    canvas: {},
    direction: 'ltr',
    fillText: vi.fn(),
    strokeText: vi.fn(),
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic',
  };

  (global as any).HTMLCanvasElement.prototype.getContext = vi.fn(type => {
    if (type === '2d') {
      return mockContext as unknown as CanvasRenderingContext2D;
    }
    return mockContext as unknown as RenderingContext;
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;

  (global as any).HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock');

  Object.defineProperty(window, 'devicePixelRatio', {
    writable: true,
    configurable: true,
    value: 1,
  });

  class MockImage {
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    src = '';
    width = 100;
    height = 100;
  }

  (global as any).Image = MockImage as typeof Image;

  (global as any).CanvasRenderingContext2D = function () {} as unknown as typeof CanvasRenderingContext2D;
  Object.assign((global as any).CanvasRenderingContext2D.prototype, mockContext);
});
