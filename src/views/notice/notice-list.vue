<template>
  <el-card shadow="never" class="border-0">
    <!--新增 || 刷新-->
    <ListHeader @create="handleCreate" @refresh="getData(currentPage)" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="发布时间" width="380" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            text
            @click="handleEdit(scope.row.id, scope.row.title, scope.row.content)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否要删除该公告?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm.stop="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

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
    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            placeholder="公告内容"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { getNotice, createNotice, updateNotice, deleteNotice } from '@/api/notice'
import FormDrawer from '@/components/formDrawer.vue'
import type { ElForm, FormRules } from 'element-plus'
import { toast } from '@/composables/utils'
import ListHeader from '@/components/listHeader.vue'

const tableData = ref([])
const loading = ref(false)
// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

const editId = ref(0)
const drawerTitle = computed(() => (editId.value ? '修改' : '新增'))
// 获取数据
function getData(p: number) {
  if (typeof p == 'number') {
    currentPage.value = p
  }
  loading.value = true
  getNotice(currentPage.value)
    .then((res) => {
      tableData.value = res.data.list
      total.value = res.data.totalCount
    })
    .finally(() => {
      loading.value = false
    })
}
getData(1)
// 删除
const handleDelete = (id: number) => {
  loading.value = true
  deleteNotice(id)
    .then(() => {
      toast('删除成功')
      getData(1)
    })
    .finally(() => {
      loading.value = false
    })
}

// 表单部分
const formDrawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
const formRef = ref<InstanceType<typeof ElForm>>()
const form = reactive({
  title: '',
  content: '',
})
const rules = reactive<FormRules<typeof form>>({
  title: [{ required: true, message: '公告标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '公告内容不能为空', trigger: 'blur' }],
})
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      formDrawerRef.value?.showLoading()
      const fun = editId.value ? updateNotice(editId.value, form) : createNotice(form)
      fun
        .then(() => {
          toast(drawerTitle.value + '成功')
          // 修改刷新当前页，新增刷新第一页
          getData(editId.value ? currentPage.value : 1)
          formDrawerRef.value?.close()
        })
        .finally(() => {
          formDrawerRef.value?.hideLoading()
        })
    }
  })
}
// 重置表单
function resetForm(row: { title: string; content: string }) {
  formRef.value?.validate()

  form.title = row.title
  form.content = row.content
}

// 新增
const handleCreate = () => {
  editId.value = 0
  const title = ''
  const content = ''
  resetForm({ title, content })
  formDrawerRef.value?.open()
}
// 修改
const handleEdit = (id: number, title: string, content: string) => {
  editId.value = id
  resetForm({ title, content })
  formDrawerRef.value?.open()
}
</script>
<style lang="less" scoped>
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
