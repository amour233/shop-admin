import { defineStore } from 'pinia'
import { getInfo } from '@/api/manager'
import { removeToken } from '@/composables/auth'
import { ref } from 'vue'

interface UserInfo {
  id?: number
  username?: string
  avatar?: string
}


export const useUserStore = defineStore('userinfo', () => {
  const userInfo = ref<UserInfo>({})
  const menus = ref()
  const ruleNames = ref()
  function setUserInfo(user: object) {
    userInfo.value = user
  }

  function getUserInfo() {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((res) => {
          setUserInfo(res.data)
          setMenus(res.data.menus)
          setRuleNames(res.data.ruleNames)
          resolve(res.data)
        })
        .catch((err) => reject(err))
    })
  }
  function logout() {
    // 清除token
    removeToken()
    // 清除状态
    userInfo.value = {}
  }
  function setMenus(menu: []) {
    menus.value = menu
  }
  function setRuleNames(ruleName: []) {
    ruleNames.value = ruleName
  }
  return { userInfo, menus, ruleNames, setUserInfo, getUserInfo, logout, setMenus, setRuleNames }
})
