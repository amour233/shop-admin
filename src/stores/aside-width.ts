import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAsideWidth = defineStore('asidewidth', () => {
  const asidewidth = ref('250px')
  // 展开或缩起侧边栏
  function handleAsideWidth(){
    if (asidewidth.value === '250px' ) asidewidth.value = '64px'
    else asidewidth.value = '250px'
  }

  return { asidewidth, handleAsideWidth}
})
