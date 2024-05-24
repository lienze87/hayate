<template>
  <div class="main-content">
    <div class="page-header"></div>
    <div class="page-content">
      <div v-for="(item, index) in dataList" :key="item.element" :class="['layer', `layer${index}`]">
        <div class="describe">
          <div class="describe-element">
            <span class="inline-title">属性</span>
            <span class="inline-value">{{ item.element }}</span>
          </div>
          <div class="describe-positive">
            <span class="inline-title">正位(星极)</span>
            <span class="inline-value">{{ item.positive }}</span>
          </div>
          <div class="describe-reverse">
            <span class="inline-title">逆位(灵极)</span>
            <span class="inline-value">{{ item.reverse }}</span>
          </div>
        </div>
        <div class="card">
          <img class="card-image" :src="item.cardUrl" :alt="item.cardAlt" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import Lenis from 'lenis';

import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis();
lenis.on('scroll', (e: MouseEvent) => {
  console.log(e);
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

const dataList = ref([
  {
    element: '雷',
    positive: '建筑与工艺之神比尔格',
    reverse: '彗星与破坏之神拉尔戈',
    cardUrl: '/建筑神之塔.png',
    cardAlt: '建筑神之塔',
  },
  {
    element: '水',
    positive: '河流与知识之神沙利亚克',
    reverse: '行星与命运女神妮美雅',
    cardUrl: '/河流神之瓶.png',
    cardAlt: '河流神之瓶',
  },
  {
    element: '土',
    positive: '大地与丰饶女神诺菲卡',
    reverse: '重力与光阴之神阿尔基克',
    cardUrl: '/世界树之干.png',
    cardAlt: '世界树之干',
  },
  {
    element: '风',
    positive: '海洋与航海女神利姆莱茵',
    reverse: '山岳与放浪之神奥修昂',
    cardUrl: '/放浪神之箭.png',
    cardAlt: '放浪神之箭',
  },
  {
    element: '火',
    positive: '太阳与审理女神阿泽玛',
    reverse: '地底与商贸之神纳尔札尔',
    cardUrl: '/太阳神之衡.png',
    cardAlt: '太阳神之衡',
  },
  {
    element: '冰',
    positive: '冰河与战争女神哈罗妮',
    reverse: '双月与慈爱女神梅茵菲娜',
    cardUrl: '/战争神之枪.png',
    cardAlt: '战争神之枪',
  },
]);
onMounted(() => {
  const entries = document.querySelectorAll('.layer');
  entries.forEach((entry) => {
    let entryDescribe = entry.querySelector('.describe');
    let entryCard = entry.querySelector('.card');

    /**
     * start的值表示scroller-start的位置，当目标元素的start在视口中达到此位置时开始动画
     * end的值表示scroller-end的位置,当目标元素的end在视口中达到此位置时结束动画
     * start和end的值是相对于整个视口而言的定位
     * 'top end'表示起始位置在视口最顶端，'top 20%'表示距离视口顶部20%的位置
     * 'bottom 90%'表示距离视口顶部90%的位置
     * markers: true表示显示scroller-start，scroller-end和元素start,end的位置
     * scrub：true表示将动画与滚动距离绑定起来，支持正向和逆向动画，暂停动画等
     */
    let timeline = gsap.timeline({
      scrollTrigger: {
        trigger: entry,
        start: 'top center',
        end: 'bottom 90%',
        // markers: true,
        scrub: true,
      },
    });

    timeline.fromTo(entryDescribe, { xPercent: -100, opacity: 0 }, { xPercent: 0, opacity: 1 });
    timeline.fromTo(entryCard, { xPercent: 100, opacity: 0 }, { xPercent: 0, opacity: 1 }, '<');

    // gsap.set(entryDescribe, {
    //   xPercent: -100,
    //   opacity: 0,
    // });
    // gsap.set(entryCard, {
    //   xPercent: 100,
    //   opacity: 0,
    // });

    // gsap.to(entryDescribe, {
    //   scrollTrigger: {
    //     trigger: entry,
    //     start: 'top center',
    //     end: 'bottom 90%',
    //     markers: true,
    //     scrub: true,
    //   },
    //   xPercent: 0,
    //   opacity: 1,
    // });

    // gsap.to(entryCard, {
    //   scrollTrigger: {
    //     trigger: entry,
    //     start: 'top center',
    //     end: 'bottom center',
    //     markers: true,
    //     scrub: true,
    //   },
    //   xPercent: 0,
    //   opacity: 1,
    // });
  });
});
</script>

<style>
html.lenis,
html.lenis body {
  height: auto;
}

.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}

.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}

.lenis.lenis-stopped {
  overflow: hidden;
}

.lenis.lenis-scrolling iframe {
  pointer-events: none;
}
</style>
<style lang="scss" scoped>
.main-content {
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100%;
  overflow: hidden;
}
.page-header {
  position: relative;
  display: grid;
  place-content: center;
  width: 100%;
  height: 100vh;
  color: #fff;
  background:
    linear-gradient(rgba(255, 255, 255, 0.5), rgba(0, 0, 0, 0.8)),
    center/cover no-repeat url(../../assets/Logo_3_0.png);

  .title {
    font-size: 72px;
  }
}
.page-content {
  width: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  .layer {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    color: beige;
    .describe {
      margin-right: 120px;
      .describe-element {
        font-size: 32px;
      }
      .describe-positive {
        line-height: 48px;
        color: #28bdca;
      }
      .describe-reverse {
        color: #d74235;
      }
      .inline-title {
        line-height: 48px;
        margin-right: 10px;
      }
    }
    .card {
      padding: 20px;
      border-radius: 10px;
      background-color: rgb(26, 26, 26);
      .card-image {
        object-fit: contain;
      }
    }
  }
}
</style>
