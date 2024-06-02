<template>
  <div class="main-content">
    <div id="controls">
      <p>camera position</p>
      <p>angle: {{ cameraInfo.angle }}</p>
      <p>
        x:
        <el-slider
          v-model="cameraInfo.rotate.x"
          :min="0"
          :max="6.28"
          :step="0.01"
          @input="handleRotate('x')"
        ></el-slider>
      </p>
      <p>
        y:
        <el-slider
          v-model="cameraInfo.rotate.y"
          :min="0"
          :max="6.28"
          :step="0.1"
          @input="handleRotate('y')"
        ></el-slider>
      </p>
      <p>
        z:
        <el-slider
          v-model="cameraInfo.rotate.z"
          :min="0"
          :max="Math.PI * 2"
          :step="0.1"
          @input="handleRotate('z')"
        ></el-slider>
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const CAMERA_SPEED = 0.3;
const cameraInfo = ref({
  fov: 75,
  aspect: window.innerWidth / window.innerHeight,
  near: 0.1,
  far: 1000,
  rotate: new THREE.Vector3(0, 0, 0),
  angle: 0,
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(cameraInfo.value.fov, cameraInfo.value.aspect, 1, 10000);
camera.position.z = 2500;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

const geometry = new THREE.BoxGeometry(2, 2, 2);

const cube = new THREE.Mesh(geometry, [
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
  new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }),
]);
cube.position.z = 150;
scene.add(cube);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const cameraPerspective = new THREE.PerspectiveCamera(
  cameraInfo.value.fov,
  cameraInfo.value.aspect,
  250,
  cameraInfo.value.far,
);

cameraPerspective.lookAt(cube.position);
scene.add(cameraPerspective);

const cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
scene.add(cameraPerspectiveHelper);

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  cameraPerspectiveHelper.update();

  renderer.render(scene, camera);
}

const handleRotate = (axis: string) => {
  const x_axis = new THREE.Vector3(1, 0, 0).normalize();
  const y_axis = new THREE.Vector3(0, 1, 0).normalize();
  const z_axis = new THREE.Vector3(0, 0, 1).normalize();
  let targetAxis = new THREE.Vector3(0, 0);
  let angle = 0;
  if (axis === 'x') {
    targetAxis = x_axis;
    angle = cameraInfo.value.rotate.x;
  } else if (axis === 'y') {
    targetAxis = y_axis;
    angle = cameraInfo.value.rotate.y;
  } else if (axis === 'z') {
    targetAxis = z_axis;
    angle = cameraInfo.value.rotate.z;
  }

  const quaternion = new THREE.Quaternion();
  camera.position.applyQuaternion(quaternion.setFromAxisAngle(targetAxis, angle));
};

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
  function handleKeyDownEvent(event: KeyboardEvent) {
    console.log(event.code);
  }

  window.addEventListener('keydown', handleKeyDownEvent);
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
  right: 20px;
  padding: 10px;
  color: #fff;
  background-color: #302d2d;
  p {
    margin: 5px;
  }
}
</style>
