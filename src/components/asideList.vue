<template>
  <div class="aside-list" :class="{ active: active }">
    <span class="list-title"><slot /></span>
    <el-button class="list-btn1" text type="primary" size="small" @click.stop="$emit('edit')">
      <el-icon :size="12"><Edit /></el-icon>
    </el-button>
    <span @click.stop="() => {}">
      <el-popconfirm
        title="是否要删除该分类?"
        confirm-button-text="确认"
        cancel-button-text="取消"
        @confirm.stop="$emit('delete')"
      >
        <template #reference>
          <el-button class="list-btn2" text type="primary" size="small">
            <el-icon :size="12"><Close /></el-icon>
          </el-button>
        </template>
      </el-popconfirm>
    </span>
  </div>
</template>
<script setup lang="ts">
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['edit', 'delete'])
</script>
<style lang="less" scoped>
.aside-list {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f4f4f4;
  font-size: 14px;
  line-height: 20px;
  color: rgba(75, 85, 99);
  cursor: pointer;
}
.aside-list:hover,
.active {
  background-color: rgba(239, 246, 255);
}
.list-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-btn1 {
  margin-left: auto;
}
.list-btn1,
.list-btn2 {
  padding: 4px;
}
</style>
