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
  await app.init({ background: '#f2f2f2', resizeTo: body });
  body.appendChild(app.canvas);
  const bgTexture = await Assets.load('/textures/box.png');

  const tilingSprite = new TilingSprite({
    texture: bgTexture,
    width: app.screen.width,
    height: app.screen.height,
  });

  app.stage.addChild(tilingSprite);

  const elasticLine = new Graphics();
  const elasticLineOffset = 300;
  elasticLine.x = elasticLineOffset;
  elasticLine.y = elasticLineOffset;

  const elasticLineControl = new Graphics().circle(0, 0, 8).fill(0x0000ff);
  elasticLineControl.x = elasticLine.x + elasticLine.x / 2;
  elasticLineControl.y = elasticLine.y + elasticLine.y / 2;

  elasticLineControl.eventMode = 'static';
  elasticLineControl.cursor = 'pointer';
  elasticLineControl.on('pointerdown', onDragStart);

  app.stage.addChild(elasticLine, elasticLineControl);
  app.ticker.add(() => {
    elasticLine.clear();

    elasticLine.circle(0, 0, 2).stroke({ color: 0xff0000, width: 2 });

    smoothLine(
      elasticLine,
      new Point(0, 0),
      new Point(elasticLineControl.x - elasticLineOffset, elasticLineControl.y - elasticLineOffset),
    );
    smoothLine(
      elasticLine,
      new Point(elasticLineControl.x - elasticLineOffset, elasticLineControl.y - elasticLineOffset),
      new Point(elasticLineOffset, 0),
    );

    elasticLine.circle(elasticLineOffset, 0, 2).stroke({ color: 0xff0000, width: 2 });

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

  const centerCircle = new Graphics().circle(0, 0, 20).fill(0x0000ff);
  centerCircle.x = app.screen.width / 2 + 200;
  centerCircle.y = 300;
  centerCircle.motion = 1;
  app.stage.addChild(centerCircle);

  centerCircle.eventMode = 'static';
  centerCircle.cursor = 'pointer';
  centerCircle.on('pointerdown', onDragStart);

  app.ticker.add(() => {
    centerCircle.scale.set(centerCircle.motion, centerCircle.motion);
  });

  const circles: Graphics[] = [];
  const circleContainer = new Container();
  circleContainer.x = app.screen.width / 2;
  circleContainer.y = app.screen.height / 2;
  const CIRCLE_COUNT = 3;

  for (let i = 0; i < CIRCLE_COUNT; i++) {
    const circle = new Graphics().circle(0, 0, 8).fill(0x00ff00);

    circle.x = i * 150;
    circle.eventMode = 'static';
    circle.cursor = 'pointer';
    circle.on('pointerdown', onDragStart);

    circles.push(circle);
    circleContainer.addChild(circle);
  }

  const circleLine = new Graphics();
  circleContainer.addChild(circleLine);

  app.stage.addChild(circleContainer);

  let centerCircleToCircles = 0;
  app.ticker.add(() => {
    circleLine.clear();

    circles.forEach((ele: Graphics, index: number) => {
      if (index === 0) {
        circleLine.moveTo(ele.x, ele.y);
      } else if (index === 1) {
        circleLine.lineTo(ele.x, ele.y);
      } else if (index === 2) {
        circleLine.lineTo(ele.x, ele.y);
      }
    });

    // 中间点到控制点的向量
    const vCollision = new Point(
      centerCircle.x - circleContainer.x - circles[1].x,
      centerCircle.y - circleContainer.y - circles[1].y,
    );
    const distance = Math.sqrt(vCollision.x * vCollision.x + vCollision.y * vCollision.y);

    // 中间点到终点的距离
    const distance2 = Math.sqrt(
      (circles[2].x - circles[1].x) * (circles[2].x - circles[1].x) +
        (circles[2].y - circles[1].y) * (circles[2].y - circles[1].y),
    );

    if (centerCircleToCircles !== distance) {
      centerCircleToCircles = distance;

      circles[2].position.set(
        circles[1].x + (vCollision.x / distance) * distance2,
        circles[1].y + (vCollision.y / distance) * distance2,
      );
    }
    // circleLine.moveTo(circles[1].x, circles[1].y);
    // circleLine.lineTo(centerCircle.x - circleContainer.x, centerCircle.y - circleContainer.y);

    circleLine.stroke({ color: 0xff0000, width: 4 });
  });

  let running = false;

  function startMotion() {
    if (running) return;
    running = true;

    tweenTo(centerCircle, 'motion', 5, 1000, Ease.circOut, null, reelsComplete);
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
        startMotion();
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

/**
 * 向量旋转矩阵
 * [cosθ sinθ ]
 * [-sinθ cosθ ]
 */

function rotateVector(vector: Point, angle: number) {
  return new Point(
    vector.x * Math.cos(angle) - vector.y * Math.sin(angle),
    vector.x * Math.sin(angle) + vector.y * Math.cos(angle),
  );
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
