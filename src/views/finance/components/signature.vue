<template>
	<div>
	  <el-dialog title="电子签章" :visible.sync="layer_showInfo" width="840px" @close="dialogClose">
	    <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="140px" size="small">
	      <div class="clearfix">
	        <el-col :span="12">
            <el-form-item v-if="layerType == 1" label="实名认证" >
              <el-input
              v-model="ruleForm.name"
              disabled
              ></el-input>
            </el-form-item>
            <el-form-item v-if="layerType == 2" label="企业名称" >
              <el-input
              v-model="ruleForm.company"
              disabled
              ></el-input>
            </el-form-item>
	        </el-col>
	        <el-col :span="12">
            <el-form-item label="合同联系电话">
              <el-input v-model.trim="ruleForm.mobile" disabled></el-input>
            </el-form-item>
	        </el-col>
	      </div>

	      <div class="clearfix" v-if="layerType == 2">
	        <el-col :span="12">
	            <el-form-item label="社会统一信用代码" disabled>
	                <el-input
	                v-model.trim="ruleForm.companyNo"
	                ></el-input>
	            </el-form-item>
	        </el-col>
	        <el-col :span="12">
	            <el-form-item label="法人身份证">
	                <el-input v-model.trim="ruleForm.cardNo" disabled></el-input>
	            </el-form-item>
	        </el-col>
	      </div>
	      <div class="clearfix">
	        <el-form-item :label="layerType == 1 ? '您的电子签名' : '企业电子签名'" >
	            <el-button type="info" size="mini">未使用</el-button>
	        </el-form-item>
	      </div>
	      <div :class="{clearfix: true,hideUpload: isHideUpload}">
	        <el-form-item>
	          <el-upload
	            :action="`${actionBaseUrl}/util/upload/uploadPicture`"
	            :before-upload="pictureUpload"
	            :on-preview="picturePreview"
	            :on-change="resetFile"
	            :on-error="pictureError"
	            :on-success="pictureSuccess"
	            :file-list="fileList"
	            :on-remove="pictureRemove"
              :limit="1"
	            accept="image/jpg,image/jpeg,image/png"
	            list-type="picture-card">
	            <i class="el-icon-plus"></i>
	            <div slot="tip" class="el-upload__tip">点击确定后，会提交审核申请</div>
	          </el-upload>
	        </el-form-item>
	      </div>
	      <div class="clearfix">
	      	<el-checkbox v-model="ruleForm.checked">
	      	我已阅读并同意</el-checkbox>
	      	<span class="attorney" @click="lookAttorney">《电子签章授权委托书》</span>并生成电子签名/签章用于签署在线房租合同、分期协议
	      </div>

	    </el-form>
	    <div slot="footer" class="dialog-footer">
        <el-button @click="layer_showInfo = false" size="small">取 消</el-button>
	    	<el-button type="primary" size="small" @click="handleSaveData">确 定</el-button>
	    </div>
	  </el-dialog>

    <el-dialog
      title="查看协议"
      :visible.sync="layer_attorney" width="800px"
      @close="layer_attorney = false">
      <div class="protocolDiv">
	      <h4 class="text-center">电子签章授权委托书</h4>
	      <br />
	      <p style="margin-left:2em;">
          兹授权<span class="underline weight"> 杭州复恒科技有限公司 </span>
          在<span class="underline weight red"> {{attorneyData.name}} </span>与租客签约时，调用电子签名完成自动签约。
	      </p>
	      <p style="margin-left:2em;">
          在上述授权范围内，<span class="underline weight"> 杭州复恒科技有限公司 </span>
          有权代表<span class="underline weight red"> {{attorneyData.name}} </span>
          在租房合同、分期协议上调用签名进行在线签约。
	      </p>
	      <p>如因该授权委托产生的一切经营风险和法律风险，由
	        <span class="underline weight red"> {{attorneyData.name}} </span>自行承担。
	      </p>
	      <p style="margin-left:2em;">本授权书不可以转授权。</p>
	      <p style="margin-left:2em;">
          以上授权的有效期限为
          <span class="underline weight red"> {{attorneyData.onlineContractEffectiveDateStr}} </span> 至
          <span class="underline weight red"> {{attorneyData.onlineContractIneffectiveDateStr}} </span> 。
	      </p>
	      <p style="text-align: right;">
          授权人（签字）：
          <span class="underline weight red"> {{attorneyData.name}} </span>
	      </p>
	      <p style="text-align: right;">
	        <span class="underline weight red"> {{attorneyData.onlineContractEffectiveDateStr}} </span>
	      </p>
    	</div>
    	<div slot="footer" class="dialog-footer">
        <el-button @click="layer_attorney = false" size="small">取 消</el-button>
    		<el-button type="primary" size="small" @click="layer_attorney = false;ruleForm.checked = true">我已阅读并同意</el-button>
	    </div>
    </el-dialog>

	</div>
</template>

<script>
import { validateMobile } from '@/utils/validate'
import { plusXing,deepClone } from '@/utils'
import { otherInfoApi } from '@/api/applyFinance'
export default {
  name: 'signature',
  props: {
    type: {
      type: Number,
      default: 1
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    nowFinance: {
      default: {}
    }
  },
  filters:{
    xing(val){

    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!validateMobile(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    return {
      actionBaseUrl: 'https://api.mdguanjia.com/bop',
      ruleForm: {
        mobile: '',
        name: '',
        accountName: '',
        cardNo: '',
        company: '',
        companyNo: '',
        checked: true
      },
      attorneyData: {
      	name: '杭州麦家公寓',
      	onlineContractEffectiveDateStr: '2018/03/12',
      	onlineContractIneffectiveDateStr: '2019/03/12',
      	onlineContractEffectiveDateStr: '2018/03/12'
      },
      codeUrl:'',
      layerType: 1,
      isHideUpload: false,
      fileList: [],
      layer_showInfo: false,
      layer_attorney: false,
      layer_sign: false
    }
  },
  mounted() {
    this.layer_showInfo = this.isShow;
    this.ruleForm = Object.assign(this.ruleForm,this.nowFinance);
  },
  methods: {
    handleSaveData() {
      if (this.fileList.length <= 0) {
        this.$message.error('请先上传图片')
        return false
      }
      let param = {
        signInfo: {
          signPicUrl: this.fileList[0].url
        },
        phoneNo: this.ruleForm.mobile,
        uuid: this.ruleForm.accountName
      }
      otherInfoApi(param).then(response => {
        this.$message.success('电子签章保存成功');
        this.$emit('updateType');
      }).catch(response => {

      })
    },
    dialogClose() {
      this.$emit('closeOverlay');
      this.fileList = [];
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
    pictureRemove(file, fileList) {
      this.showPicUrl = '';
      let imgList = [];
      this.isHideUpload = false;

      fileList.map(key => {
        if (key.response) {
          key.url = key.response.data[0];
        }
        imgList.push(key);
      })
      this.fileList = deepClone(imgList);

    },
    picturePreview(file) {
      this.showPicUrl = file.url;
      this.layer_showImage = true;
	  },
    pictureSuccess(response, file, fileList){
      if (fileList.length >= 1) {
        this.isHideUpload = true;
      }
      this.fileList.push({'url':file.response.data[0]})
    },
    pictureError(err,file){
      file = null;
    },
    resetFile(file){
      file = null;
    },
    showPicUrlClose(){
      this.showPicUrl = '';
    },
    lookAttorney() {
			this.layer_attorney = true;
    }
  },
  watch: {
    isShow(val) {
      this.layer_showInfo = val;
    },
    nowFinance(val) {
      this.ruleForm = Object.assign(this.ruleForm,val);
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
	.attorney {
		text-decoration: underline;
	}
	.underline {
    display: inline-block;
    min-width: 50px;
    font-weight: 700;
    padding: 0 15px;
    border-bottom: 1px solid #000;
	}
	.red {
		color:red;
	}
	h4.text-center {
		font-size: 20px;
		margin: 0;
	}
  .codeTips {
    padding:10px 0;
  }
  .qrcode {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 148px;
    height: 148px;
    cursor: pointer;
    line-height: 146px;
    vertical-align: top;
    text-align: center;
    i{
      font-size: 30px;
    }
  }
  .codeText {
    padding-top: 10px;
  }
</style>
