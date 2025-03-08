<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <AsideList
        :active="activeId == item.id"
        v-for="(item, index) in list"
        :key="index"
        @edit="handleEdit(item)"
        @delete="handelDelete(item.id)"
        @click="handleChangeActiveId(item.id)"
      >
        {{ item.name }}
      </AsideList>
    </div>
    <div class="bottom">
      <el-pagination
        background
        layout="prev, next"
        :total="total"
        :current-page="currentPage"
        :page-size="limit"
        @current-change="getData"
      />
    </div>
  </el-aside>
  <FormDrawer ref="formDrawerRef" @submit="handleSubmit" :title="drawerTitle">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" prop="name"></el-input>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import AsideList from '@/components/asideList.vue'
import {
  getImageClassList,
  createImageClass,
  updateImageClass,
  deleteImageClass,
} from '@/api/image-class'
import FormDrawer from './formDrawer.vue'
import { type nameList } from '@/types/imageList'
import type { ElForm, FormRules } from 'element-plus'
import { toast } from '@/composables/utils'

const activeId = ref(0)
const editId = ref(0)
const drawerTitle = computed(() => (editId.value ? '修改' : '新增'))
const list = ref<Array<nameList>>([])
const formDrawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 加载动画
const loading = ref(false)
// 获取数据
function getData(p: number) {
  if (typeof p == 'number') {
    currentPage.value = p
  }
  loading.value = true
  getImageClassList(currentPage.value)
    .then((res) => {
      list.value = res.data.list
      total.value = res.data.totalCount
      const item = list.value[0]
      if (item) {
        handleChangeActiveId(item.id)
      }
    })
    .finally(() => {
      loading.value = false
    })
}
getData(1)

// 表单部分
const form = reactive({
  name: '',
  order: 50,
})

const rules = reactive<FormRules<typeof form>>({
  name: [{ required: true, message: '图库分类名称不能为空', trigger: 'blur' }],
})
const formRef = ref<InstanceType<typeof ElForm>>()

const handleSubmit = () => {
  formRef.value
    ?.validate((valid) => {
      if (valid) {
        if (formDrawerRef.value) formDrawerRef.value.showLoading()
        const fun = editId.value ? updateImageClass(editId.value, form) : createImageClass(form)
        fun.then(() => {
          toast(drawerTitle.value + '成功')
          getData(editId.value ? currentPage.value : 1)
          if (formDrawerRef.value) formDrawerRef.value.close()
        })
      }
    })
    .finally(() => {
      if (formDrawerRef.value) formDrawerRef.value.hideLoading()
    })
}
// 新增
const handleCreate = () => {
  editId.value = 0
  form.name = ''
  form.order = 50
  if (formDrawerRef.value) formDrawerRef.value.open()
}

// 编辑
const handleEdit = (row: nameList) => {
  editId.value = row.id
  form.name = row.name
  form.order = row.order
  if (formDrawerRef.value) formDrawerRef.value.open()
}
// 删除
const handelDelete = (id: number) => {
  loading.value = true
  deleteImageClass(id)
    .then(() => {
      toast('删除成功')
      getData(1)
    })
    .finally(() => {
      loading.value = false
    })
}

const emit = defineEmits(['change'])

// 切换分类
function handleChangeActiveId(id: number) {
  activeId.value = id
  emit('change', id)
}

defineExpose({
  handleCreate,
})
</script>
<style lang="less" scoped>
.image-aside {
  border-right: 1px solid #eeeeee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  display: flex;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  align-items: center;
  justify-content: center;
}
</style>
