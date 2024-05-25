<template>
  <div class="main-content">
    <div id="controls">
      <p>direction: {{ deviceInfo.direction }}</p>
      <p>x: {{ deviceInfo.y }}</p>
      <p>y: {{ deviceInfo.x }}</p>
      <p>z: {{ deviceInfo.z }}</p>
      <p>alpha: {{ deviceInfo.alpha }}</p>
      <p>beta: {{ deviceInfo.beta }}</p>
      <p>gamma: {{ deviceInfo.gamma }}</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1).toNonIndexed();
const material = new THREE.MeshBasicMaterial({ vertexColors: true });

const positionAttribute = geometry.getAttribute('position');

const colors = [];
const color = new THREE.Color();

for (let i = 0; i < positionAttribute.count; i += 3) {
  color.set(Math.random() * 0xffffff);

  // define the same color for each vertex of a triangle

  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
  colors.push(color.r, color.g, color.b);
}
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.02;
  controls.update();
  renderer.render(scene, camera);
}

const deviceInfo = ref({
  direction: 'vertical',
  x: 0,
  y: 0,
  z: 0,
  alpha: 0,
  beta: 0,
  gamma: 0,
});

/**
 * 设备坐标系是相对于设备中心的
 * x 轴沿着屏幕表面，向右为正，向左为负。
 * y 轴沿着屏幕表面，向上为正，向下为负。
 * z 轴垂直屏幕表面或键盘，远离屏幕的方向为正。
 * 旋转描述的是设备在设备坐标系跟地球坐标系中任意轴上的差异值，用角度表示。
 * 围绕 z 轴旋转设备,即在当前水平面旋转，将使 alpha 角度值发生变化
 * alpha 为 0° 时表示设备的顶部正指北极方向，当设备向左旋转时，alpha 将增加
 * 围绕 x 轴旋转，也就是前后旋转，将使 beta 值发生改变
 * 当 beta 为 0° 时表示设备顶部和底部与地表面的距离是一样的，当设备向前翻转时，beta 递增到 180°，向后翻转递减到 -180°。
 * 当围绕 y 轴旋转，也就是左右倾斜设备时，将使 gamma 值发生改变
 * gamma 等于 0° 表示设备左右两边与地表面的距离相等，当设备向右翻转时，gamma 递增到 90° ，向左翻转时，递减到 -90°。
 */

function initListener() {
  function handleMotionEvent(event: DeviceMotionEvent) {
    const x = event.accelerationIncludingGravity.x;
    const y = event.accelerationIncludingGravity.y;
    const z = event.accelerationIncludingGravity.z;

    deviceInfo.value = { ...deviceInfo.value, x, y, z };
    // Do something awesome.
    console.log(x, y, z);
  }
  // rotateDegrees,frontToBack, leftToRight,
  function handleOrientationEvent(event: DeviceOrientationEvent) {
    ElMessage.warning('是否支持运动检测：' + event.absolute);
    const alpha = event.alpha;
    const beta = event.beta;
    const gamma = event.gamma;

    deviceInfo.value = { ...deviceInfo.value, alpha, beta, gamma };
  }

  window.addEventListener('devicemotion', handleMotionEvent, true);

  window.addEventListener('deviceorientation', handleOrientationEvent, true);
}

onMounted(() => {
  const target = document.querySelector('.main-content');
  target.appendChild(renderer.domElement);
  initListener();
  animate();
});
</script>
<style lang="scss" scoped>
.main-content {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
#controls {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 10px;
  color: #fff;
  background-color: #302d2d;
  p {
    margin: 5px;
  }
}
</style>
