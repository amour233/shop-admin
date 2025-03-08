<template>
  <div class="card-header">
      <el-button type="primary" size="small" @click="$emit('create')">新增</el-button>
      <el-tooltip effect="dark" content="刷新数据" placement="top">
        <el-button text @click="$emit('refresh')">
          <el-icon :size="20"><Refresh /></el-icon>
        </el-button>
      </el-tooltip>
    </div>

</template>
<script  setup lang="ts">

defineEmits(['create', 'refresh'])
</script>
<style lang="less">
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
