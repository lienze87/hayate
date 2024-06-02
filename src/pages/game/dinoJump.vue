<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import {
  AnimatedSprite,
  Application,
  Assets,
  Container,
  Sprite,
  Spritesheet,
  Text,
  TextStyle,
  Texture,
  TilingSprite,
} from 'pixi.js';
import { onMounted } from 'vue';

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ background: '#ffffff', resizeTo: body });

  body.appendChild(app.canvas);

  const container = new Container();

  app.stage.addChild(container);

  const texture = await Assets.load('/textures/200-offline-sprite.png');
  console.log('texture ', texture.width, texture.height);

  // Create object to store sprite sheet data
  const atlasData = {
    frames: {
      dino: {
        frame: { x: 75, y: 0, w: 88, h: 100 },
        sourceSize: { w: 82, h: 100 },
        spriteSourceSize: { x: 0, y: 0, w: 82, h: 100 },
      },
      dinoUp: {
        frame: { x: 1680 + 2 * 88, y: 0, w: 82, h: 100 },
        sourceSize: { w: 82, h: 100 },
        spriteSourceSize: { x: 0, y: 0, w: 82, h: 100 },
      },
      dinoDown: {
        frame: { x: 1680 + 3 * 88, y: 0, w: 82, h: 100 },
        sourceSize: { w: 82, h: 100 },
        spriteSourceSize: { x: 0, y: 0, w: 82, h: 100 },
      },
      jump: {
        frame: { x: 1680, y: 0, w: 82, h: 100 },
        sourceSize: { w: 82, h: 100 },
        spriteSourceSize: { x: 0, y: 0, w: 82, h: 100 },
      },
      ground: {
        frame: { x: 50, y: 100, w: 2300, h: 30 },
        sourceSize: { w: 1300, h: 30 },
        spriteSourceSize: { x: 0, y: 0, w: 2300, h: 30 },
      },
      cactus: {
        frame: { x: 515, y: 0, w: 30, h: 60 },
        sourceSize: { w: 30, h: 60 },
        spriteSourceSize: { x: 0, y: 0, w: 30, h: 60 },
      },
    },
    meta: {
      image: '/textures/200-offline-sprite.png',
      format: 'RGBA8888',
      size: { w: 2441, h: 130 },
      scale: 1,
    },
    animations: {
      jump: ['dinoUp', 'dinoDown'],
    },
  };

  const spriteSheet = new Spritesheet(Texture.from(atlasData.meta.image), atlasData);

  await spriteSheet.parse();

  const dinoTexture = new Texture(spriteSheet.textures.dino);
  const dinoSprite = new Sprite(dinoTexture);
  dinoSprite.x = 60;
  dinoSprite.y = window.innerHeight - 100 - 80;
  container.addChild(dinoSprite);

  const runAnimation = new AnimatedSprite(spriteSheet.animations.jump);
  runAnimation.animationSpeed = 0.1;
  runAnimation.play();
  container.addChild(runAnimation);
  runAnimation.visible = false;

  const jumpSprite = new Sprite(spriteSheet.textures.jump);
  jumpSprite.x = 60;
  jumpSprite.y = window.innerHeight - 100 - 100;
  container.addChild(jumpSprite);
  jumpSprite.visible = false;

  const groundSprite = new TilingSprite(spriteSheet.textures.ground);
  groundSprite.width = window.innerWidth;
  groundSprite.height = 30;
  groundSprite.x = 0;
  groundSprite.y = window.innerHeight - 100;
  container.addChild(groundSprite);

  const cactusTexture = new Texture(spriteSheet.textures.cactus);
  const cactusSprite = new Sprite(cactusTexture);
  cactusSprite.x = app.screen.width / 2;
  cactusSprite.y = window.innerHeight - 100 - 50;
  container.addChild(cactusSprite);

  const style = new TextStyle({
    fontFamily: 'Sans',
    fontSize: 36,
    fill: '#000000',
    dropShadow: {
      blur: 4,
      color: '#d2e20d',
      distance: 10,
    },
  });
  const startText = new Text({ text: '开始游戏', style });
  startText.x = app.screen.width / 2;
  startText.y = app.screen.height / 2;
  startText.anchor.set(0.5);
  container.addChild(startText);

  startText.eventMode = 'static';
  startText.on('pointerdown', () => {
    if (isGameOver) return;
    playGame();
  });

  let isGaming = false;
  let isGameOver = false;
  let score = 0;
  let jumpVelocity = 20;
  const gravity = 1;

  function playGame() {
    isGaming = true;
    isGameOver = false;

    score = 0;
    jumpVelocity = 20;

    startText.visible = false;
    dinoSprite.visible = false;

    runAnimation.visible = true;
    runAnimation.x = 60;
    runAnimation.y = window.innerHeight - 100 - 80;
  }

  function gameOver() {
    console.log(
      'cactusSprite',
      cactusSprite.position,
      'runAnimation',
      runAnimation.position,
      'jumpSprite',
      jumpSprite.position,
    );
    isGaming = false;
    isGameOver = true;

    dinoSprite.visible = true;

    runAnimation.visible = false;
    runAnimation.x = 60;
    runAnimation.y = window.innerHeight - 100 - 80;
  }

  app.ticker.add(() => {
    if (isGameOver) {
      runAnimation.visible = false;
      jumpSprite.visible = false;
      dinoSprite.visible = true;
      return;
    }

    if (isGaming) {
      groundSprite.tilePosition.x -= 5;
      cactusSprite.x -= 5;
      if (cactusSprite.x < -30) {
        cactusSprite.x = window.innerWidth;
        score++;
      }
      if (jumpSprite.visible) {
        jumpVelocity -= gravity;
        jumpSprite.y -= jumpVelocity;
        if (jumpSprite.y > window.innerHeight - 100 - 80) {
          jumpSprite.y = window.innerHeight - 100 - 100;
          jumpVelocity = 20;
          jumpSprite.visible = false;
          runAnimation.visible = true;
        }
      }
      if (
        (cactusSprite.x < runAnimation.x + 15 &&
          cactusSprite.x > runAnimation.x - 15 &&
          jumpSprite.visible === false) ||
        (jumpSprite.y > cactusSprite.y - 40 && cactusSprite.x < jumpSprite.x + 15 && cactusSprite.x > jumpSprite.x - 15)
      ) {
        gameOver();
        startText.visible = true;
        startText.text = `游戏结束，最后得分: ${score}`;
      }
    }
  });

  function handleKeyDown(event: KeyboardEvent) {
    console.log(event.code);
    if (event.code === 'Space' && isGaming) {
      runAnimation.visible = false;
      jumpSprite.visible = true;
      jumpVelocity = 20;
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
</style>
