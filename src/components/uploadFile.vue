<template>
  <el-upload
    drag
    :action="upLoadImageAction"
    multiple
    :headers="{
      token
    }"
    name="img"
    :data="data"
    :on-success="uploadSuccess"
    :on-error="uploadError"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
</template>
<script setup lang="ts">
import { upLoadImageAction } from '@/api/image';
import { getToken } from '@/composables/auth';
import { toast } from '@/composables/utils';
import type { UploadFile, UploadFiles } from 'element-plus';

const token = getToken()

defineProps({
  data: Object
})

const emit = defineEmits(['success'])
const uploadSuccess = (response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  emit('success', {
    response,
    uploadFile,
    uploadFiles
  })
  toast('上传成功')
}
const uploadError = (error: Error) => {
  const msg = JSON.parse(error.message).msg || '上传失败'
  toast(msg, 'error')
}
</script>
<style lang="less" scoped></style>
