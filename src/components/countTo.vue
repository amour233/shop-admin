<template>
  <div>
    {{ d.num.toFixed(0) }}
  </div>
</template>
<script setup lang="ts">
import gsap from 'gsap'
import { reactive, watch } from 'vue'

const props = defineProps({
  value:{
    type: Number,
    default: 0
  }
})

const d = reactive({
  num: 0
})

function AnimateTovalue(){
  gsap.to(d, {
    duration: 0.5,
    num: props.value
  })
}

AnimateTovalue()
watch(() => props.value, () => AnimateTovalue())
</script>
<style lang="less" scoped>
</style>
