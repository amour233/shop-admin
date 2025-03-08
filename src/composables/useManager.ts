import { ref, reactive } from 'vue'
import { updatePassword } from '@/api/manager'
import type { ElForm, FormRules } from 'element-plus'
import { showModel, toast } from './utils'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { logout } from '@/api/manager'
import FormDrawer from '@/components/formDrawer.vue'

export function useRepassword() {
  const userStore = useUserStore()
  const router = useRouter()
  // 修改密码
  const formDrawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
  const form = reactive({
    oldpassword: '',
    password: '',
    repassword: '',
  })

  const formRef = ref<InstanceType<typeof ElForm>>()
  const rules = reactive<FormRules<typeof form>>({
    oldpassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 3, max: 6, message: '密码长度在3-5之间', trigger: 'blur' },
    ],
    repassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }],
  })

  const onSubmit = () => {
    formRef.value?.validate((valid) => {
      if (form.password !== form.repassword) {
        toast('两次密码输入不一致', 'error')
        return
      }
      if (valid) {
        if (formDrawerRef.value) formDrawerRef.value.showLoading()
        updatePassword(form)
          .then(() => {
            toast('修改密码成功，请重新登录', 'success')
            userStore.logout()
            router.push('/login')
          })
          .finally(() => {
            if (formDrawerRef.value) formDrawerRef.value.hideLoading()
          })
      }
    })
  }
  const openRepasswordForm = () => {
    if (formDrawerRef.value) formDrawerRef.value.open()
  }

  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRepasswordForm,
  }
}

// 退出登录
export function useLogout() {
  const userStore = useUserStore()
  const router = useRouter()
  function handleLogout() {
    showModel('是否要退出登录').then(() => {
      logout().finally(() => {
        userStore.logout()
        router.push('/login')
        toast('退出登录成功', 'success')
      })
    })
  }
  return { handleLogout }
}
