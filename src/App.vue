
<template>
  <div class="exampleBox">
    <div class="lm-ui-title rowCenter">
      <strong>龙马-ui</strong>
    </div>
    <div class="componentsBox rowAround">
      <div class="componentItemBox columnCenter">
        <lm-canlendar-component style="width:500px;"/>
        <el-button type="text">日历</el-button>
      </div>
      <div style="padding-top:60px;">
        <el-form width="1000" ref="form" :model="form" label-width="100px">
          <el-row>
            <lm-input label="姓名：" v-model="form.name"></lm-input>
            <lm-select label="学历：" v-model="form.stuty" :list="['文盲','小学','初中','高中','中专','大专','本科','硕士','博士']"/>
          </el-row>
          <el-row>
            <lm-date-time label="日期范围：" v-model="form.date"   form-type="rangeDateTime" width="46%"
                          date-time-type="datetime"
                          :picker-options="[
                            {
                                disabledDate:(time)=>$lm.dateRangeDisabled(time,[0,form.date ? form.date[1] : new Date()],{endEqual:true})
                                },
                                {
                                    disabledDate:time=> $lm.dateRangeDisabled(time,[form.date ? form.date[0] : 0,new Date()],{endEqual:true,startEqual:true})
                                }
                                ]"
            />
            <lm-cascader label="证书：" :options="cascaders"/>
          </el-row>
          <lm-address label="住址：" v-model="form.address" :required="false"/>
          <lm-up-img :limit="6"/>
          <lm-up-file :limit="4"/>
        </el-form>
        <div class="rowCenter">
          <el-button type="primary" @click="save" style="width:120px;">保存</el-button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
    import {formatDate} from "lm-ui-element/lib/utils/lm-methods";
    import LmCanlendarComponent from './components/lm-canlendar-component'
    export default {
        components: {
            LmCanlendarComponent
        },
        data() {
            return {
                form:{},//保单
                cascaders:[
                    {
                        name:'建筑工程',
                        value:'jz',
                        children:[
                            {
                                name:'一级',
                                value:'jzc1'
                            },
                            {
                                name:'二级',
                                value:'jzc2'
                            }
                        ]
                    },
                    {
                        name:'水利工程',
                        value:'sl',
                        children:[
                            {
                                name:'一级',
                                value:'slc1',
                                children:[
                                    {
                                        name:'一级AA',
                                        value:'slc1aa'
                                    },
                                    {
                                        name:'一级AB',
                                        value:'slc1ab'
                                    },
                                    {
                                        name:'一级AC',
                                        value:'slc1ac'
                                    },
                                ]
                            }
                        ]
                    }
                ]
            }
        },
        computed: {
        },
        mounted() {

        },
        methods: {
            save(){

            }

        },

    }
</script>

<style scoped lang="scss">
  .exampleBox{
    padding:20px;
    .lm-ui-title{
      font-size:20px;
      margin-bottom:20px;
    }
    .componentBtnBox{
      padding:20px;
      background:#dddddd;
    }
    .componentsBox{
      flex-wrap:wrap;
      align-items: flex-start;
    }


  }
</style>


