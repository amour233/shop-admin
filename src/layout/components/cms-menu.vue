<template>
  <div class="cms-menu" :style="{ width: asideWidthStore.asidewidth }">
    <el-menu
      :default-active="defaultActive"
      :collapse="isCollapse"
      class="el-menu-vertical-demo"
      style="border: 0"
      @select="handleSelect"
      :collapse-transition="false"
      unique-opened
    >
      <template v-for="(item, index) in asideMenus" :key="index">
        <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
          <template #title>
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <span>{{ item.name }}</span>
          </template>
          <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath"
            ><el-icon>
              <component :is="item2.icon"></component>
            </el-icon>
            <span>{{ item2.name }}</span>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item v-else :index="item.frontpath">
          <el-icon>
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useAsideWidth } from '@/stores/aside-width'
import { useUserStore } from '@/stores/user'
import { computed, ref } from 'vue'

const router = useRouter()
const route = useRoute()
const asideWidthStore = useAsideWidth()
const userStore = useUserStore()
const asideMenus = computed(() => userStore.menus)

// url和菜单关联
const defaultActive = ref(route.path)

// 监听路由变化
onBeforeRouteUpdate((to) => {
  defaultActive.value = to.path
})


// 是否折叠
const isCollapse = computed(() => !(asideWidthStore.asidewidth === '250px'))

const handleSelect = (e: string) => {
  router.push(e)
}
</script>
<style lang="less" scoped>
.cms-menu {
  position: fixed;
  top: 64px;
  bottom: 0;
  left: 0;
  background-color: rgba(253, 253, 253);
  box-shadow:
    var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
  overflow-y: auto;
  overflow-x: hidden;
  transition: all 0.2s;
}
.cms-menu::-webkit-scrollbar {
  width: 0px;
}
</style>
