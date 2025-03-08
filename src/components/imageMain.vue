<template>
  <el-main class="image-main">
    <div class="top">
      <el-row :gutter="10">
        <el-col :span="6" :offset="0" v-for="(item, index) in list" :key="index">
          <el-card
            shadow="hover"
            class="image-card"
            :body-style="{ padding: 0 }"
          >
            <el-image
              :src="item.url"
              fit="cover"
              class="image-show"
              :preview-src-list="[item.url]"
              :initial-index="0"
            ></el-image>
            <div class="image-title">{{ item.name }}</div>
            <div class="image-btn">
              <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)" />

              <el-button type="primary" size="small" text @click="handleClick(item)"
                >重命名</el-button
              >
              <el-popconfirm
                title="是否要删除该图片?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(item.id)"
              >
                <template #reference>
                  <el-button type="primary" size="small" text>删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-main>

  <el-drawer v-model="drawer" title="上传图片" destroy-on-close>
    <UploadFile :data="{ image_class_id: imageClassId }" @success="handleUploadSuccess" />
  </el-drawer>
</template>
<script setup lang="ts">
import { getImageList, updateImage, deleteImage } from '@/api/image.ts'
import type { imageList, changeNameResponse } from '@/types/imageList'
import { showPrompt, toast } from '@/composables/utils'
import { computed, ref } from 'vue'
import UploadFile from './uploadFile.vue'

// 上传图片
const drawer = ref(false)
const openUploadFile = () => (drawer.value = true)

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const list = ref<Array<imageList>>([])
const loading = ref(false)
const imageClassId = ref(0)

function getData(p: number) {
  if (typeof p == 'number') {
    currentPage.value = p
  }
  loading.value = true
  getImageList(imageClassId.value, currentPage.value)
    .then((res) => {
      list.value = res.data.list.map((o: imageList) => {
        ;(o as imageList & { checked: boolean }).checked = false
        return o
      })
      total.value = res.data.totalCount
    })
    .finally(() => {
      loading.value = false
    })
}

// 根据分类id加载图片
const loadData = (id: number) => {
  currentPage.value = 1
  imageClassId.value = id
  getData(1)
}

// 重命名
const handleClick = (item: imageList) => {
  showPrompt('重命名', item.name).then((res: changeNameResponse) => {
    loading.value = true
    updateImage(item.id, res.value)
      .then(() => {
        toast('修改成功')
        getData(currentPage.value)
      })
      .finally(() => {
        loading.value = false
      })
  })
}

// 删除
const handleDelete = (id: number) => {
  loading.value = true
  deleteImage([id])
    .then(() => {
      toast('删除成功')
      getData(currentPage.value)
    })
    .finally(() => {
      loading.value = false
    })
}

// 上传成功
const handleUploadSuccess = () => {
  getData(1)
  drawer.value = false
}

defineProps({
  openChoose:{
    type: Boolean,
    default: false
  }
})

// 选中的图片
const checkedImage = computed(() => list.value.filter((o) => o.checked))
const emit = defineEmits(['choose'])
const handleChooseChange = (item: imageList) => {
  if (item.checked && checkedImage.value.length > 1) {
    item.checked = false
    return toast('最多只能选中一张', 'error')
  }
  emit('choose', checkedImage.value)
}

defineExpose({
  loadData,
  openUploadFile,
})
</script>
<style lang="less" scoped>
.image-main {
  position: relative;
}
.image-main .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
  padding: 12px;
}
.image-main .bottom {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  align-items: center;
  justify-content: center;
}
.image-card {
  position: relative;
  padding: 0;
  margin-bottom: 12x;
}
.image-show {
  width: 100%;
  height: 150px;
}
.image-title {
  position: absolute;
  top: 122px;
  left: -1px;
  right: -1px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: rgba(31, 41, 55);
  font-size: 14px;
  line-height: 20px;
  overflow: hidden;
  -o-text-overflow: ellipsis;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(243, 244, 246);
  --tw-bg-opacity: 0.5;
}
.image-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;
}
</style>
