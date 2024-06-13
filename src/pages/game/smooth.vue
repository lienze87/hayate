<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import type { FederatedPointerEvent } from 'pixi.js';
import { Application, Assets, Container, Graphics, Point, TilingSprite } from 'pixi.js';
import { onMounted } from 'vue';

import Ease from '@/utils/ease.ts';

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

  const elasticLine = new Graphics();
  elasticLine.x = 300;
  elasticLine.y = 300;

  const elasticLineControl = new Graphics().circle(0, 0, 4).fill(0xff0000);
  elasticLineControl.x = elasticLine.x + elasticLine.x / 2;
  elasticLineControl.y = elasticLine.y + elasticLine.y / 2;

  elasticLineControl.eventMode = 'static';
  elasticLineControl.cursor = 'pointer';
  elasticLineControl.on('pointerdown', onDragStart);

  app.stage.addChild(elasticLine, elasticLineControl);
  app.ticker.add(() => {
    elasticLine.clear();

    elasticLine.circle(0, 0, 2).stroke({ color: 0x0000ff, width: 2 });

    smoothLine(elasticLine, new Point(0, 0), new Point(elasticLineControl.x - 300, elasticLineControl.y - 300));
    smoothLine(elasticLine, new Point(elasticLineControl.x - 300, elasticLineControl.y - 300), new Point(300, 0));

    elasticLine.circle(300, 0, 2).stroke({ color: 0x0000ff, width: 2 });

    elasticLine.stroke({ color: 0x00ff00, width: 2 });
  });

  const smoothLine = (line: Graphics, begin: Point, end: Point) => {
    let phase = 0;

    while (phase < 1) {
      phase += 0.1;

      const newX = lerp(begin.x, end.x, phase);
      const newY = lerp(begin.y, end.y, Ease.cubicInOut(phase));

      line.lineTo(newX, newY);
    }

    line.stroke({ color: 0x00ff00, width: 2 });
  };

  const center = new Graphics().circle(0, 0, 100).fill(0xff0000);
  center.x = app.screen.width / 2;
  center.y = app.screen.height / 2;
  app.stage.addChild(center);

  center.eventMode = 'static';
  center.cursor = 'pointer';
  center.on('pointerdown', onDragStart);

  const circles: Graphics[] = [];
  const circleContainer = new Container();
  const CIRCLE_COUNT = 2;

  for (let i = 0; i < CIRCLE_COUNT; i++) {
    const circle = new Graphics().arc(0, 0, 50, Math.PI / 2, -Math.PI / 2, true).stroke(0x00ff00);
    circle.x = center.x;
    circle.y = center.y;
    circle.motion = 1;

    circles.push(circle);
    circleContainer.addChild(circle);
  }

  app.ticker.add(() => {
    for (let i = 0; i < circles.length; i++) {
      const c = circles[i];
      c.scale.set(c.motion, c.motion * 0.5);
    }
  });

  app.stage.addChild(circleContainer);

  let running = false;
  function fireCircle() {
    if (running) return;
    running = true;

    for (let i = 0; i < circles.length; i++) {
      circles[i].x = center.x;
      circles[i].y = center.y;
      circles[i].motion = 1;

      tweenTo(circles[i], 'motion', 2 + i * 2, 1000, Ease.circOut, null, reelsComplete);
    }
  }

  // Reels done handler.
  function reelsComplete() {
    running = false;
  }

  let dragTarget: Container | null = null;
  const beginPosition = new Point(0, 0);

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerup', onDragEnd);
  app.stage.on('pointerupoutside', onDragEnd);

  function onDragStart(event: FederatedPointerEvent) {
    dragTarget = event.target;
    dragTarget.alpha = 0.5;
    beginPosition.x = event.clientX - dragTarget.x;
    beginPosition.y = event.clientY - dragTarget.y;
    app?.stage.on('pointermove', onDragMove);
  }

  function onDragMove(event: FederatedPointerEvent) {
    if (dragTarget) {
      dragTarget.position = new Point(event.globalX - beginPosition.x, event.globalY - beginPosition.y);
    }
  }

  function onDragEnd() {
    if (dragTarget) {
      app?.stage.off('pointermove', onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {
      case 'Space':
        fireCircle();
        break;
      default:
        break;
    }
  }
  window.addEventListener('keydown', handleKeyDown);

  const tweening: any[] = [];

  function tweenTo(
    object: any,
    property: string,
    target: number,
    time: number,
    easing: (t: number) => number,
    onchange: null | (() => void),
    oncomplete: null | (() => void),
  ) {
    const tween = {
      object,
      property,
      propertyBeginValue: object[property],
      target,
      easing,
      time,
      change: onchange,
      complete: oncomplete,
      start: Date.now(),
    };

    tweening.push(tween);

    return tween;
  }
  // Listen for animate update.
  app.ticker.add(() => {
    const now = Date.now();
    const remove = [];

    for (let i = 0; i < tweening.length; i++) {
      const t = tweening[i];
      const phase = Math.min(1, (now - t.start) / t.time);

      // lerp实现插值
      const newVal = lerp(t.propertyBeginValue, t.target, t.easing(phase));

      t.object[t.property] = newVal;

      if (t.change) t.change(t);
      if (phase === 1) {
        t.object[t.property] = t.target;
        if (t.complete) t.complete(t);
        remove.push(t);
      }
    }
    for (let i = 0; i < remove.length; i++) {
      tweening.splice(tweening.indexOf(remove[i]), 1);
    }
  });
}

// Basic lerp funtion.
function lerp(a1: number, a2: number, t: number) {
  return a1 * (1 - t) + a2 * t;
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
