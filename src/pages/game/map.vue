<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import type { FederatedPointerEvent } from 'pixi.js';
import { Application, Container, Graphics, Point, Text } from 'pixi.js';
import { onMounted } from 'vue';

interface PhysicGraphics extends Graphics {
  acceleration?: Point;
  mass?: number;
}

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ backgroundAlpha: 0, resizeTo: body });

  body.appendChild(app.canvas);

  const rectWidth = 100;
  const rotationSpeed = Math.PI / 18;
  let rotationAngle = 0;
  const container = new Container();
  container.x = (app.screen.width - rectWidth / 2) / 2;
  container.y = app.screen.height - rectWidth;
  app.stage.addChild(container);

  const basicText = new Text({
    text: 'Q键和E键旋转方向,空格发射小球',
    style: {
      fill: 0xff0000,
    },
  });

  basicText.x = 50;
  basicText.y = 50;

  app.stage.addChild(basicText);

  const rect = new Graphics().rect(0, 0, rectWidth / 2, rectWidth * 3).fill({ color: 0x00ff00 });
  rect.pivot = new Point(rectWidth / 4, rectWidth);
  container.addChild(rect);

  const ball = new Graphics().circle(0, 0, rectWidth / 4).fill(0xff0000);
  const ballToRectCenter = rectWidth + 10;
  container.addChild(ball);
  ball.x = 0;
  ball.y = -ballToRectCenter;
  ball.zIndex = -1;

  const bullet: PhysicGraphics = new Graphics().circle(0, 0, rectWidth / 4).fill(0x0000ff);
  bullet.x = ball.getGlobalPosition().x;
  bullet.y = ball.getGlobalPosition().y;
  bullet.alpha = 0;
  bullet.acceleration = new Point(0, 0);
  bullet.mass = 3;
  app.stage.addChild(bullet);

  function fireGun() {
    ball.alpha = 0;
    bullet.x = ball.getGlobalPosition().x;
    bullet.y = ball.getGlobalPosition().y;

    const vCollision = new Point(container.x - bullet.x, container.y - bullet.y);
    const distance = ballToRectCenter;
    const vCollisionNorm = new Point(vCollision.x / distance, vCollision.y / distance);

    const impulse = 3 * 9.81;
    bullet.acceleration = new Point(-impulse * vCollisionNorm.x, -impulse * vCollisionNorm.y);
    bullet.alpha = 1;
  }

  function circleIntersectRect(cx: number, cy: number, cr: number, rx: number, ry: number, rw: number, rh: number) {
    let testX = cx;
    let testY = cy;

    if (cx < rx) {
      testX = rx;
    } else if (cx > rx + rw) {
      testX = rx + rw;
    }

    if (cy < ry) {
      testY = ry;
    } else if (cy > ry + rh) {
      testY = ry + rh;
    }

    const distance = Math.sqrt((cx - testX) * (cx - testX) + (cy - testY) * (cy - testY));

    return distance <= cr;
  }

  const impulsePower = 5;
  function collisionResponse(rect: PhysicGraphics, circle: PhysicGraphics) {
    if (!rect || !circle) {
      return new Point(0);
    }

    // 以方块重心点为目标点
    const rectCenter = new Point(rect.x + rect.width * 0.5, rect.y + rect.height * 0.5);

    // 计算碰撞方向
    const vCollision = new Point(circle.x - rectCenter.x, circle.y - rectCenter.y);

    const distance = Math.sqrt(
      (circle.x - rectCenter.x) * (circle.x - rectCenter.x) + (circle.y - rectCenter.y) * (circle.y - rectCenter.y),
    );

    const vCollisionNorm = new Point(vCollision.x / distance, vCollision.y / distance);

    // 相对速度为两向量终点相连
    const vRelativeVelocity = new Point(
      rect.acceleration.x - circle.acceleration.x,
      rect.acceleration.y - circle.acceleration.y,
    );

    // 速度为相对速度在单位向量方向上的投影，即两向量的点乘
    const speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;

    // 计算单位质量的动能
    const impulse = (impulsePower * speed) / (rect.mass + circle.mass);

    return new Point(impulse * vCollisionNorm.x, impulse * vCollisionNorm.y);
  }

  const wall: PhysicGraphics = new Graphics().rect(0, 0, 500, 50).fill(0xf000f0);
  wall.x = app.screen.width / 2 - 250;
  wall.y = 100;
  wall.acceleration = new Point(0, 0);
  wall.mass = 5;
  app.stage.addChild(wall);

  wall.eventMode = 'static';
  wall.cursor = 'pointer';
  wall.on('pointerdown', onDragStart);

  app.ticker.add(() => {
    if (circleIntersectRect(bullet.x, bullet.y, bullet.width * 0.5, wall.x, wall.y, wall.width, wall.height)) {
      const collisionPush = collisionResponse(wall, bullet);
      console.log('new acceleration', collisionPush);

      wall.tint = 0x456859;
      bullet.acceleration.set(collisionPush.x * bullet.mass, collisionPush.y * bullet.mass);
    }
  });

  const restitution = 0.99;
  app.ticker.add((time) => {
    const delta = time.deltaTime;

    if (Math.abs(bullet.acceleration.x) > 0.01 || Math.abs(bullet.acceleration.y) > 0.01) {
      bullet.acceleration.set(bullet.acceleration.x * restitution, bullet.acceleration.y * restitution);
    } else {
      bullet.acceleration.set(0, 0);
    }

    if (bullet.x < 0 || bullet.x > app.screen.width - bullet.width / 2) {
      bullet.acceleration.x = -bullet.acceleration.x;
    }
    if (bullet.y < 0 || bullet.y > app.screen.height - bullet.height / 2) {
      bullet.acceleration.y = -bullet.acceleration.y;
    }

    if (Math.abs(rotationAngle) > 0) {
      container.rotation += rotationAngle;
      rotationAngle = 0;
    }

    bullet.x += bullet.acceleration.x * delta;
    bullet.y += bullet.acceleration.y * delta;
  });

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
    app.stage.on('pointermove', onDragMove);
  }

  function onDragMove(event: FederatedPointerEvent) {
    if (dragTarget) {
      dragTarget.parent.toLocal(
        new Point(event.globalX - beginPosition.x, event.globalY - beginPosition.y),
        null,
        dragTarget.position,
      );
    }
  }

  function onDragEnd() {
    if (dragTarget) {
      app.stage.off('pointermove', onDragMove);
      dragTarget.alpha = 1;
      dragTarget = null;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {
      case 'KeyQ':
        rotationAngle = -rotationSpeed;
        break;
      case 'KeyE':
        rotationAngle = rotationSpeed;
        break;
      case 'Space':
        fireGun();
        break;
      default:
        break;
    }
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
