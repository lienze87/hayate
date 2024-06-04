<template>
  <div class="main-content"></div>
</template>
<script lang="ts" setup>
import {
  Application,
  Assets,
  BlurFilter,
  Color,
  Container,
  FillGradient,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'pixi.js';
import { onMounted } from 'vue';

let app: Application = null;

async function initApp() {
  app = new Application();
  const body = document.querySelector('.main-content') as HTMLElement;
  await app.init({ background: '#1099bb', resizeTo: body });

  body.appendChild(app.canvas);

  await Assets.load([
    'https://pixijs.com/assets/eggHead.png',
    'https://pixijs.com/assets/flowerTop.png',
    'https://pixijs.com/assets/helmlok.png',
    'https://pixijs.com/assets/skully.png',
  ]);

  // 卷轴单列横向宽度
  const REEL_WIDTH = 160;
  // 单张卡牌高度
  const SYMBOL_SIZE = 150;

  // Create different slot symbols
  const slotTextures = [
    Texture.from('https://pixijs.com/assets/eggHead.png'),
    Texture.from('https://pixijs.com/assets/flowerTop.png'),
    Texture.from('https://pixijs.com/assets/helmlok.png'),
    Texture.from('https://pixijs.com/assets/skully.png'),
  ];

  const reels: any[] = [];
  const reelContainer = new Container();
  const REEL_COUNT = 1;

  for (let i = 0; i < REEL_COUNT; i++) {
    const rc = new Container();

    rc.x = i * REEL_WIDTH;
    reelContainer.addChild(rc);

    const reel = {
      container: rc,
      symbols: [] as Sprite[],
      position: 0,
      previousPosition: 0,
      blur: new BlurFilter(),
    };

    reel.blur.blurX = 0;
    reel.blur.blurY = 0;
    rc.filters = [reel.blur];

    // Build the symbols
    for (let j = 0; j < 4; j++) {
      const symbol = new Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
      // Scale the symbol to fit symbol area.

      symbol.y = j * SYMBOL_SIZE;
      symbol.scale.x = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
      symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
      symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
      reel.symbols.push(symbol);
      rc.addChild(symbol);
    }
    reels.push(reel);
  }
  app.stage.addChild(reelContainer);

  // Build top & bottom covers and position reelContainer
  const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

  reelContainer.y = margin;
  reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 5) / 2;
  const top = new Graphics().rect(0, 0, app.screen.width, margin).fill({ color: 0x0 });
  const bottom = new Graphics().rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin).fill({ color: 0x0 });

  // Create gradient fill
  const fill = new FillGradient(0, 0, 0, 36 * 1.7);

  const colors = [0xffffff, 0x00ff99].map((color) => Color.shared.setValue(color).toNumber());

  colors.forEach((number, index) => {
    const ratio = index / colors.length;

    fill.addColorStop(ratio, number);
  });

  // Add play text
  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 36,
    fontStyle: 'italic',
    fontWeight: 'bold',
    fill: { fill },
    stroke: { color: 0x4a1850, width: 5 },
    dropShadow: {
      color: 0x000000,
      angle: Math.PI / 6,
      blur: 4,
      distance: 6,
    },
    wordWrap: true,
    wordWrapWidth: 440,
  });

  const playText = new Text({
    text: 'Spin the wheels!',
    style,
  });

  playText.x = Math.round((bottom.width - playText.width) / 2);
  playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
  bottom.addChild(playText);

  // Add header text
  const headerText = new Text({
    text: 'PIXI MONSTER SLOTS!',
    style,
  });

  headerText.x = Math.round((top.width - headerText.width) / 2);
  headerText.y = Math.round((margin - headerText.height) / 2);
  top.addChild(headerText);

  app.stage.addChild(top);
  app.stage.addChild(bottom);

  // Set the interactivity.
  bottom.eventMode = 'static';
  bottom.cursor = 'pointer';
  bottom.addListener('pointerdown', () => {
    startPlay();
  });

  let running = false;
  // Function to start playing.
  function startPlay() {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      const extra = Math.floor(Math.random() * 3);
      const target = r.position + 10 + i * 5 + extra;
      const time = 2500 + i * 600 + extra * 600;

      tweenTo(r, 'position', target, time, backout(0.5), null, i === reels.length - 1 ? reelsComplete : null);
    }
  }

  // Reels done handler.
  function reelsComplete() {
    running = false;
  }

  // Listen for animate update.
  app.ticker.add(() => {
    // Update the slots.
    for (let i = 0; i < reels.length; i++) {
      const r = reels[i];
      // Update blur filter y amount based on speed.
      // This would be better if calculated with time in mind also. Now blur depends on frame rate.

      r.blur.blurY = (r.position - r.previousPosition) * 8;
      r.previousPosition = r.position;

      // Update symbol positions on reel.
      for (let j = 0; j < r.symbols.length; j++) {
        const s = r.symbols[j];
        const prevy = s.y;

        s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
        // 当symbol的y到达底部SYMBOL_SIZE * r.symbols.length - 1即超出可视区域时
        // 将其y重置为-SYMBOL_SIZE，同时更新为新texture
        if (s.y < 0 && prevy > SYMBOL_SIZE) {
          console.log('update', j, s.y, prevy);

          // Detect going over and swap a texture.
          // This should in proper product be determined from some logical reel.
          s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
          s.scale.x = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
          s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
          s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
        }
      }
    }
  });

  // Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
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
      // t.easing-backout实现超出后回缩效果
      t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));

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

  // Basic lerp funtion.
  function lerp(a1: number, a2: number, t: number) {
    return a1 * (1 - t) + a2 * t;
  }

  // Backout function from tweenjs.
  // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
  function backout(amount: number) {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
  }
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
