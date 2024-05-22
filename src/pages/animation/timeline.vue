<template>
  <div class="main-content">
    <div class="scroll-watcher"></div>
    <div class="article-header">
      <div class="header-content">
        <p class="article-title">CSS-only scroll-driven animation</p>
        <p>
          CSS animations 使得可以将从一个 CSS 样式配置转换到另一个 CSS
          样式配置。
        </p>
        <p>
          动画包括两个部分：描述动画的样式规则和用于指定动画开始、结束以及中间点样式的关键帧。
        </p>
        <div class="accordion-list" @click="handleAccordionChange">
          <div
            :class="`accordion-item${active === 1 ? ' active' : ''}`"
            data-index="1"
          >
            <div class="accordion-item-week">Mon</div>
            <div class="accordion-item-temp">22&deg;C-33&deg;C</div>
          </div>
          <div
            :class="`accordion-item${active === 2 ? ' active' : ''}`"
            data-index="2"
          >
            <div class="accordion-item-week">Tue</div>
            <div class="accordion-item-temp">21&deg;C-25&deg;C</div>
          </div>
          <div
            :class="`accordion-item${active === 3 ? ' active' : ''}`"
            data-index="3"
          >
            <div class="accordion-item-week">Wed</div>
            <div class="accordion-item-temp">19&deg;C-25&deg;C</div>
          </div>
          <div
            :class="`accordion-item${active === 4 ? ' active' : ''}`"
            data-index="4"
          >
            <div class="accordion-item-week">Thu</div>
            <div class="accordion-item-temp">23&deg;C-34&deg;C</div>
          </div>
          <div
            :class="`accordion-item${active === 5 ? ' active' : ''}`"
            data-index="5"
          >
            <div class="accordion-item-week">Fri</div>
            <div class="accordion-item-temp">23&deg;C-34&deg;C</div>
          </div>
        </div>
      </div>
    </div>
    <div class="article-content">
      <h2>
        <a href="https://coolshell.cn/articles/10804.html">X-Y PROBLEM</a>
      </h2>
      <p>对于X-Y Problem的意思如下：</p>
      <p>
        1）有人想解决问题X<br />
        2）他觉得Y可能是解决X问题的方法<br />
        3）但是他不知道Y应该怎么做<br />
        4）于是他去问别人Y应该怎么做？
      </p>
      <p>
        简而言之，
        <strong>
          没有去问怎么解决问题X，而是去问解决方案Y应该怎么去实现和操作。
        </strong>
      </p>
      <p>于是乎：</p>
      <p>
        1）热心的人们帮助并告诉这个人Y应该怎么搞，但是大家都觉得Y这个方案有点怪异。<br />
        2）在经过大量地讨论和浪费了大量的时间后，热心的人终于明白了原始的问题X是怎么一回事。<br />
        3）于是大家都发现，Y根本就不是用来解决X的合适的方案。
      </p>
      <p>
        X-Y
        Problem最大的严重的问题就是：<strong>在一个根本错误的方向上浪费他人大量的时间和精力</strong>！
      </p>
      <img class="article-image" src="../../assets/blue-mountains.jpg" />
      <h2>示例</h2>
      <blockquote>
        <p>
          你试图做X，并想到了用Y方案。所以你去问别人Y，但根本不提X。于是，你可以会错过本来可能有更好更适合的方案，除非你告诉大家X是什么。
        </p>
        <p>
          —&nbsp;
          <i
            >from&nbsp;
            <a href="http://www.perlmonks.org/index.pl?node_id=430320">
              Re: How do I keep the command line from eating the backslashes? </a
            >&nbsp;by&nbsp;
            <a href="http://www.perlmonks.org/index.pl?node_id=163683">
              revdiablo
            </a>
          </i>
        </p>
      </blockquote>
      <blockquote>
        <p>
          有些人问怎么做Y，但其它他想做的是X。他问怎么做Y是因为他觉得Y是最好搞定X的方法。
          于是大家不断地回答“试试这个，试试那个”来帮助他，而他总是在说“这个有问题，那个有问题，因为……”。基本不同的情况，其它的方案可能会更好。
        </p>
        <p>
          —&nbsp;
          <i>
            from&nbsp;
            <a href="http://www.perlmonks.org/index.pl?node_id=327963">
              Re: Re: Re: Re: regex to validate e-mail addresses and phone
              numbers
            </a>
            &nbsp;by&nbsp;
            <a href="http://www.perlmonks.org/index.pl?node_id=180961">
              Limbic~Region
            </a>
          </i>
        </p>
      </blockquote>
      <blockquote>
        <p>
          X-Y
          Problem又叫“过早下结论”：提问者其实并不非常清楚想要解决的X问题，他猜测用Y可以搞定，于是他问大家如何实现Y。
        </p>
        <p>
          —&nbsp;
          <i
            >from&nbsp;
            <a
              href="https://groups.google.com/groups?hl=en&amp;selm=Pine.GHP.4.21.0009061210570.8800-100000@hpplus03.cern.ch"
            >
              &lt;Pine.GHP.4.21.0009061210570.8800-100000@hpplus03.cern.ch&gt;
            </a>
            &nbsp;by Alan J. Flavell
          </i>
        </p>
      </blockquote>
      <img class="article-image" src="../../assets/purple-mountains.jpg" />
      <div class="scroller">
        <ul class="scroller-inline">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>WebDev</li>
          <li>Animation</li>
          <li>UI/UX</li>
          <li>WebOps</li>
          <li>Nodejs</li>
          <li>NPM</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>WebDev</li>
          <li>Animation</li>
          <li>UI/UX</li>
          <li>WebOps</li>
          <li>Nodejs</li>
          <li>NPM</li>
        </ul>
        <ul class="scroller-inline scroller-inline-reverse">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>WebDev</li>
          <li>Animation</li>
          <li>UI/UX</li>
          <li>WebOps</li>
          <li>Nodejs</li>
          <li>NPM</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>WebDev</li>
          <li>Animation</li>
          <li>UI/UX</li>
          <li>WebOps</li>
          <li>Nodejs</li>
          <li>NPM</li>
        </ul>
      </div>
      <div class="image-list">
        <div class="image-item">
          <div class="image-info">
            <div class="image-info-header">蓝色水彩山水</div>
            <div class="image-info-footer">
              <div class="image-info-footer-link">pngtree.com</div>
              <div class="image-info-footer-icon">></div>
            </div>
          </div>
          <img src="../../assets/blue-mountains.jpg" />
        </div>
        <div class="image-item">
          <div class="image-info">
            <div class="image-info-header">紫色水彩山水</div>
            <div class="image-info-footer">
              <div class="image-info-footer-link">pngtree.com</div>
              <div class="image-info-footer-icon">></div>
            </div>
          </div>
          <img src="../../assets/purple-mountains.jpg" />
        </div>
        <div class="image-item">
          <div class="image-info">
            <div class="image-info-header">绿色水彩山水</div>
            <div class="image-info-footer">
              <div class="image-info-footer-link">pngtree.com</div>
              <div class="image-info-footer-icon">></div>
            </div>
          </div>
          <img src="../../assets/green-mountains.jpg" />
        </div>
      </div>
      <h2>一些变种</h2>
      <p>
        我们不要以为X-Y
        Problem就像上面那样的简单，我们不会出现，其实我们生活的这个世界有有各种X-Y
        Problem的变种。下面我个人觉得非常像XY Problem的总是：
      </p>
      <p style="padding-left: 30px">
        其一、大多数人有时候，非常容易把手段当目的，他们会用自己所喜欢的技术和方法来反推用户的需求，于是很有可能就会出现X-Y
        Problem &#8211;
        也许解决用户需求最适合的技术方案是PC，但是我们要让他们用手机。
      </p>
      <p style="padding-left: 30px">
        其二、产品经理有时候并不清楚他想解决的用户需求是什么，于是他觉得可能开发Y的功能能够满足用户，于是他提出了Y的需求让技术人员去做，但那根本不是解决X问题的最佳方案。
      </p>
      <p style="padding-left: 30px">
        其三、因为公司或部门的一些战略安排，业务部门设计了相关的业务规划，然后这些业务规划更多的是公司想要的Y，而不是解决用户的X问题。
      </p>
      <p style="padding-left: 30px">
        其四、对于个人的职业发展，X是成长为有更强的技能和能力，这个可以拥有比别人更强的竞争力，从而可以有更好的报酬，但确走向了Y：全身心地追逐KPI。
      </p>
      <p style="padding-left: 30px">
        其五、本来我们想达成的X是做出更好和更有价值的产品，但最终走到了Y：通过各种手段提升安装量，点击量，在线量，用户量来衡量。
      </p>
      <p style="padding-left: 30px">
        其六、很多团队Leader都喜欢制造信息不平等，并不告诉团队某个事情的来由，掩盖X，而直接把要做的Y告诉团队，导致团队并不真正地理解，而产生了很多时间和经历的浪费。
      </p>
      <p>
        所有的这些，在我心中都是X-Y Problem的变种，这是不是一种刻舟求剑的表现？
      </p>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Timeline",
};
</script>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const active = ref(1);
const handleAccordionChange = (e: MouseEvent) => {
  const index = Number(e.target?.dataset.index);
  if (!isNaN(index)) {
    active.value = index;
  }
};

onMounted(() => {
  window.addEventListener("keydown", (event) => {
    console.log(event.code);
  });
});
</script>

<style lang="scss" scoped>
.main-content {
  position: relative;
}
.scroll-watcher {
  position: fixed;
  top: 0;
  width: 100%;
  height: 10px;
  background-color: lime;
  z-index: 9;
  scale: 0 1;
  transform-origin: left;

  animation: scroll-watcher linear;
  animation-timeline: scroll();
}

@keyframes scroll-watcher {
  to {
    scale: 1 1;
  }
}

.article-header {
  position: relative;
  display: grid;
  place-items: center center;
  width: 100%;
  height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url(../../assets/header-bg.jpg);
  background-position: center center;
  background-size: cover;
  // filter: brightness(0.5);

  animation: fade-out linear;
  animation-timeline: view();
  animation-range: exit;
}

@keyframes fade-out {
  to {
    background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)),
      url(../../assets/header-bg.jpg);
  }
}

.header-content {
  width: 720px;
  color: #fff;
  font-size: 16px;
  line-height: 1.4;

  .article-title {
    font-size: 48px;
    font-weight: 600;
  }
}

.accordion-list {
  display: flex;
  justify-content: space-around;
  color: #f2f2f2;
  .accordion-item {
    flex-basis: 125px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-right: 20px;
    padding: 10px;
    height: 300px;
    border-radius: 8px;
    box-sizing: border-box;

    background: center/28rem no-repeat url(../../assets/weather-1.jpg);

    transition-property: flex-basis, padding, background-size;
    overflow: hidden;
  }
  .accordion-item,
  .accordion-item-week {
    transition-duration: 0.5s;
    transition-timing-function: ease-in-out;
  }
  .accordion-item:nth-child(2n) {
    background-image: url(../../assets/weather-2.jpg);
  }

  .accordion-item.active {
    flex-basis: 300px;
    cursor: auto;
  }
  .accordion-item:not(.active):hover {
    padding: 20px 10px;
    background-size: 36rem;
  }
}

.article-content {
  padding: 20px 20%;
  text-align: left;
  color: #fff;
  background-color: #0e0e0e;

  .article-image {
    width: 100%;
    object-fit: contain;
    animation: fade-in linear;
    animation-timeline: view();
  }

  @keyframes fade-in {
    from {
      scale: 0.8;
      opacity: 0;
    }
    to {
      scale: 1;
      opacity: 1;
    }
  }

  blockquote {
    margin: 0.5em;
    padding: 0.5em 1em;
    border-left: 5px solid #455a64;
    background: #212121;
  }

  .scroller {
    width: 100%;
    overflow: hidden;
    mask: linear-gradient(
      90deg,
      transparent,
      white 20%,
      white 80%,
      transparent
    );

    .scroller-inline {
      display: flex;
      flex-wrap: nowrap;
      width: max-content;
      list-style: none;

      animation: scrolling linear;
      animation-timeline: scroll(root);

      @keyframes scrolling {
        from {
          transform: translate(-10%);
        }
        to {
          transform: translate(-50%);
        }
      }

      li {
        margin-right: 10px;
        padding: 10px;
        border-radius: 4px;
        background-color: #212121;
      }
    }
    .scroller-inline-reverse {
      animation-direction: reverse;
    }
  }

  .image-list {
    display: flex;
    justify-content: space-around;
    .image-item {
      position: relative;
      flex: 1;
      overflow: hidden;
      .image-info {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 2;

        .image-info-header {
          font-size: 24px;
          font-weight: 600;
          transform: translate3d(0, -3rem, 0);
          transition-property: opacity, transform;
        }
        .image-info-footer {
          width: 100%;
          display: inline-flex;
          justify-content: center;

          font-size: 14px;
          transform: translate3d(0, 3rem, 0);
          transition-property: opacity, transform;

          .image-info-footer-icon {
            margin-left: 40px;
            opacity: 0;
            transform: translate3d(-2rem, 0, 0);
            transition-property: opacity, transform;
            transition-delay: 0.5s;
          }
        }
      }

      img {
        width: 100%;
        object-fit: contain;
        transform: scale(1.2);
        transition-property: transform;
      }
      .image-info-header,
      .image-info-footer,
      .image-info-footer-icon,
      img {
        transition-duration: 0.5s;
        transition-timing-function: ease-in-out;
      }
    }
    .image-item:hover {
      .image-info {
        background: linear-gradient(
          180deg,
          rgba(21, 22, 24, 0.24) 0%,
          rgba(21, 22, 24, 1) 100%
        );
        opacity: 1;
        .image-info-header {
          transform: translate3d(0, 0, 0);
        }
        .image-info-footer {
          transform: translate3d(0, 0, 0);
        }
        .image-info-footer-icon {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
      img {
        transform: scale(1);
      }
    }
    .image-item + .image-item {
      margin-left: 10px;
    }
  }
}
</style>
