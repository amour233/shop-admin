<template>
  <el-card shadow="never" class="border-0">
    <!--新增 || 刷新-->
    <ListHeader @create="handleCreate" @refresh="getData(currentPage)" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" width="380" />
      <el-table-column label="状态" width="120">
        <template #default="{ row }">
          <el-switch
            :modelValue="row.status"
            :active-value="1"
            :inactive-value="0"
            :loading="row.statusLoading"
            :disabled="row.super == 1"
            @change="handleStatusChange($event, row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" text @click="openSetRule(scope.row)"
            >配置权限</el-button
          >
          <el-button type="primary" size="small" text @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否要删除该用户?"
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
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>

    <!--权限配置-->

    <FormDrawer ref="setRuleFormDrawerRef" title="权限设置" @submit="handleSetRuleSubmit">
      <el-tree-v2
        node-key="id"
        ref="elTreeRef"
        style="max-width: 600px"
        :default-expanded-keys="defaultExpandedKeys"
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHeight"
        :check-strictly="checkStrictly"
        @check="handleTreeCheck"
      >
        <template #default="{ data }">
          <div class="rule-menus">
            <el-tag type="success" size="small">
              {{ data.menu == 1 ? '菜单' : '权限' }}
            </el-tag>
            <span class="rule-text">
              {{ data.name }}
            </span>
          </div>
        </template>
      </el-tree-v2>
    </FormDrawer>
  </el-card>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { getRole, createRole, updateRole, deleteRole, updateRoleStatus, steRoleRules } from '@/api/role'
import { getRuleList } from '@/api/rule'
import FormDrawer from '@/components/formDrawer.vue'
import type { ElForm, ElTree, FormRules } from 'element-plus'
import { toast } from '@/composables/utils'
import ListHeader from '@/components/listHeader.vue'
import type { roleList, ruleMenus, checkedList, rule_ids } from '@/types'

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
  getRole(currentPage.value)
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
  deleteRole(id)
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
  name: '',
  desc: '',
  status: 1,
})
const rules = reactive<FormRules<typeof form>>({
  name: [{ required: true, message: '名字不能为空', trigger: 'blur' }],
  desc: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
})
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      formDrawerRef.value?.showLoading()
      const fun = editId.value ? updateRole(editId.value, form) : createRole(form)
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
function resetForm(row: { name: string; desc: string; status: number }) {
  formRef.value?.validate()
  form.name = row.name
  form.desc = row.desc
  form.status = row.status
}
// 新增
const handleCreate = () => {
  editId.value = 0
  const name = ''
  const desc = ''
  const status = 1
  resetForm({ name, desc, status })
  formDrawerRef.value?.open()
}
// 修改
const handleEdit = (row: roleList) => {
  editId.value = row.id
  resetForm({ ...row })
  formDrawerRef.value?.open()
}
// 状态修改
const handleStatusChange = (status: number, row: roleList) => {
  row.statusLoading = true
  updateRoleStatus(row.id, status)
    .then(() => {
      toast('修改成功')
      row.status = status
    })
    .finally(() => {
      row.statusLoading = false
    })
}
// 权限配置
const setRuleFormDrawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
const elTreeRef = ref<InstanceType<typeof ElTree>>()
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const checkStrictly = ref(false)
const ruleIds = ref()
const defaultExpandedKeys = ref([])
const openSetRule = (row: roleList) => {
  roleId.value = row.id
  checkStrictly.value = true
  treeHeight.value = window.innerHeight - 170
  getRuleList().then((res) => {
    ruleList.value = res.data.list
    defaultExpandedKeys.value = res.data.list.map((o: ruleMenus) => o.id)
    setRuleFormDrawerRef.value?.open()
    // 获取当前用户拥有的权限
    ruleIds.value = row.rules.map((o:rule_ids) => o.id)
    setTimeout(() => {
      elTreeRef.value?.setCheckedKeys(ruleIds.value)
      checkStrictly.value = false
    }, 150)
  })
}
const handleSetRuleSubmit = () => {
  setRuleFormDrawerRef.value?.showLoading()
  steRoleRules(roleId.value, ruleIds.value).then(() => {
    toast('配置成功')
    getData(1)
    setRuleFormDrawerRef.value?.close()
  }).finally(() => {
    setRuleFormDrawerRef.value?.hideLoading()
  })
}
const handleTreeCheck = (...e: Array<checkedList>) => {
  const { checkedKeys, halfCheckedKeys} = e[1]
  ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
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
.rule-menus {
  display: flex;
  align-items: center;
}
.rule-text {
  margin-left: 8px;
  font-size: 14px;
  line-height: 20px;
}
</style>
