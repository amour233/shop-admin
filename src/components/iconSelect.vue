<template>
  <div class="icon-select">
    <el-icon :size="20" v-if="modelValue" class="selected-show">
      <component :is="modelValue" />
    </el-icon>
    <el-select
      :model-value="modelValue"
      placeholder="请选择图标"
      filterable
      style="width: 240px; margin: 8px"
      @change="handleChange"
    >
      <el-option v-for="item in icons" :key="item" :label="item" :value="item">
        <div class="icon-show">
          <el-icon>
            <component :is="item" />
          </el-icon>
          <span class="icon-name">{{ item }}</span>
        </div>
      </el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import * as iconList from '@element-plus/icons-vue'

const icons = ref(Object.keys(iconList))
defineProps({
  modelValue: String,
})

const emit = defineEmits(['update:modelValue'])
const handleChange = (icon: string) => {
  emit('update:modelValue', icon)
}
</script>
<style lang="less" scoped>
.icon-select {
  display: flex;
  align-items: center;
}
.selected-show {
  margin-right: 8px;
}
.icon-show {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon-name {
  color: rgba(107, 114, 128);
}
</style>
