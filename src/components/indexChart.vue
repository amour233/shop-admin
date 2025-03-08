<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            :checked="current == item.value"
            style="margin-right: 8px"
            v-for="(item, index) in options"
            :key="index"
            @click="handleChange(item.value)"
          >
            {{ item.text }}
          </el-check-tag>
        </div>
      </div>
    </template>
    <div ref="el" id="chart" style="width: 100%; height: 300px"></div>
  </el-card>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getStatistics3 } from '@/api/index'
import { useResizeObserver } from '@vueuse/core'

const current = ref('week')
const options = [
  {
    text: '近一个月',
    value: 'month',
  },
  {
    text: '近一周',
    value: 'week',
  },
  {
    text: '近24小时',
    value: 'hour',
  },
]
const handleChange = (type: string) => {
  current.value = type
  getData()
}

let myChart: echarts.ECharts = null
onMounted(() => {
  const chartDom = document.getElementById('chart')
  if (chartDom) {
    myChart = echarts.init(chartDom)
    getData()
  }
})
onBeforeUnmount(() => {
  if (myChart) {
    echarts.dispose(myChart)
  }
})

function getData() {
  const option = {
    xAxis: {
      type: 'category',
      data: [],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [],
        type: 'bar',
      },
    ],
  }
  myChart.showLoading()
  getStatistics3(current.value)
    .then((res) => {
      option.xAxis.data = res.data.x
      option.series[0].data = res.data.y
      myChart.setOption(option)
    })
    .finally(() => {
      myChart.hideLoading()
    })
}

const el = ref(null)
useResizeObserver(el, () => myChart.resize())
</script>
<style lang="less" scoped></style>
