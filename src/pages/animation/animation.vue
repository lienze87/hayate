<template>
  <div class="main-content">
    <div :class="`loading-box${loading ? '' : ' hidden'}`">
      <div class="loader"></div>
    </div>
    <div :class="`page-content${loading ? '' : ' visible'}`">
      <svg viewBox="0 0 450 450">
        <text x="50%" y="50%" dy=".32em" text-anchor="middle" class="text-body">
          Animation
        </text>
        <text
          x="50%"
          y="50%"
          dy=".32em"
          dx="2.6em"
          text-anchor="middle"
          class="text-body"
        >
          .
        </text>
      </svg>
      <div class="btn-list">
        <button
          :class="[
            'submit-button',
            submitting ? 'loading-button' : '',
            success ? 'success-button' : '',
          ]"
          @click="handleSubmit"
        >
          <span v-if="!submitting" class="button-text">{{
            success ? "Success" : "Submit"
          }}</span>
          <div v-else class="button-loader">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </button>
      </div>
      <div class="icon-list">
        <div
          :class="['menu-icon', opening ? 'menu-open' : '']"
          @click="handleOpenMenu"
        >
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div class="walking"></div>
      <div class="mouse-effect">
        <div class="mouse-info">
          <p>"cursorX": {{ mouseEventData.cursorX }}</p>
          <p>"boxLeft": {{ mouseEventData.boxLeft }}</p>
          <p>"cursorInsideButton": {{ mouseEventData.cursorInsideButton }}</p>
          <p>
            "relativeToTotalWidth": {{ mouseEventData.relativeToTotalWidth }}
          </p>
          <p>"shifted": {{ mouseEventData.shifted }}</p>
        </div>
        <button ref="magnetoRef" class="magneto" :style="magnetoTransition">
          <div
            ref="magnetoTextRef"
            class="magneto-text"
            :style="magnetoTextTransition"
          >
            About me
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Animation",
};
</script>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const loading = ref(true);
const submitting = ref(false);
const success = ref(false);
const opening = ref(false);

const magnetoRef = ref();
const magnetoTextRef = ref();
const magnetoTransition = ref("");
const magnetoTextTransition = ref("");
const mouseEventData = ref({
  cursorX: 0,
  boxLeft: 0,
  cursorInsideButton: 0,
  relativeToTotalWidth: "",
  shifted: "",
});

const handleSubmit = () => {
  submitting.value = true;
  success.value = false;
  setTimeout(() => {
    submitting.value = false;
    success.value = true;
  }, 3000);
};

const handleOpenMenu = () => {
  opening.value = !opening.value;
};

function initMouseEffect(element: HTMLElement) {
  const magnetoWeight = 40;
  const magnetoTextWeight = 80;
  element.addEventListener("mousemove", (e: MouseEvent) => {
    let boundBox = element.getBoundingClientRect();
    mouseEventData.value = {
      cursorX: e.clientX,
      boxLeft: Math.ceil(boundBox.left),
      cursorInsideButton: Math.ceil(e.clientX - boundBox.left),
      relativeToTotalWidth: (
        (e.clientX - boundBox.left) /
        element.offsetWidth
      ).toFixed(2),
      shifted: (
        (e.clientX - boundBox.left) / element.offsetWidth -
        0.5
      ).toFixed(2),
    };

    const newX = (e.clientX - boundBox.left) / element.offsetWidth - 0.5;
    const newY = (e.clientY - boundBox.top) / element.offsetHeight - 0.5;

    magnetoTransition.value = `transform: translate(${newX * magnetoWeight}px, ${newY * magnetoWeight}px);`;
    magnetoTextTransition.value = `transform: translate(${newX * magnetoTextWeight}px, ${newY * magnetoTextWeight}px);`;
  });
  element.addEventListener("mouseleave", (e: MouseEvent) => {
    mouseEventData.value = {
      cursorX: 0,
      boxLeft: 0,
      cursorInsideButton: 0,
      relativeToTotalWidth: "",
      shifted: "",
    };
    magnetoTransition.value = ``;
    magnetoTextTransition.value = ``;
  });
}

const lastKnownScrollPosition = ref(0);
let ticking = false;
const handleScrollChange = () => {};

onMounted(() => {
  window.addEventListener("keydown", (event) => {
    console.log(event.code);
  });
  document.addEventListener("scroll", (event) => {
    lastKnownScrollPosition.value = window.scrollY;

    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScrollChange();
        ticking = false;
      });

      ticking = true;
    }
  });
  initMouseEffect(magnetoRef.value);
  setTimeout(() => {
    loading.value = false;
  }, 3000);
});
</script>

<style lang="scss">
:root {
  --loader-text-color: #d9b6b6;
}
</style>
<style lang="scss" scoped>
.main-content {
  position: relative;
}
.loading-box {
  position: absolute;
  display: grid;
  place-content: center;
  width: 100vw;
  height: 100vh;
  z-index: 9;
  .loader {
    width: 4em;
    height: 4em;
    border: 10px solid #f27541;
    border-left-color: transparent;
    border-right-color: transparent;
    border-radius: 50%;
    animation: 0.8s loading-rotate ease infinite alternate;
  }
}
.loading-box.hidden {
  opacity: 0;
  visibility: hidden;
}
@keyframes loading-rotate {
  from {
    transform: rotate(0) scale(1);
  }
  to {
    transform: rotate(360deg) scale(1.2);
  }
}
.page-content {
  padding: 20px;
  text-align: center;

  background-color: rgb(22, 24, 23);
  opacity: 0;
  transform: translate3d(0, -1rem, 0);
  transition:
    opacity 0.6s ease-in-out,
    transform 0.6s ease-in-out;

  svg {
    width: 20rem;
    font-weight: 700;

    text {
      font-size: 5rem;
      stroke-width: 2;
    }
    text.text-body {
      stroke: var(--loader-text-color);
      animation: animate-stroke 4s infinite alternate;
    }
  }
  @keyframes animate-stroke {
    0% {
      fill: transparent;
      stroke: var(--loader-text-color);
      stroke-width: 3;
      stroke-dashoffset: 25%;
      stroke-dasharray: 0 32%;
    }
    50% {
      fill: transparent;
      stroke: var(--loader-text-color);
      stroke-width: 3;
    }
    80%,
    100% {
      fill: var(--loader-text-color);
      stroke: transparent;
      stroke-width: 0;
      stroke-dashoffset: -25%;
      stroke-dasharray: 32% 0;
    }
  }

  .btn-list {
    display: grid;
    place-content: center;
    gap: 20px;
    width: 100%;
  }

  .submit-button {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 240px;
    height: 48px;

    font-size: 21px;
    line-height: 48px;
    color: #fff;

    border: none;
    border-radius: 12px;
    background-color: #409eff;

    cursor: pointer;
  }
  .loading-button {
    color: #409eff;
  }
  .success-button {
    background-color: #67c23a;
  }
  .button-loader {
    display: flex;
    justify-content: space-around;
    align-items: center;
    div {
      width: 0.8rem;
      height: 0.8rem;
      background-color: #fff;
      border-radius: 50%;
      animation: scaleUp 1.2s infinite ease-in-out;
    }
    div:nth-child(1) {
      animation-delay: -0.4s;
    }
    div:nth-child(2) {
      animation-delay: -0.2s;
    }

    @keyframes scaleUp {
      0%,
      80%,
      100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  }

  .mouse-effect {
    display: flex;
    justify-content: center;
    .mouse-info {
      margin-right: 20px;
      min-width: 240px;
      text-align: left;
      color: #fff;
      p {
        margin: 5px;
      }
    }
  }

  .magneto {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 10rem;
    height: 10rem;
    color: white;
    border-radius: 50%;
    border: none;
    background-color: #383434;
    cursor: pointer;
    transition: transform 1s ease-out;
    .magneto-text {
      transition: transform 1s ease-out;
    }
  }
  .magneto:hover {
    background-color: #409eff;
  }

  .icon-list {
    display: flex;
    justify-content: center;
  }
  .menu-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: 20px;
    width: 60px;
    height: 32px;

    div {
      width: 100%;
      height: 5px;
      border-radius: 2px;
      background-color: #fff;
      transition:
        transform 0.5s ease-in-out,
        opacity 0.5s ease-in-out;
    }
  }
  .menu-open {
    div:nth-child(1) {
      transform: translate3d(0, 14px, 0) rotate(45deg);
    }
    div:nth-child(2) {
      transform: scaleX(0);
      opacity: 0;
    }
    div:nth-child(3) {
      transform: translate3d(0, -14px, 0) rotate(-45deg);
    }
  }

  .walking {
    margin: 20px auto;
    width: 240px;
    height: 200px;
    background-image: url(../../assets/purple-mountains.jpg);
    background-size: cover;
    background-repeat: no-repeat;
    animation: walking 2s steps(5) infinite alternate;
  }
  @keyframes walking {
    to {
      background-position: 100%;
    }
  }
}
.page-content.visible {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
</style>
