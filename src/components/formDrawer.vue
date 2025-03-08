<template>
  <el-drawer
    v-model="showDrawer"
    :title="title"
    :size="size"
    :destroy-on-close="destroyOnClose"
    :close-on-click-modal="false"
  >
    <div class="formDrawer">
      <div class="body">
        <slot :="props"></slot>
      </div>
      <div class="actions">
        <el-form-item>
          <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
          <el-button type="default" @click="close">取消</el-button>
        </el-form-item>
      </div>
    </div>
  </el-drawer>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps({
  title: String,
  size: {
    type: String,
    default: '45%',
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  confirmText: {
    type: String,
    default: '提交',
  }
})

const showDrawer = ref(false)
// 打开
const open = () => (showDrawer.value = true)
// 关闭
const close = () => (showDrawer.value = false)
// 提交
const emit = defineEmits(['submit'])
const submit = () => emit('submit')

const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false

// 向父组件暴露
defineExpose({
  props,
  open,
  close,
  showLoading,
  hideLoading
})
</script>
<style lang="less" scoped>
.formDrawer {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.formDrawer .body {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
.formDrawer .actions {
  height: 50px;
  display: flex;
  align-items: center;
  margin-top: auto;
}
</style>
