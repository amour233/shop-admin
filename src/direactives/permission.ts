import { useUserStore } from "@/stores/user"

function hasPermission(value, el) {
  if (!Array.isArray(value)) {
    throw new Error(`需要配置权限，例如v-permission="['getStatistics3,GET']"`)
  }
  const userStore = useUserStore()
  const hasAuth = value.findIndex(v => userStore.ruleNames.includes(v)) != -1
  if (el && !hasAuth){
    el.remove()
  }
  return hasAuth
}


export default {
  install(app) {
    app.directive('permission', {
      mounted(el, binding) {
        hasPermission(binding.value, el)
      },
    })
  }
}
