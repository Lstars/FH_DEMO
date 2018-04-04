<template>
  <div class="app-container">
    <el-input placeholder="Filter keyword" v-model="filterText" style="margin-bottom:30px;"></el-input>

   <!--  <el-tree class="filter-tree" :data="data2" :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2"></el-tree> -->
  <div class="dialog-info">
    <intelligentDevice @closeOverlay="closeOverlay" :isShow="layer_showInfo2"></intelligentDevice>
  </div>
  </div>
</template>

<script>
import intelligentDevice from './components/intelligentDevice'
export default {
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    closeOverlay() {
      this.layer_showInfo2 = false;
    }
  },
  components: { intelligentDevice },
  data() {
    return {
      filterText: '',
      layer_showInfo2: true
    }
  }
}
</script>

