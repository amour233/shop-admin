<template>
  <div class="cms-header">
    <span class="logo">
      <el-icon style="margin-right: 4px"><TrendCharts /></el-icon>
      前端实战
    </span>
    <el-icon class="icon-btn" @click="asideWidthStore.handleAsideWidth()">
      <Fold v-if="asideWidthStore.asidewidth == '250px'" />
      <Expand v-else />
    </el-icon>
    <el-tooltip effect="dark" content="刷新" placement="bottom">
      <el-icon class="icon-btn" @click="handleRefresh"><Refresh /></el-icon>
    </el-tooltip>
    <div class="right">
      <el-tooltip effect="dark" content="全屏" placement="bottom">
        <el-icon class="icon-btn" @click="toggle">
          <FullScreen v-if="!isFullscreen" />
          <aim v-else />
        </el-icon>
      </el-tooltip>
      <el-dropdown class="dropdown" @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar style="margin-right: 8px" :size="25" :src="userStore.userInfo.avatar" />
          {{ userStore.userInfo.username }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <FormDrawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
    <el-form
      ref="formRef"
      :model="form"
      label-width="200px"
      :rules="rules"
      status-icon
      size="small"
    >
      <el-form-item label="请输入旧密码" prop="oldpassword">
        <el-input v-model="form.oldpassword"> </el-input>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="password">
        <el-input v-model="form.password" show-password> </el-input>
      </el-form-item>
      <el-form-item label="请输入确认密码" prop="repassword">
        <el-input v-model="form.repassword" show-password> </el-input>
      </el-form-item>
    </el-form>
  </FormDrawer>
</template>
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { useUserStore } from '@/stores/user'
import { useAsideWidth } from '@/stores/aside-width'
import type { ElForm } from 'element-plus'
import FormDrawer from '@/components/formDrawer.vue'
import { useRepassword, useLogout } from '@/composables/useManager'

const userStore = useUserStore()
const asideWidthStore = useAsideWidth()
const el = useTemplateRef<HTMLElement>('el')
// 是否全屏，切换全屏
const { isFullscreen, toggle } = useFullscreen(el)

const { formDrawerRef, form, rules, formRef, onSubmit, openRepasswordForm } = useRepassword()
const { handleLogout } = useLogout()

const handleCommand = (c: string) => {
  switch (c) {
    case 'logout':
      handleLogout()
      break
    case 'rePassword':
      openRepasswordForm()
      break
  }
}

// 页面刷新
const handleRefresh = () => location.reload()
</script>
<style lang="less" scoped>
.cms-header {
  display: flex;
  height: 64px;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  align-items: center;
  background-color: rgba(67, 56, 202);
  color: rgba(253, 253, 253);
  z-index: 1000;
}
.right {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.logo {
  display: flex;
  margin-left: 18px;
  width: 150px;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  line-height: 28px;
  font-weight: 100;
}
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 64px;
  cursor: pointer;
}
.icon-btn:hover {
  background-color: rgba(79, 70, 229);
}
.cms-header .dropdown {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  cursor: pointer;
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  color: rgba(253, 253, 253);
}
.reset-btn {
  display: flex;
  bottom: 0;
}
</style>
