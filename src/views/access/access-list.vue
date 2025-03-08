<template>
  <el-card shadow="never" class="access-list">
    <ListHeader @refresh="getData" @create="handleCreate" />
    <el-tree
      :data="tableData"
      :props="{label:'name', children: 'child'}"
      v-loading="loading"
      node-key="id"
      :default-expanded-keys="defaultExpandedKeys"
    >
      <template #default="{ data }">
        <div class="menu-list">
          <el-tag size="small"> {{ data.menu ? '菜单' : '权限' }} </el-tag>
          <el-icon v-if="data.icon" :size="16" class="menu-icon">
            <component :is="data.icon" />
          </el-icon>
          <span>{{ data.name }}</span>
          <div class="menu-status">
            <el-switch
              :modelValue="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleChange($event, data)"
            >
            </el-switch>
            <el-button text type="primary" size="small" @click.stop="handleEdit(data)"
              >修改</el-button
            >
            <el-button text type="primary" size="small" @click.stop="addChild(data.id)"
              >增加</el-button
            >
            <el-popconfirm
              title="是否要删除该记录?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm.stop="handleDelete(data.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>

    <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
      <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader
            v-model="form.rule_id"
            :options="options"
            :props="{
              value: 'id',
              label: 'name',
              children: 'child',
              checkStrictly: 'true',
              emitPath: 'false',
            }"
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :value="1" border>菜单</el-radio>
            <el-radio :value="0" border>规则</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" style="width: 30%" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <IconSelect v-model="form.icon" />
        </el-form-item>
        <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 0 && form.rule_id > 0">
          <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
        </el-form-item>
        <el-form-item label="后端规则" prop="condition" v-if="form.menu == 0">
          <el-input v-model="form.condition" placeholder="后端规则"></el-input>
        </el-form-item>
        <el-form-item label="请求方式" prop="method" v-if="form.menu == 0">
          <el-select
            v-model="form.method"
            placeholder="请选择请求方式"
            style="width: 240px; margin: 8px"
          >
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<script setup lang="ts">
import {
  getRuleList,
  createRuleList,
  updateRuleList,
  updateRuleStatus,
  deleteRule,
} from '@/api/rule'
import ListHeader from '@/components/listHeader.vue'
import type { ruleMenus, createRule } from '@/types'
import FormDrawer from '@/components/formDrawer.vue'
import { computed, reactive, ref } from 'vue'
import type { ElForm, FormRules } from 'element-plus'
import { toast } from '@/composables/utils'
import IconSelect from '@/components/iconSelect.vue'

const loading = ref(false)
const tableData = ref([])
const defaultExpandedKeys = ref([])
const editId = ref(0)
const options = ref([])

function getData() {
  loading.value = true
  getRuleList()
    .then((res) => {
      tableData.value = res.data.list
      options.value = res.data.rules
      defaultExpandedKeys.value = res.data.list.map((o: ruleMenus) => o.id)
    })
    .finally(() => (loading.value = false))
}
getData()
// 表单
const drawerTitle = computed(() => (editId.value ? '修改' : '新增'))
const formDrawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
const formRef = ref<InstanceType<typeof ElForm>>()
const form = reactive({
  rule_id: 0,
  menu: 0,
  name: '',
  condition: '',
  method: 'GET',
  status: 1,
  order: 50,
  icon: '',
  frontpath: '',
})
const rules = reactive<FormRules<typeof form>>({
  menu: [{ required: true, message: '菜单/规则不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '菜单/权限名称不能为空', trigger: 'blur' }],
})
const handleSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      formDrawerRef.value?.showLoading()
      const fun = editId.value ? updateRuleList(editId.value, form) : createRuleList(form)
      fun
        .then(() => {
          toast(drawerTitle.value + '成功')
          // 修改刷新当前页，新增刷新第一页
          getData()
          formDrawerRef.value?.close()
        })
        .finally(() => {
          formDrawerRef.value?.hideLoading()
        })
    }
  })
}
// 重置表单
function resetForm(id = 0, row: createRule) {
  formRef.value?.validate()
  if (id) {
    Object.assign(form, row)
  }
}

const handleCreate = () => {
  editId.value = 0
  resetForm(0, {
    rule_id: 0,
    menu: 0,
    name: '',
    condition: '',
    method: 'GET',
    status: 1,
    order: 50,
    icon: '',
    frontpath: '',
  })
  formDrawerRef.value?.open()
}
const handleEdit = (row: ruleMenus) => {
  console.log(row)
  editId.value = row.id
  resetForm(row.id, { ...row })
  formDrawerRef.value?.open()
}

const addChild = (id: number) => {
  handleCreate()
  form.rule_id = id
  form.status = 1
}
const handleChange = (status: number, row: ruleMenus) => {
    row.statusLoading = true
    updateRuleStatus(row.id, status)
      .then(() => {
        toast('修改成功')
        row.status = status
      })
      .finally(() => {
        row.statusLoading = false
      })
  }
const handleDelete = (id: number) => {
    loading.value = true
    deleteRule(id)
      .then(() => {
        toast('删除成功')
        getData()
      })
      .finally(() => {
        loading.value = false
      })
  }
</script>
<style lang="less" scoped>
.access-list {
  border-width: 0px;
}
:deep(.el-tree-node__content) {
  padding: 20px 0;
}
.menu-list {
  display: flex;
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.menu-icon {
  margin-left: 8px;
}
.menu-status {
  margin-left: auto;
}
</style>
