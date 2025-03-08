<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-title">
        <span>{{ title }}</span>
        <el-tag type="danger" effect="plain">
          {{ tip }}
        </el-tag>
      </div>
    </template>
    <el-row :gutter="20">
      <el-col :span="6" :offset="0" v-for="(item, index) in btns" :key="index">
        <el-card shadow="hover" class="card-main">
          <div class="card-text">
            <span class="content-title">{{ item.value }}</span>
            <span class="content-text">{{ item.label }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>
<script setup lang="ts">

interface cardList {
  value: string,
  label: string
}

defineProps({
  title: String,
  tip: String,
  btns: Array<cardList>
})
</script>
<style lang="less" scoped>
.card-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 20px;
}
.card-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.card-main {
  border-width: 0;
  background-color: rgba(246, 246, 246);
}
.content-title {
  font-size: 20px;
  line-height: 28px;
  margin-bottom: 8px;
}
.content-text {
  font-size: 12px;
  line-height: 16px;
  color: rgba(107, 114, 128);
}
</style>
