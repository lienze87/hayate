<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import { Application, Assets, Sprite } from 'pixi.js';
import { onMounted } from 'vue';

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ background: '#1099bb', resizeTo: body });

  body.appendChild(app.canvas);
  // Load the star texture
  const starTexture = await Assets.load('/textures/star.png');

  const starAmount = 1000;
  let cameraZ = 0;
  const fov = 20;
  const baseSpeed = 0.025;
  let speed = 0;
  let warpSpeed = 1;
  const starStretch = 5;
  const starBaseSize = 0.05;

  type Star = { sprite: Sprite; z: number; x: number; y: number };

  // Create the stars
  const stars: Array<Star> = [];

  for (let i = 0; i < starAmount; i++) {
    const star = {
      sprite: new Sprite(starTexture),
      z: 0,
      x: 0,
      y: 0,
    };

    star.sprite.anchor.x = 0.5;
    star.sprite.anchor.y = 0.7;
    randomizeStar(star, true);
    app.stage.addChild(star.sprite);
    stars.push(star);
  }

  function randomizeStar(star: Star, initial?: boolean) {
    star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

    // Calculate star positions with radial random coordinate so no star hits the camera.
    const deg = Math.random() * Math.PI * 2;
    const distance = Math.random() * 50 + 1;

    star.x = Math.cos(deg) * distance;
    star.y = Math.sin(deg) * distance;
  }

  // Change flight speed every 5 seconds
  setInterval(() => {
    warpSpeed = warpSpeed > 0 ? 0 : 1;
  }, 5000);

  // Listen for animate update
  app.ticker.add((time) => {
    // Simple easing. This should be changed to proper easing function when used for real.
    speed += (warpSpeed - speed) / 20;
    cameraZ += time.deltaTime * 10 * (speed + baseSpeed);
    for (let i = 0; i < starAmount; i++) {
      const star = stars[i];

      if (star.z < cameraZ) {
        randomizeStar(star);
      }

      // Map star 3d position to 2d with really simple projection
      const z = star.z - cameraZ;

      star.sprite.x = star.x * (fov / z) * app.renderer.screen.width + app.renderer.screen.width / 2;
      star.sprite.y = star.y * (fov / z) * app.renderer.screen.width + app.renderer.screen.height / 2;

      // Calculate star scale & rotation.
      const dxCenter = star.sprite.x - app.renderer.screen.width / 2;
      const dyCenter = star.sprite.y - app.renderer.screen.height / 2;
      const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);
      const distanceScale = Math.max(0, (2000 - z) / 2000);

      star.sprite.scale.x = distanceScale * starBaseSize;
      // Star is looking towards center so that y axis is towards center.
      // Scale the star depending on how fast we are moving, what the stretchfactor is
      // and depending on how far away it is from the center.
      star.sprite.scale.y =
        distanceScale * starBaseSize +
        (distanceScale * speed * starStretch * distanceCenter) / app.renderer.screen.width;
      star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
    }
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
