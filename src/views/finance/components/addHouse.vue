<template>
	<div>
	  <el-dialog title="录入房源并申请金融" :visible.sync="layer_showInfo" width="840px" @close="dialogClose">
	    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="140px" size="small">
        <el-form-item label="房源类型">
          <el-radio v-model="ruleForm.radio" label="1">集中式</el-radio>
          <el-radio v-model="ruleForm.radio" label="2">分散式合租</el-radio>
          <el-radio v-model="ruleForm.radio" label="3">分散式整租</el-radio>
        </el-form-item>
	      <div class="clearfix">
	        <el-col :span="12">
            <el-form-item label="房源所在地区">
              <area-select v-model="ruleForm.zone" :props="prop"></area-select>
            </el-form-item>
	        </el-col>
	        <el-col :span="12">
            <el-form-item label="公寓/小区" prop="subdistrictName">
              <el-input v-model.trim="ruleForm.subdistrictName"></el-input>
            </el-form-item>
	        </el-col>
	      </div>

	      <div class="clearfix">
	        <el-col :span="12">
            <el-form-item label="房源具体地址" prop="addressName" >
              <el-input v-model.trim="ruleForm.addressName"></el-input>
            </el-form-item>
	        </el-col>
            <el-col :span="4">
              <el-form-item label="楼幢" prop="buildingName" label-width="60px">
                <el-input v-model.trim="ruleForm.buildingName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="单元" prop="unitCode" label-width="60px">
                <el-input v-model.trim="ruleForm.unitCode"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="楼层" prop="floorName" label-width="60px">
                <el-input v-model.trim="ruleForm.floorName"></el-input>
              </el-form-item>
            </el-col>
	      </div>
	      <div class="clearfix">
          <el-form-item label="房源所属门店" >
            <el-input v-model.trim="ruleForm.storeName"></el-input>
          </el-form-item>
        </div>
        <div class="clearfix border" v-for="(item,index) in ruleForm.params" v-show="ruleForm.radio != 3 || index == 0 ">
          <div class="clearfix">
            <el-col :span="10">
              <el-form-item label="房间号" >
                <el-input v-model.trim="item.roomName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="户型">
                <el-col :span="8">
                  <el-input v-model.trim="item.roomNum">
                    <template slot="append">室</template>
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-input v-model.trim="item.hallNum">
                    <template slot="append">厅</template>
                  </el-input>
                </el-col>
                <el-col :span="8">
                  <el-input v-model.trim="item.toiletNum">
                    <template slot="append">卫</template>
                  </el-input>
                </el-col>
              </el-form-item>
            </el-col>
          </div>
          <div class="clearfix">
            <el-col :span="10">
              <el-form-item label="面积" >
                <el-input v-model.trim="item.area">
                  <template slot="append">m²</template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="房间照片">
              <el-button type="primary" size="small" @click="upload(index)">上传照片（{{item.pictureList.length}}）</el-button>
              </el-form-item>
            </el-col>
          </div>
        </div>
	    </el-form>
	    <div slot="footer" class="dialog-footer">
        <el-button @click="layer_showInfo = false" size="small">取 消</el-button>
	    	<el-button type="primary" size="small" @click="handleSaveData">确 定</el-button>
	    </div>
	  </el-dialog>


    <el-dialog
      title="上传房间照片"
      :visible.sync="layer_photo" width="700px"
      @close="closePhoto">
      <el-upload
        :action="`${actionBaseUrl}/util/upload/uploadPicture`"
        :before-upload="pictureUpload"
        :on-preview="picturePreview"
        :on-change="resetFile"
        :on-error="pictureError"
        :on-success="pictureSuccess"
        :file-list="fileList"
        :on-remove="pictureRemove"
        multiple
        accept="image/jpg,image/jpeg,image/png"
        list-type="picture-card">
        <i class="el-icon-plus"></i>
      </el-upload>
      <div style="padding-top:10px">
        温馨提示：<br>
        1.请勿上传虚假、模糊、与房源信息无关、含有其他公司水印的照片；<br>
        2.房间照片最佳组合：卧室2~6张、公共区域1~4张、厨房1~3张、卫生间1~4张；<br>
        3.目前最多支持15张，支持JPG/JPEG/PNG，支持批量上传。
      </div>
    </el-dialog>
	</div>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import areaSelect from '@/components/AreaSelect'
import { addHouseApi } from '@/api/applyFinance'
import { parseTime, ObjectMap, deepClone } from '@/utils'
export default {
  name: 'addhouse',
  props: {
    type: {
      type: Number,
      default: 1
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    uuid: {
      default: ''
    }
  },
  components:{ areaSelect },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validateMobile(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      rules: {
        subdistrictName: [
          { required: true, message: '请输入公寓/小区', trigger: 'blur' }
        ],
        addressName: [
          { required: true, message: '请输入房源具体地址', trigger: 'blur' }
        ],
        buildingName: [
          { required: true, message: '请输入楼幢', trigger: 'blur' }
        ],
        unitCode: [
          { required: true, message: '请输入单元', trigger: 'blur' }
        ],
        floorName: [
          { required: true, message: '请输入楼层', trigger: 'blur' }
        ],
        roomName: [
          { required: true, message: '请输入房间号', trigger: 'blur' }
        ],
        area: [
          { required: true, message: '请输入面积', trigger: 'blur' }
        ]

      },
      prop: {
        value: 'label',
        children: 'children'
      },
      actionBaseUrl: 'https://api.mdguanjia.com/bop',
      ruleForm: {
        radio: '1',
        zone: [],
        accountName: '',
        housingId: 1,
        subdistrictName: '',
        addressName: '',
        buildingName: '',
        unitCode:'',
        floorName:'',
        storeName: '',
        leaseType: 1,
        houseType: 1,
        params: [
          {
            roomId: 1,
            roomName: '',
            area: '',
            roomNum: '',
            hallNum: '',
            toiletNum: '',
            roomType: '',
            rentTypeName: '磐谷分期·月付',
            rentFee: '999',
            depositFee: '999',
            rentTime: 12,
            houseState: 3,//1-已定，2-已租，3-未租
            pictureList:[]
          },
          {
            roomId: 2,
            roomName: '',
            area: '',
            roomNum: '',
            hallNum: '',
            toiletNum: '',
            roomType: '',
            rentTypeName: '磐谷分期·月付',
            rentFee: '999',
            depositFee: '999',
            rentTime: 12,
            houseState: 3,//1-已定，2-已租，3-未租
            pictureList:[]
          }
        ]
      },
      accountName: '',
      fileList: [],
      uploadIndex:0,//上传图片房间的下标
      layer_showInfo: false,
      layer_photo: false
    }
  },
  created() {
    this.layer_showInfo = this.isShow;
    this.defaultRuleForm = deepClone(this.ruleForm);
    this.accountName = this.uuid;
  },
  methods: {
    handleSaveData() {

      this.ruleForm.accountName = this.accountName;
      this.ruleForm.params.map(val => {
        val.roomType = `${val.roomNum || 0}-${val.hallNum || 0}-${val.toiletNum || 0}`
      })
      let deepForm = deepClone(this.ruleForm);
      if (deepForm.houseType == 2 && deepForm.leaseType == 1) {//分散式整租
        deepForm.params.splice(1,1);
      } else {//如果第二房间的数据没填就不传，后台偷懒这里自己处理
        var second = deepForm.params[1];
        if (second.roomName == '' || second.area == '' || second.roomType == '') {
          deepForm.params.splice(1,1);
        }
      }
      deepForm.params.map(key => {
        let pic = [];
        key.pictureList.map(val => {
          pic.push(val.url)
        });
        key.pictureList = pic;
      })
      addHouseApi(ObjectMap(deepForm)).then(response => {
        //保存数据到离线存储
        this.ruleForm.houseAddress = `${this.ruleForm.zone[0]} ${this.ruleForm.zone[1]} ${this.ruleForm.zone[2]}`;
        this.ruleForm.houseInfo = this.ruleForm.radio == 1
                                  ? this.ruleForm.subdistrictName
                                  : `${this.ruleForm.subdistrictName}-${this.ruleForm.buildingName}`;
        this.ruleForm.rentType = this.ruleForm.radio == 1
                                ? '集中式'
                                : this.ruleForm.radio == 2
                                ? '合租'
                                : '整租';
        this.ruleForm.status = '金融房源';
        this.$emit('addTable', this.ruleForm);
      }).catch(response => {

      })
    },
    dialogClose() {
      this.$emit('closeOverlay');
      this.$refs.ruleForm.clearValidate();
      this.ruleForm = deepClone(this.defaultRuleForm);
    },
    upload(index) {
      this.layer_photo = true;
      this.uploadIndex = index;
      this.fileList = deepClone(this.ruleForm.params[index].pictureList);
    },
    /* 上传图片 */
    pictureUpload(file){
      const isLt5M = file.size / 1024 / 1024 <= 5
      if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(file.type) == -1) {
        this.$message.error('请上传jpg/png的图片');
        return false;
      }
      if(!isLt5M){
        this.$message.error('请上传5Mb大小以内的图片');
        return false;
      }

    },
    closeDialog(){
      this.layer_showImage = false;
    },
    closePhoto() {
      this.fileList = [];
      this.layer_photo = false;
    },
    pictureRemove(file, fileList) {
      this.showPicUrl = '';
      let imgList = [];

      fileList.map(key => {
        if (key.response) {
          key.url = key.response.data[0];
        }
        imgList.push(key);
      })
      this.ruleForm.params[this.uploadIndex].pictureList = deepClone(imgList);

    },
    picturePreview(file) {
      this.showPicUrl = file.url;
      this.layer_showImage = true;
	  },
    pictureSuccess(response, file, fileList){
      this.ruleForm.params[this.uploadIndex].pictureList.push({'url':file.response.data[0]})
    },
    pictureError(err,file){
      file = null;
    },
    resetFile(file){
      file = null;
    },
    showPicUrlClose(){
      this.showPicUrl = '';
    }
  },
  watch: {
    isShow(val) {
      this.layer_showInfo = val;
    },
    'ruleForm.radio'(val) {
      if (val == '1') {
        this.ruleForm.houseType = 1;
        this.ruleForm.leaseType = 1;
      } else {
        this.ruleForm.houseType = 2;
        this.ruleForm.leaseType = val == '2' ? 2 : 1;
      }
    },
    uuid(val) {
      this.accountName = val;
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.border {
    border: 1px solid #ccc;
    padding: 10px 10px 10px 0;
    margin:10px 0;
  }
</style>
