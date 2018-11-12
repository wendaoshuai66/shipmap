<template>
    <!-- <map-dialog v-if="filleShow" class="fille-Vless-content"
    :visible.sync='dialogFilleVisible'
    :beforeClose = 'beforeClose'
    left="20px"
    top="145px"
    :drag='0'
    :width="isLanguageZh ? '504px' : '631px'"> -->
      <!-- <template slot="title">
        <div class="file-vless-title">
          <el-row :gutter="20">
            <el-col :span="11" class="detail_title-text">
              <span>
                <a href="javascript:;" @click="backDetail()">
                  <svg-icon class="font14"  style="transform: rotate(90deg);" icon-class="xiangxiajiantou" />
                </a>
              </span>
              <span class="mr-l-10">
                  <svg-icon class="font18" style="color:#ffa900" icon-class="chuanbodangan" />
              </span>
              <span class="mr-l-5" >
                {{$t('vlessfile.dalogName')}}
              </span>
            </el-col>
          </el-row>
        </div>
      </template> -->
      <!-- v-for="classficationin Object.keys(tableGroup)" -->
      <div class="fille-Vless-content">
        <div class="filecontent" >
        <div class="fileitem" v-for="(item, index) in Object.keys(tableGroup)" :key='index'>
          <div class="main">
            <div class="file_title">
              {{$t('vlessfile.group.'+ item +'.title')}}
            </div>
            <div class="file_content" >
              <el-row>
                <el-col class="file_line" :span="12" v-for="(options, index) in Object.keys(tableGroup[item].context)" :key="index"  >
                  <div class="grid-content bg-purple" >
                    <el-col class="file_name" :span="10" >
                      {{$t('vlessfile.group.'+ item +'.context.' + options )}}:
                    </el-col>
                    <el-col :span="13" class="file_text" :title="item !== 'pis' ?tableDatas[item][options] :tableDatas[item][0][options]" >
                      <!-- {{item !== 'pis' ?tableDatas[item][options] :tableDatas[item][0][options]}} -->
                       <span v-if="item !== 'pis'">
                         <span v-if="item === 'dimension'">
                            {{tableDatas[item][options]}}m
                         </span>
                          <span v-else>
                            <span v-if="options === 'serviceSpeed'">
                              {{tableDatas[item][options]}}Kt's
                            </span>
                            <span v-else>
                              <span v-if="options === 'grossTonnage'">
                                {{tableDatas[item][options] | numFormat}}Mt
                              </span>
                              <span v-else>
                                <span v-if="options === 'deadWeight'">
                                  {{tableDatas[item][options] | numFormat}}Mt
                                </span>
                                 <span v-else>
                                   {{tableDatas[item][options]}}
                                </span>
                              </span>
                            </span>
                         </span>
                      </span>
                      <span v-else>
                        {{tableDatas[item][0][options]}}
                      </span>
                    </el-col>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="fileitem special">
          <div class="main mar-l-20">
            <div class="file_title">
                {{$t('vlessfile.classfications')}}
            </div>
            <div class="filecontent">
              <el-row>
                <el-col class="file_line font12" :span="24" v-for="(lines, index) in classfications" :key="index" :title="lines.content">{{lines.content}}</el-col>
              </el-row>
            </div>
          </div>
        </div>
        <div class="fileitem specialpsc">
          <div class="file_title mr-l-20">
              {{$t('vlessfile.pscs.title')}}
          </div>
          <div class="main" v-for="(list1, index) in pscsD" :key='index'>
            <div class="file_content">
              <el-row>
                <el-col class="file_line" :span="12" v-for="(item, index) in Object.keys(pscs)" :key="index" v-if= " item !== 'title' ">
                  <div class="grid-content bg-purple" >
                    <el-col class="file_name" :span="12" >
                      {{$t('vlessfile.pscs.' + item )}}:
                    </el-col>
                    <el-col :span="11" class="file_text" :title="list1[item]">
                        {{list1[item]}}
                    </el-col>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </div>
      </div>


      <!-- <template slot="footer">
v-text="$t('portInquiry.title')"
      </template>   -->
</template>

<script>
  // import {
  //   lsRecord
  // } from '@/api/routemap'
  import {
    mapGetters
  } from 'vuex'
  // import store from '@/store'
  // import mapDialog from '@/views/routemap/dragDialog/mapDialog'
  // import Map from '@/views/routemap/map'
  import i18n from '@/lang'
  import tableInfo from '@/lang/zh/vlessfile'
  import _ from 'lodash'
  import '@/styles/flag-icon.css'
  export default {
    components: {
      // mapDialog
    },
    name: 'vlessFile',

    props: {
      dialogFilleVisible: {
        type: Boolean
      },
      beforeClose: {
        type: Function
      },
      back: {
        type: Function
      }
    },
    data() {
      return {
        tableData: {},
        tableGroup: tableInfo.group,
        pscs: tableInfo.pscs,
        tableDatas: null,
        classfications: [],
        pscsD: [],
        // dialogTableVisible: false,
        filleShow: false
      }
    },
    computed: {
      ...mapGetters([
        'shipHallFile'
      ]),
      isLanguageZh() {
        return this.$store.getters.language === 'zh'
      }
    },
    watch: {
      shipHallFile: function(newValue, oldValue) {
        if (!_.isEmpty(this.shipHallFile) && !_.isEmpty(this.shipHallFile.datas)) {
          this.tableDatas = this.shipHallFile.datas
          this.classfications = this.shipHallFile.datas.classfications
          this.pscsD = this.shipHallFile.datas.pscs
        } else {
          this.$alert(i18n.t('commonRemind.noMessage'), i18n.t('history.prompt'))
        }
      }
      // shipImo: function(newValue, oldValue) {
      //   if (this.filleShow) {
      //     this.filleShow = false
      //   }
      // }
    },
    methods: {
      // init() {
      //   const obj = {
      //     imo: this.setVlessInfo.imo,
      //     mmsi: this.setVlessInfo.mmsi
      //   }
      //   lsRecord(obj).then(response => {
      //     if (response && !_.isEmpty(response.data) && !_.isEmpty(response.data.datas)) {
      //       this.filleShow = true
      //       // this.dialogTableVisible = true
      //       this.tableDatas = response.data.datas
      //       this.classfications = response.data.datas.classfications
      //       this.pscsD = response.data.datas.pscs
      //     } else {
      //       this.$alert(i18n.t('commonRemind.noMessage'), i18n.t('history.prompt'))
      //     }
      //   })
      // },
      // backDetail() {
      //   this.back()
      // }
    },
    mounted() {
      if (!_.isEmpty(this.shipHallFile) && !_.isEmpty(this.shipHallFile.datas)) {
        this.tableDatas = this.shipHallFile.datas
        this.classfications = this.shipHallFile.datas.classfications
        this.pscsD = this.shipHallFile.datas.pscs
      } else {
        this.$alert(i18n.t('commonRemind.noMessage'), i18n.t('history.prompt'))
      }
    }
  }
</script>
<style>
 /* .map_dialog {
    position: absolute;
    /* top: 390px;
    right: 140px;
} */
.fille-Vless-content .file-vless-title{
  color: #FFF;
  margin-left: 10px;
  margin-top: 14px;
}
.fille-Vless-content .detail_title-icon{
  font-size: 12px;
}
.fille-Vless-content .detail_title-text{
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}
  .fileitem{
  color: #fff;
  margin-top:  12px;
  margin-bottom: 10px;
  /* border-bottom: 1px solid #383838; */
  }
  .fileitem:last-child{
    border-bottom: none;
  }
  .fileitem .main{
    margin-left: 20px;
    margin-right: 20px;
  }
  .fileitem .file_title{
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }
.fileitem .file_content .file_name{
    text-align: left;
    font-size: 12px;
    color: #c8c8c8
  }
.fileitem .file_content .file_text{
  font-size: 12px;
  color: #fff;
  margin-left:5px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
.fileitem .file_content .file_line{
  height: 30px;
  line-height: 30px;
}
.filecontent{
  max-height: 300px;
  overflow-y: auto;
}
.special .filecontent{
    margin-left: 40px;
}
.special .el-col{
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
  margin-bottom: 10px;
}
.specialpsc .file_content{
  border-bottom:1px solid #383838
}
.specialpsc .file_content:last-child(){
  border-bottom:none
}
.fille-Vless-content .filecontent::-webkit-scrollbar
{
    width: 6px;
    height: 6px;
    background-color: rgba(255,255,255,0.13);
    border-radius: 6px;
}
.fille-Vless-content .filecontent::-webkit-scrollbar-thumb{
  background-color: rgba(255,255,255,1);
  border-radius: 6px;

}

</style>
