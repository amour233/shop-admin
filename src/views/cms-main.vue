<template>
  <div class="main">
    <el-row :gutter="20" v-permission="['getStatistics1,GET']">
      <template v-if="panels.length == 0">
        <el-col :span="6" :offset="0" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="card">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>
      <el-col :span="6" :offset="0" v-for="(item, index) in panels" :key="index">
        <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="card-title">
              <span>{{ item.title }}</span>
              <el-tag :type="item.unitColor || 'success'" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <span class="card-main">
            <CountTo :value="item.value"/>
          </span>
          <el-divider />
          <div class="card-bottom">
            <span>{{ item.subTitle }}</span>
            <span> {{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <IndexNav/>
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <IndexChart v-permission="['getStatistics3,GET']"/>
      </el-col>
      <el-col :span="12" :offset="0" v-permission="['getStatistics2,GET']">
        <IndexCard title="店铺及商品提示" tip="店铺及商品提示" :btns="goods" style="margin-bottom: 18px;"/>
        <IndexCard title="交易提示" tip="需要立即处理的订单" :btns="order"/>
      </el-col>
    </el-row>


  </div>
</template>
<script setup lang="ts">
import { getStatistics1, getStatistics2 } from '@/api/index'
import { ref } from 'vue'
import CountTo  from '@/components/countTo.vue'
import IndexNav  from '@/components/indexNav.vue'
import IndexChart  from '@/components/indexChart.vue'
import IndexCard  from '@/components/indexCard.vue'

interface panelsList {
  title: string,
  unitColor: string,
  value: number,
  unit: string,
  subTitle: string,
  subValue: number
}

const panels = ref<Array<panelsList>>([])

getStatistics1().then((res) => {
  panels.value = res.data.panels
})

const goods = ref([])
const order = ref([])
getStatistics2().then(res => {
  goods.value = res.data.goods
  order.value = res.data.order
})
</script>
<style lang="less" scoped>
.main {
  background-color: rgba(243, 244, 246);
}
.card {
  border-width: 0;
  margin-bottom: 20px;
}
.card-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 20px;
}
.card-main {
  font-size: 30px;
  line-height: 36px;
  font-weight: 700;
  color: rgba(107, 114, 128);
}
.card-bottom {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  line-height: 20px;
  color: rgba(107, 114, 128);
}
</style>
