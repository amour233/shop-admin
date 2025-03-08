<template>
  <div class="f-tag-list" :style="{ left: asideWidth.asidewidth }">
    <el-tabs
      v-model="activeTab"
      type="card"
      class="flex-1"
      @tab-remove="removeTab"
      style="min-width: 100px"
      @tab-change="changeTab"
    >
      <el-tab-pane
        :closable="item.path != '/'"
        v-for="item in tabList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
      ></el-tab-pane>
    </el-tabs>

    <span class="tag-btn">
      <el-dropdown @command="handleClose">
        <span class="el-dropdown-link">
          <el-icon>
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="clearOther">关闭其他</el-dropdown-item>
            <el-dropdown-item command="clearAll">全部关闭</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
  <div style="height: 44px"></div>
</template>
<script setup lang="ts">
import { useTablist } from '@/composables/useTablist.ts'
import { useAsideWidth } from '@/stores/aside-width'


const asideWidth = useAsideWidth()
const { activeTab, tabList, changeTab, removeTab, handleClose } = useTablist()
</script>
<style scoped>
.f-tag-list {
  display: flex;
  position: fixed;
  align-items: center;
  background-color: rgba(243, 244, 246);
  padding-left: 8px;
  padding-right: 8px;
  top: 64px;
  right: 0;
  height: 44px;
  z-index: 100;
}
.tag-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  background-color: rgba(255, 255, 255);
  padding-left: 8px;
  padding-right: 8px;
  border-radius: 4px;
  height: 32px;
}
:deep(.el-tabs__header) {
  border: 0 !important;
  margin-bottom: 0px;
}
:deep(.el-tabs__nav) {
  border: 0 !important;
}
:deep(.el-tabs__item) {
  border: 0 !important;
  height: 32px;
  line-height: 32px;
  background-color: white;
  margin-left: 4px;
  margin-right: 4px;
  border-radius: 4px;
}
:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
  line-height: 32px;
  height: 32px;
}
:deep(.is-disabled) {
  cursor: not-allowed;
  background-color: rgba(209, 213, 219);
}
</style>
