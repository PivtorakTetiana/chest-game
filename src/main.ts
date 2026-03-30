import * as PIXI from 'pixi.js';
import { CANVAS_WIDTH, CANVAS_HEIGHT, COLORS } from './utils/constants';
import { Game } from './Game';
import { LoadingScene } from './scenes/LoadingScene';
import { Tween } from './utils/Tweening';

let loadingScene: LoadingScene | null = null;

function init(): void {
  initAsync().catch(error => {
    console.error('Failed to initialize game:', error);
    showError('Failed to load game. Please refresh the page.');
  });
}

async function initAsync(): Promise<void> {
  const app = new PIXI.Application();

  await app.init({
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: COLORS.BACKGROUND,
    antialias: true,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
  });

  const appElement = document.getElementById('app');
  if (!appElement) {
    throw new Error('App element not found in DOM');
  }

  appElement.appendChild(app.canvas);

  loadingScene = new LoadingScene();
  app.stage.addChild(loadingScene);

  setupResponsiveCanvas(app.canvas);

  await Tween.wait(500);

  new Game(app);

  if (loadingScene) {
    await Tween.to(loadingScene, 400, { alpha: 0 }, Tween.easeOutCubic);
    app.stage.removeChild(loadingScene);
    loadingScene.destroy();
    loadingScene = null;
  }
}

function setupResponsiveCanvas(canvas: HTMLCanvasElement): void {
  function handleResize() {
    const scaleX = window.innerWidth / CANVAS_WIDTH;
    const scaleY = window.innerHeight / CANVAS_HEIGHT;
    const scale = Math.min(scaleX, scaleY, 1);

    canvas.style.width = `${CANVAS_WIDTH * scale}px`;
    canvas.style.height = `${CANVAS_HEIGHT * scale}px`;
  }

  handleResize();
  window.addEventListener('resize', handleResize);
}

function showError(message: string): void {
  const appElement = document.getElementById('app');
  if (appElement) {
    appElement.innerHTML = `
      <div style="
        color: #fff;
        background: rgba(139, 92, 246, 0.1);
        border: 2px solid #8b5cf6;
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        text-align: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <h2 style="margin: 0 0 12px 0; color: #8b5cf6;">Error</h2>
        <p style="margin: 0;">${message}</p>
      </div>
    `;
  }
}

init();
