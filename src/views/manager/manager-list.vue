<template>
  <el-card shadow="never" class="card">
    <!--搜索-->
    <el-form :model="searchForm" label-width="80px" class="search" size="small">
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-form-item label="关键词">
            <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" :offset="8">
          <div class="search-btn">
            <el-button type="primary" @click="getData">搜索</el-button>
            <el-button @click="resetSearchForm">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <!--新增 || 刷新-->
    <ListHeader @create="handleCreate" @refresh="getData(currentPage)" />
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="管理员" width="200">
        <template #default="{ row }">
          <div class="card-avatar">
            <el-avatar :size="40" :src="row.avatar">
              <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
            </el-avatar>
            <div class="card-name">
              <h6>{{ row.username }}</h6>
              <small>ID:{{ row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="所属角色" align="center">
        <template #default="{ row }">
          {{ row.role?.name || '-' }}
        </template>
      </el-table-column>
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
      <el-table-column label="操作" width="180" align="center">
        <template #default="{ row }">
          <small v-if="row.super == 1" class="super-manager">暂无操作</small>
          <div v-else>
            <el-button type="primary" size="small" text @click="handleEdit(row)">修改</el-button>
            <el-popconfirm
              title="是否要删除该管理员?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm.stop="handleDelete(row.id)"
            >
              <template #reference>
                <el-button text type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </div>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <ChooseImage v-model="form.avatar" />
        </el-form-item>
        <el-form-item label="所属角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="选择所属角色">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0"> </el-switch>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </el-card>
</template>
<script setup lang="ts">
import FormDrawer from '@/components/formDrawer.vue'
import type { roles } from '@/types'
import type { ElForm } from 'element-plus'
import ChooseImage from '@/components/chooseImage.vue'
import { initTable } from '@/composables/mangagerList'
import ListHeader from '@/components/listHeader.vue'

const {
  roles,
  searchForm,
  resetSearchForm,
  tableData,
  loading,
  currentPage,
  total,
  limit,
  drawerTitle,
  getData,
  handleDelete,
  formDrawerRef,
  formRef,
  form,
  rules,
  handleSubmit,
  handleCreate,
  handleEdit,
  handleStatusChange,
} = initTable()
</script>
<style lang="less" scoped>
.card {
  border-width: 0px;
}
.search {
  margin-bottom: 12px;
}
.search-btn {
  display: flex;
  justify-content: end;
}
.super-manager {
  font-size: 14px;
  line-height: 20px;
  color: rgba(107, 114, 128);
}
.card-avatar {
  display: flex;
  align-items: center;
}
.card-name {
  margin-left: 12px;
}
.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
}
</style>
