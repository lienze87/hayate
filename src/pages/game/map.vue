<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import type { Bounds, FederatedPointerEvent } from 'pixi.js';
import { Application, Assets, Container, Graphics, Point, Text, TilingSprite } from 'pixi.js';
import { onMounted } from 'vue';

interface PhysicGraphics extends Graphics {
  acceleration?: Point;
  mass?: number;
}

let app: Application | null = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ backgroundAlpha: 0, resizeTo: body });

  body.appendChild(app.canvas);

  const bgTexture = await Assets.load('/textures/box.png');

  const tilingSprite = new TilingSprite({
    texture: bgTexture,
    width: app.screen.width,
    height: app.screen.height,
  });

  app.stage.addChild(tilingSprite);

  const rectWidth = 100;
  const rotationSpeed = Math.PI / 18;
  let rotationAngle = 0;
  const container = new Container();
  container.x = app.screen.width / 2;
  container.y = app.screen.height - rectWidth;
  app.stage.addChild(container);

  app.ticker.add(() => {
    if (Math.abs(rotationAngle) > 0) {
      container.rotation += rotationAngle;
      rotationAngle = 0;
    }
  });

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

  const bullet: PhysicGraphics = new Graphics()
    .circle(0, 0, rectWidth / 4)
    .fill(0x0000ff)
    .stroke({ color: 0xff0000, width: 2 });
  bullet.x = ball.getGlobalPosition().x;
  bullet.y = ball.getGlobalPosition().y;
  bullet.alpha = 0;
  bullet.acceleration = new Point(0, 0);
  bullet.mass = 3;
  addMotion(app, bullet);
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

    intersectCount = 0;
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

  function testForAABB(bounds1: Bounds, bounds2: Bounds) {
    return (
      bounds1.x < bounds2.x + bounds2.width &&
      bounds1.x + bounds1.width > bounds2.x &&
      bounds1.y < bounds2.y + bounds2.height &&
      bounds1.y + bounds1.height > bounds2.y
    );
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

  const wall: PhysicGraphics = new Graphics().rect(0, 0, 800, 50).fill(0xf000f0);
  wall.x = app.screen.width / 2 - 400;
  wall.y = 100;
  wall.acceleration = new Point(0, 0);
  wall.mass = 5;
  app.stage.addChild(wall);

  const wallCenter = new Point(wall.x + wall.width * 0.5, wall.y + wall.height * 0.5);
  const wallCenterCircle = new Graphics().circle(wallCenter.x, wallCenter.y, 2).fill({ color: 0x00ff00 });
  app.stage.addChild(wallCenterCircle);

  wall.eventMode = 'static';
  wall.cursor = 'pointer';
  wall.on('pointerdown', onDragStart);

  const dustbin = new Graphics().rect(0, 0, 100, 100).fill(0xf0ff00);
  dustbin.x = app.screen.width - 150;
  dustbin.y = app.screen.height - 150;

  let dustbinCount = 0;
  const dustbinCountText = new Text({
    text: `移除数量: ${dustbinCount}`,
    style: {
      fontSize: 14,
    },
  });
  dustbinCountText.x = dustbin.x;
  dustbinCountText.y = dustbin.y;

  app.stage.addChild(dustbin, dustbinCountText);

  let intersectCount = 0;
  const intersectCountText = new Text({
    text: `碰撞次数：${intersectCount}`,
    style: {
      fill: 0xff0000,
    },
  });

  intersectCountText.x = 50;
  intersectCountText.y = 150;

  app.stage.addChild(intersectCountText);

  app.ticker.add(() => {
    if (circleIntersectRect(bullet.x, bullet.y, bullet.width * 0.5, wall.x, wall.y, wall.width, wall.height)) {
      const collisionVelocity = collisionResponse(wall, bullet);
      console.log('new acceleration', collisionVelocity);

      const newVelocityX = collisionVelocity.x * bullet.mass;
      const newVelocityY = collisionVelocity.y * bullet.mass;

      // 旋转45°后发射新的小球
      const childBall: PhysicGraphics = new Graphics().circle(0, 0, 25).fill({ color: Math.random() * 0xffffff });
      childBall.mass = 3;
      childBall.acceleration = rotateVector(new Point(newVelocityX * 0.5, newVelocityY * 0.5), Math.PI / 4);
      childBall.x = bullet.x;
      childBall.y = bullet.y;
      addMotion(app, childBall);

      // 旋转-45°后发射新的小球
      const childBall2: PhysicGraphics = new Graphics().circle(0, 0, 25).fill({ color: Math.random() * 0xffffff });
      childBall2.mass = 3;
      childBall2.acceleration = rotateVector(new Point(newVelocityX * 0.5, newVelocityY * 0.5), -Math.PI / 4);
      childBall2.x = bullet.x;
      childBall2.y = bullet.y;
      addMotion(app, childBall2);

      childBall.eventMode = 'static';
      childBall.cursor = 'pointer';
      childBall.on('pointerdown', onDragStart);

      childBall2.eventMode = 'static';
      childBall2.cursor = 'pointer';
      childBall2.on('pointerdown', onDragStart);

      app.stage.addChild(childBall, childBall2);

      const velocityLine = new Graphics()
        .moveTo(wallCenter.x, wallCenter.y)
        .lineTo(wallCenter.x + newVelocityX * 20, wallCenter.y + newVelocityY * 20)
        .lineTo(wallCenter.x + newVelocityX * 20 - 20, wallCenter.y + newVelocityY * 20 - 20)
        .stroke(0xff0000);

      app.stage.addChild(velocityLine);

      wall.tint = 0x456859;
      bullet.acceleration.set(newVelocityX, newVelocityY);
      // bullet.alpha = 0;

      intersectCount++;
      intersectCountText.text = `碰撞次数：${intersectCount}`;
    }
    // 检测小球是否被拖入垃圾桶
    if (dragTarget && testForAABB(dragTarget.getBounds(), dustbin.getBounds())) {
      dustbin.tint = 0xf0aa00;
    } else {
      dustbin.tint = 0xffffff;
    }
  });

  const restitution = 0.99;
  function addMotion(app: Application, shape: PhysicGraphics) {
    app.ticker.add((time) => {
      const delta = time.deltaTime;

      if (Math.abs(shape.acceleration.x) > 0.01 || Math.abs(shape.acceleration.y) > 0.01) {
        shape.acceleration.set(shape.acceleration.x * restitution, shape.acceleration.y * restitution);
      } else {
        shape.acceleration.set(0, 0);
      }

      if (shape.x < 0 || shape.x > app.screen.width - shape.width / 2) {
        shape.acceleration.x = -shape.acceleration.x;
      }
      if (shape.y < 0 || shape.y > app.screen.height - shape.height / 2) {
        shape.acceleration.y = -shape.acceleration.y;
      }

      shape.x += shape.acceleration.x * delta;
      shape.y += shape.acceleration.y * delta;
    });
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

      // 检测小球是否被拖入垃圾桶
      if (dragTarget && testForAABB(dragTarget.getBounds(), dustbin.getBounds())) {
        app.stage.removeChild(dragTarget);

        dustbinCountText.text = `移除数量: ${++dustbinCount}`;
      }
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
}

.grid-background {
  background-image: repeating-linear-gradient(-90deg, transparent 0 50px, rgb(82, 82, 82) 50px 52px),
    repeating-linear-gradient(0deg, transparent, transparent 0 50px, rgb(82, 82, 82) 50px 52px);
}
</style>
