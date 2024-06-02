<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Rectangle,
  Sprite,
  Spritesheet,
  Text,
  TextStyle,
  Texture,
  TilingSprite,
} from 'pixi.js';
import { onMounted, ref } from 'vue';

let app: Application = null;

async function initApp() {
  const body = document.querySelector('.main-content') as HTMLElement;
  app = new Application();
  await app.init({ background: '#4f60ad', resizeTo: body });
  body.appendChild(app.canvas);

  const container = new Container();

  app.stage.addChild(container);
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
