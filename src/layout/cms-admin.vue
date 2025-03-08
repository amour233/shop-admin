<template>
  <el-container class="cms-admin">
    <el-header>
      <cmsHeader />
    </el-header>
    <el-container>
      <el-aside :width="asideWidthStore.asidewidth">
        <cmsMenu />
      </el-aside>
      <el-main>
        <cmsTagList />
        <RouterView v-slot="{ Component }">
          <transition name="fade">
            <keep-alive :max="10">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </RouterView>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import cmsHeader from './components/cms-header.vue'
import cmsMenu from './components/cms-menu.vue'
import cmsTagList from './components/cms-tagList.vue'
import { useAsideWidth } from '@/stores/aside-width'

const asideWidthStore = useAsideWidth()
</script>
<style lang="less" scoped>
.cms-admin {
  background-color: rgba(243, 244, 246);
}
.el-aside {
  transition: all 0.2s;
}
.fade-enter-from {
  opacity: 0;
  transform: translate3d(0, -100%, 0);
}
.fade-enter-to {
  opacity: 1;
  transform: translate3d(0, 0, 0);
}
.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
  transform: translate3d(0, 100%, 0);
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
}
.fade-enter-active {
  transition-delay: 0.3s;
}
</style>
