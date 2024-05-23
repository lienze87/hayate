<template>
  <div class="detail-container">
    <SideBar>
      <Anchor key="模块1" :title="'模块1'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块1</span></h3>
            </div>
            <div style="height: 400px">内容</div>
          </div>
        </div>
      </Anchor>
      <Anchor key="模块2" :title="'模块2'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块2</span></h3>
            </div>
            <div style="height: 300px">内容</div>
          </div>
        </div>
      </Anchor>
      <Anchor key="模块3" :title="'模块3'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块3</span></h3>
            </div>
            <div style="height: 600px">内容</div>
          </div>
        </div>
      </Anchor>
      <Anchor key="模块4" :title="'模块4'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块4</span></h3>
            </div>
            <div style="height: 200px">内容</div>
          </div>
        </div>
      </Anchor>
      <Anchor key="模块5" :title="'模块5'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块5</span></h3>
            </div>
            <div style="height: 600px">内容</div>
          </div>
        </div>
      </Anchor>
      <Anchor key="模块6" :title="'模块6'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块6</span></h3>
            </div>
            <div style="height: 400px">内容</div>
          </div>
        </div>
      </Anchor>
      <Anchor key="模块7" :title="'模块7'">
        <div class="app-container">
          <div class="base shadow">
            <div class="title">
              <h3><span>模块7</span></h3>
            </div>
            <div style="height: 600px">内容</div>
          </div>
        </div>
      </Anchor>
    </SideBar>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TocNavbar',
});
</script>

<script lang="ts" setup>
import Anchor from '@/components/toc-navbar/anchor.vue';
import SideBar from '@/components/toc-navbar/index.vue';
</script>

<style lang="scss" scoped>
.detail-container {
  position: relative;
  padding: 0 20px;
}
.app-container {
  border: 1px solid #ccc;
}
</style>
