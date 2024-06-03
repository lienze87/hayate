<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import type { FederatedPointerEvent } from 'pixi.js';
import { Application, Assets, Container, Graphics, Rectangle, Sprite, Text } from 'pixi.js';
import { onMounted } from 'vue';

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ backgroundAlpha: 0, resizeTo: body });

  body.appendChild(app.canvas);

  const container = new Container();

  app.stage.addChild(container);

  const rectPadding = 500;
  const rect = new Graphics({
    x: app.screen.width / 2 - rectPadding / 2,
    y: app.screen.height / 2 - rectPadding / 2,
  })
    .rect(0, 0, rectPadding, rectPadding)
    .stroke({ color: 'rgb(0,255,0)', width: 10, alignment: 0 });
  app.stage.addChild(rect);
  rect.eventMode = 'static';
  rect.cursor = 'pointer';
  rect.on('pointerover', onMouseOver);
  rect.on('pointerout', onMouseOut);

  let hoverTarget: Container | null = null;

  function onMouseOver(event: FederatedPointerEvent) {
    hoverTarget = event.target;
    hoverTarget.tint = Math.random() * 0xff0000;
  }

  function onMouseOut() {
    if (hoverTarget) {
      hoverTarget.tint = undefined;
      hoverTarget = null;
    }
  }

  const texture = await Assets.load('/vite.svg');
  console.log('texture ', texture.width, texture.height);

  const icon = new Sprite(texture);
  app.stage.addChild(icon);

  icon.anchor.set(0.5);
  icon.x = app.screen.width / 2;
  icon.y = app.screen.height / 2;
  icon.eventMode = 'static';
  icon.cursor = 'pointer';
  icon.on('pointerdown', onDragStart);

  // W,A,S,D控制方向
  let offset = { x: 1, y: 0 };

  app.ticker.add(() => {
    icon.x += offset.x;
    icon.y += offset.y;
    if (icon.x < rect.x) {
      offset = { x: 1, y: 0 };
    } else if (icon.x > rect.x + rect.width) {
      offset = { x: -1, y: 0 };
    }
    if (icon.y < rect.y) {
      offset = { x: 0, y: 1 };
    } else if (icon.y > rect.y + rect.height) {
      offset = { x: 0, y: -1 };
    }
  });

  const basicText = new Text({
    text: 'W A S D控制方向',
    style: {
      fill: 0xff0000,
    },
  });

  basicText.x = rect.x;
  basicText.y = rect.y - 50;

  app.stage.addChild(basicText);

  let dragTarget: Container | null = null;

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  function onDragStart(event: FederatedPointerEvent) {
    dragTarget = event.target;
    dragTarget.alpha = 0.5;
    app.stage.on('pointermove', onDragMove);
  }

  function onDragMove(event: FederatedPointerEvent) {
    if (dragTarget) {
      dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
  }

  function onDragEnd() {
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
    }
  }

  const bug = await Assets.load('/textures/maggot_tiny.png');
  const dudeSprites = new Container();
  app.stage.addChild(dudeSprites);

  const dude = new Sprite(bug);
  dude.anchor.set(0.5);
  dude.scale.set(0.8 + Math.random() * 0.3);

  dude.x = Math.random() * app.screen.width;
  dude.y = Math.random() * app.screen.height;

  // 上色
  dude.tint = Math.random() * 0x808080;

  dude.direction = Math.random() * Math.PI * 2;
  dude.turningSpeed = Math.random() - 0.8;
  dude.speed = (2 + Math.random() * 2) * 0.2;
  dude.offset = Math.random() * 100;
  dudeSprites.addChild(dude);

  const dudeBoundsPadding = 100;
  const dudeBounds = new Rectangle(
    -dudeBoundsPadding,
    -dudeBoundsPadding,
    app.screen.width + dudeBoundsPadding * 2,
    app.screen.height + dudeBoundsPadding * 2,
  );

  let tick = 0;

  app.ticker.add(() => {
    dude.scale.y = 0.95 + Math.sin(tick + dude.offset) * 0.05;
    dude.direction += dude.turningSpeed * 0.01;
    dude.x += Math.sin(dude.direction) * (dude.speed * dude.scale.y);
    dude.y += Math.cos(dude.direction) * (dude.speed * dude.scale.y);
    dude.rotation = -dude.direction + Math.PI;

    if (dude.x < dudeBounds.x) {
      dude.x += dudeBounds.width;
      dude.tint = Math.random() * 0x808080;
    } else if (dude.x > dudeBounds.x + dudeBounds.width) {
      dude.x -= dudeBounds.width;
      dude.tint = Math.random() * 0x808080;
    }
    if (dude.y < dudeBounds.y) {
      dude.y += dudeBounds.height;
      dude.tint = Math.random() * 0x808080;
    } else if (dude.y > dudeBounds.y + dudeBounds.height) {
      dude.y -= dudeBounds.height;
      dude.tint = Math.random() * 0x808080;
    }
    tick += 0.1;
  });

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {
      case 'KeyW':
        offset = { x: 0, y: -1 };
        break;
      case 'KeyA':
        offset = { x: -1, y: 0 };
        break;
      case 'KeyS':
        offset = { x: 0, y: 1 };
        break;
      case 'KeyD':
        offset = { x: 1, y: 0 };
        break;
      case 'Space':
        offset = { x: 0, y: 0 };
        break;
      default:
        break;
    }
    console.log(offset);
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
  background-image: repeating-linear-gradient(-90deg, transparent 0 50px, rgb(82, 82, 82) 50px 52px),
    repeating-linear-gradient(0deg, transparent, transparent 0 50px, rgb(82, 82, 82) 50px 52px);
}
</style>
