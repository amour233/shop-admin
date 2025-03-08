<template>
  <el-container class="image-box" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="small" @click="handelOpenCreate">
        新增图片分类
      </el-button>
      <el-button type="warning" size="small" @click="handelOpenUpload">
        上传图片
      </el-button>
    </el-header>
    <el-container>
      <ImageAside ref="imageAsideRef" @change="handleAsideChange"/>
      <ImageMain ref="imageMainRef"/>
    </el-container>
  </el-container>
</template>
<script setup lang="ts">
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'
import { ref } from 'vue'

const windowHeight = window.innerHeight || document.body.clientHeight
const h = windowHeight - 64 - 44 - 40

const imageAsideRef = ref<InstanceType<typeof ImageAside> | null>(null)
const imageMainRef = ref<InstanceType<typeof ImageMain> | null>(null)
const handelOpenCreate = () => {
  if (imageAsideRef.value) imageAsideRef.value.handleCreate()
}

const handleAsideChange = (imageClassId: number) => {
  if (imageMainRef.value) {
    imageMainRef.value.loadData(imageClassId)
  }
}

const handelOpenUpload = () =>
{
  if (imageMainRef.value) imageMainRef.value.openUploadFile()
}
</script>
<style lang="less" scoped>
.image-box {
  background-color: white;
  border-radius: 4px;
}
.image-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eeeeee;
}
</style>
