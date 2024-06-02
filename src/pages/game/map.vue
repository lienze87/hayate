<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import { Application, Assets, Container, Sprite } from 'pixi.js';
import { onMounted } from 'vue';

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ background: '#ffffff', resizeTo: body });

  body.appendChild(app.canvas);

  const container = new Container();

  app.stage.addChild(container);

  const texture = await Assets.load('/vite.svg');
  console.log('texture ', texture.width, texture.height);

  const icon = new Sprite(texture);
  app.stage.addChild(icon);

  icon.anchor.set(0.5);
  icon.x = app.screen.width / 2;
  icon.y = app.screen.height / 2;

  app.ticker.add((time) => {
    icon.rotation += 0.1 * time.deltaTime;
  });

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
  }
  window.addEventListener('keydown', handleKeyDown);
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
