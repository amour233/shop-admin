<template>
  <el-row class="login">
    <!--左半部分-->
    <el-col :lg="16" :md="12" class="left">
      <div class="left-text">欢迎光临</div>
      <div class="mainText">此网站是vue3+ts+element plus 实战项目</div>
    </el-col>
    <!--右半登陆部分-->
    <el-col :lg="8" :md="12" class="right">
      <h2 class="rtitle">欢迎回来</h2>
      <div class="login-title">
        <span class="line"></span>
        <span>帐号密码</span>
        <span class="line"></span>
      </div>
      <el-form
        ref="formRef"
        :model="form"
        label-width="60px"
        style="max-width: 460px"
        :rules="rules"
        status-icon
      >
        <el-form-item label="帐号" prop="username">
          <el-input v-model="form.username">
            <template #prefix>
              <el-icon><UserFilled /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <el-form-item>
        <el-button
          type="primary"
          color="#626aef"
          round
          class="btn"
          @click="onSubmit"
          :loading="loading"
          >登录</el-button
        >
      </el-form-item>
    </el-col>
  </el-row>
  <div></div>
</template>
<script setup lang="ts">
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'
import type { IAccount } from '@/types/index'
import { type FormRules, type ElForm } from 'element-plus'
import { login } from '@/api/manager'

import { useRouter } from 'vue-router'
import { setToken } from '@/composables/auth'
import { toast } from '@/composables/utils'

const router = useRouter()
const loading = ref(false)
const form = reactive<IAccount>({
  username: '',
  password: '',
})


const formRef = ref<InstanceType<typeof ElForm>>()
const rules = reactive<FormRules<IAccount>>({
  username: [
    { required: true, message: '账户不能为空', trigger: 'blur' },
    { min: 3, max: 5, message: '长度要在3-5之间', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 3, max: 5, message: '密码长度要在3-5之间', trigger: 'blur' },
  ],
})

const onSubmit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      loading.value = true
      login(form.username, form.password).then((res) => {
        // 提示成功， 存储token, 跳转页面
        toast('登录成功', 'success')
        setToken(res.data.token)
        router.push('/')
      }).finally(() => {
        loading.value = false
      })
    }
  })
}
//监听回车事件
function onKeyUp(e: KeyboardEvent) {
  // console.log(e)
  if(e.key == "Enter") onSubmit()

}
//监听键盘事件
onMounted(() => {
  document.addEventListener("keyup", onKeyUp)
})
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp)
})
</script>
<style lang="less" scoped>
.login {
  min-height: 100vh;
  background-color: rgba(99, 102, 241);
}
.left {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.right {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(253, 253, 253);
  flex-direction: column;
}
.left-text {
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 48px;
  line-height: 1;
  color: rgba(253, 253, 253);
}
.mainText {
  color: rgb(229, 231, 235);
  font-size: 14px;
  line-height: 20px;
}
.rtitle {
  font-weight: 700;
  font-size: 30px;
  line-height: 36px;
  color: rgba(31, 41, 55);
}
.login-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 20px;
  color: rgba(209, 213, 219);
  margin-right: calc(0.5rem * var(--tw-space-x-reverse));
  margin-left: calc(0.5rem * calc(1 - var(--tw-space-x-reverse)));
}
.line {
  height: 1px;
  width: 64px;
  background-color: rgba(229, 231, 235);
}
.btn {
  width: 250px;
}
</style>
