<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import type { FederatedPointerEvent } from 'pixi.js';
import { Application, Assets, BlurFilter, Graphics, Point, Rectangle, Sprite, Text, TilingSprite } from 'pixi.js';
import { onMounted, ref } from 'vue';

let app: Application | null = null;
async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ background: '#1099bb', resizeTo: body });
  body.appendChild(app.canvas);
  const bgTexture = await Assets.load('/textures/box.png');

  const tilingSprite = new TilingSprite({
    texture: bgTexture,
    width: app.screen.width,
    height: app.screen.height,
  });

  app.stage.addChild(tilingSprite);
  app.ticker.add(() => {
    tilingSprite.tilePosition.x += direction.x;
    tilingSprite.tilePosition.y += direction.y;
  });

  const direction = new Point(0, 0);
  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {
      case 'ArrowUp':
        direction.x = 0;
        direction.y = -1;
        break;
      case 'ArrowLeft':
        direction.x = -1;
        direction.y = 0;
        break;
      case 'ArrowDown':
        direction.x = 0;
        direction.y = 1;
        break;
      case 'ArrowRight':
        direction.x = 1;
        direction.y = 0;
        break;
      case 'Space':
        direction.x = 0;
        direction.y = 0;
        break;
      default:
        break;
    }
  }
  window.addEventListener('keydown', handleKeyDown);

  const sliderValue = ref(0);
  const sliderWidth = 320;
  const slider = new Graphics().rect(0, 0, sliderWidth, 4).fill({ color: 0x272d37 });

  slider.x = (app.screen.width - sliderWidth) / 2;
  slider.y = app.screen.height * 0.75;

  const handle = new Graphics().circle(0, 0, 8).fill({ color: 0xffffff });
  handle.y = slider.height / 2;
  handle.x = sliderWidth / 2;
  handle.eventMode = 'static';
  handle.cursor = 'pointer';

  handle.on('pointerdown', onDragStart);
  handle.on('pointerup', onDragEnd);
  handle.on('pointerout', onDragEnd);

  app.stage.addChild(slider);
  slider.addChild(handle);

  const basicText = new Text({ text: `Slider value is ${sliderValue.value}` });

  basicText.x = 50;
  basicText.y = 100;

  app.stage.addChild(basicText);

  app.ticker.add(() => {
    basicText.text = `Slider value is ${sliderValue.value}`;
  });

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;

  function onDragStart() {
    app.stage.addEventListener('pointermove', onDrag);
  }

  function onDrag(e: FederatedPointerEvent) {
    handle.x = Math.max(0, Math.min(slider.toLocal(e.global).x, sliderWidth));
    const t = Number((2 * (handle.x / sliderWidth - 0.5)).toFixed(2));
    sliderValue.value = t;
  }

  function onDragEnd() {
    app.stage.removeEventListener('pointermove', onDrag);
  }

  const radius = 100;
  const blurSize = 32;
  const circle = new Graphics().circle(radius + blurSize, radius + blurSize, radius).fill({ color: 0xff0000 });
  circle.filters = [new BlurFilter({ strength: blurSize })];
  const bounds = new Rectangle(0, 0, (radius + blurSize) * 2, (radius + blurSize) * 2);
  const texture = app.renderer.generateTexture({
    target: circle,
    resolution: 1,
    frame: bounds,
  });
  const focus = new Sprite(texture);

  app.stage.addChild(focus);

  tilingSprite.mask = focus;

  app.stage.on('pointermove', (e: FederatedPointerEvent) => {
    focus.position.x = e.global.x - focus.width / 2;
    focus.position.y = e.global.y - focus.height / 2;
  });
}

onMounted(() => {
  initApp();
});
</script>
<style lang="scss" scoped>
.main-content {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
