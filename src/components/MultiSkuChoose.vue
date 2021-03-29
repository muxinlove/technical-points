<template>
  <div class="container">
    <p>多属性sku选择窗口</p>
    <div
      v-for="({title, list}, index) in specList"
      :key='index'
      class='group'
    >
      <p class="title">{{title}}
      <p>
      <div
        class="spec-box"
        v-for='(value, i) in list'
        :key='i'
      >
        <span
          class='spec-text'
          :class="{
            'spec-option':isOption(value),
            'spec-active':isActive(value),
            'spec-disabled':!isOption(value)
          }"
          @click='handleClick(value, index)'
        >{{value}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import specAdjoinMatrix from '../utils/adjoin-martix.js'

const specCombinationList = [
  { id: "1", specs: ["紫色", "套餐一", "64G"] },
  { id: "2", specs: ["紫色", "套餐一", "128G"] },
  { id: "3", specs: ["紫色", "套餐二", "128G"] },
  { id: "4", specs: ["红色", "套餐二", "256G"] }]

export default {
  data() {
    return {
      specList: [
        { title: "颜色", list: ["红色", "紫色"] },
        { title: "套餐", list: ["套餐一", "套餐二"] },
        { title: "内存", list: ["64G", "128G", "256G"] }
      ],
      // 已选择的规格，长度为规格列表的长度s
      specsS: [],
      // 创建一个规格矩阵
      specAdjoinMatrix: {},
      // 获得可选项表
      optionSpecs: []
    }
  },
  created() {
    this.specsS = Array(this.specList.length).fill("")
    this.specAdjoinMatrix = new specAdjoinMatrix(this.specList, specCombinationList);
    this.initOptionSpecs()
  },
  methods: {
    initOptionSpecs() {
      this.optionSpecs = this.specAdjoinMatrix.getSpecscOptions(this.specsS);
    },
    isOption(value) {
      // 当前规格是否可选
      return this.optionSpecs.includes(value)
    },
    isActive(value) {
      // 当前规格是否可选
      return this.specsS.includes(value)
    },
    handleClick(text, index) {
      const bool = this.isOption(text)
      // 排除可选规格里面没有的规格
      if (this.specsS[index] !== text && !bool) return;
      // 根据text判断是否已经被选中了
      this.specsS[index] = this.specsS[index] === text ? "" : text;
      // slice 这是为了触发更新
      this.specsS = this.specsS.slice()

      this.initOptionSpecs()
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  border: 1px solid #ccc;
  padding: 20px;
  .group {
    display: flex;
    align-items: center;
    .spec-box {
      margin-left: 10px;
      .spec-text {
        padding: 4px 10px;
        border: 1px solid #dcdcdc;
        display: block;
        cursor: pointer;
        &.spec-active {
          border-color: #000;
        }
        &.spec-disabled {
          border-style: dashed;
          cursor: not-allowed;
          color: #dcdcdc;
        }
      }
    }
  }
}
</style>
