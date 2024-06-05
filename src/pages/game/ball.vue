<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import { Application, Container, Graphics, Point, Rectangle } from 'pixi.js';
import { onMounted } from 'vue';

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ backgroundAlpha: 0, resizeTo: body });

  body.appendChild(app.canvas);

  const container = new Container();

  app.stage.addChild(container);

  let offset = { x: 1, y: 0 };
  const moveSpeed = 100;
  const impulsePower = 5;
  const panel = new Graphics().rect(0, 0, 300, 20).fill(0x00ff00);
  panel.x = app.screen.width / 2 - 150;
  panel.y = app.screen.height - 80;
  panel.acceleration = new Point(0);
  panel.mass = 1;
  container.addChild(panel);

  function movePanel() {
    let distance = offset.x * moveSpeed;
    if ((panel.x > app.screen.width - panel.width && distance > 0) || (panel.x < 0 && distance < 0)) {
      distance = 0;
    }
    panel.x += distance;
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

  function collisionResponse(rect: Graphics, circle: Graphics) {
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

  const g = 9.81;
  const ball = new Graphics().circle(0, 0, 40).fill(0xff0000);
  ball.x = app.screen.width / 2;
  ball.y = 0;
  ball.acceleration = new Point(0, 3 * g);
  ball.mass = 3;
  app.stage.addChild(ball);

  const ballBoundingBox = new Graphics().rect(0, 0, ball.width, ball.height).stroke(0x0000ff);
  app.stage.addChild(ballBoundingBox);

  const dudeSprites = new Container();
  app.stage.addChild(dudeSprites);

  const restitution = 0.99;
  app.ticker.add((time) => {
    const delta = time.deltaTime;

    if (Math.abs(ball.acceleration.x) > 0.01 || Math.abs(ball.acceleration.y) > 0.01) {
      ball.acceleration.set(ball.acceleration.x * restitution, ball.acceleration.y * restitution);
    } else {
      ball.acceleration.set(0, 0);
    }

    ballBoundingBox.x = ball.getBounds().x;
    ballBoundingBox.y = ball.getBounds().y;

    if (ball.x < 0 || ball.x > app.screen.width - ball.width / 2) {
      ball.acceleration.x = -ball.acceleration.x;
    }

    if (ball.y < 0 || ball.y > app.screen.height - ball.height / 2) {
      ball.acceleration.y = -ball.acceleration.y;
    }

    if (circleIntersectRect(ball.x, ball.y, ball.width * 0.5, panel.x, panel.y, panel.width, panel.height)) {
      const collisionPush = collisionResponse(panel, ball);
      console.log('new acceleration', collisionPush);

      ball.acceleration.set(collisionPush.x * ball.mass, collisionPush.y * ball.mass);
    }

    ball.x += ball.acceleration.x * delta;
    ball.y += ball.acceleration.y * delta;
  });

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    switch (event.code) {
      case 'ArrowLeft':
        offset = { x: -1, y: 0 };
        movePanel();
        break;
      case 'ArrowRight':
        offset = { x: 1, y: 0 };
        movePanel();
        break;
      case 'Space':
        ball.x = app.screen.width / 2;
        ball.y = 0;
        ball.acceleration.set(0, 3 * g);
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
