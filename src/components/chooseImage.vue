<template>
  <div v-if="modelValue">
    <el-image :src="modelValue" fit="cover" class="show-img"></el-image>
  </div>
  <div class="choose-image-btn" @click="open">
    <el-icon :size="25" class="btn-icon"><Plus /></el-icon>
  </div>
  <el-dialog title="选择图片" v-model="dialogVisiable" width="80%" top="5vh">
    <el-container class="image-box" style=" height: 70vh;">
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
      <ImageMain openChoose ref="imageMainRef" @choose="handleChoose"/>
    </el-container>
  </el-container>
    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import ImageAside from '@/components/imageAside.vue'
import ImageMain from '@/components/imageMain.vue'
import type { imageList } from '@/types'

const dialogVisiable = ref(false)
const open = () => dialogVisiable.value = true
const close = () => dialogVisiable.value = false

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

const handelOpenUpload = () => imageMainRef.value?.openUploadFile()

defineProps({
  modelValue: [String, Array]
})

const emit = defineEmits(['update:modelValue'])
let urls:string = ''
const handleChoose = (e:Array<imageList>) => {
  urls = e[0].url
}

const submit = () => {
  if(urls) {
    emit('update:modelValue', urls)
  }
  close()
}
</script>
<style lang="less" scoped>
.show-img {
  height: 100px;
  width: 100px;
  border-radius: 4px;
  border-width: 1px;
  margin-right: 8px;
}
.choose-image-btn {
  display: flex;
  width: 100px;
  height: 100px;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-radius: 4px;
  cursor: pointer;
}
.choose-image-btn:hover {
  background-color: rgba(243, 244, 246);
}
.btn-icon {
  color: rgba(107, 114, 128);
}
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
