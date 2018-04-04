<template>
  <div>
    <el-dialog
      title="智能设备"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose">
      <div class="container">
        <el-tabs v-model="activeName" type="border-card">
          <el-tab-pane v-for="(item,index) in tabMapOptions" :label="item" :key='index' :name="item">
          <doorControlRecord v-if='index===0'></doorControlRecord>
          <managementRoomRights v-else-if='index===1'></managementRoomRights>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span style='margin-top: 10px;display:block'>
        说明：APP开门权限只能控制APP，无法控制密码；若要停用密码请删除密码；密码数量：25个（包括未删除、失效、未生效）个别门锁暂不支持远程删除密码，需要通过管家APP删除
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import doorControlRecord from './doorControlRecord'
  import managementRoomRights from './managementRoomRights'
  export default {
    components: { 
      doorControlRecord,
      managementRoomRights
    },
    data() {
      return {
        dialogVisible: false,
        tabMapOptions: ['开门记录', '权限管理'],
        activeName: '开门记录',
        pageItems: {
          pageNo: 1,
          pageSize: 20
        },
        pageSizeList: [10, 20, 30, 50],
        total: null,
      };
    },
    methods: {
      handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    }
  };
</script>