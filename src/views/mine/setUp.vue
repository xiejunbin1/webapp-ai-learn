<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar
    fixed placeholder
    title="设置"
    left-text=""
    left-arrow
    @click-left="onClickLeft"
    />
    <div class="record-box">
        <van-cell value="" is-link @click="goToAccountManage">
            <template #title>
                <svg-icon class='mgr10' icon-class="icon-account" />
                <span class="custom-title">账号管理</span>
            </template>
        </van-cell>
        <van-cell is-link :value="getEyeType=='close'?'已关闭':'已开启'" @click="setUpEye">
            <template #title>
              <svg-icon class='mgr10' icon-class="icon-eye" />
                <span class="custom-title">护眼功能</span>
            </template>
        </van-cell>
        <van-cell value="" is-link @click="goToAbout">
            <template #title>
                <svg-icon class='mgr10' icon-class="icon-about" />
                <span class="custom-title">关于我们</span>
            </template>
        </van-cell>
        <van-cell value="" is-link @click="goToSecretPolicy">
            <template #title>
                <svg-icon class='mgr10' icon-class="icon-secret" />
                <span class="custom-title">隐私政策</span>
            </template>
        </van-cell>
    </div>

</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
        };
    },

    components: {},

    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getEyeType:'getEyeType',
        })
    },

    mounted() {
        console.log('getUserInfo', this.getUserInfo)
        console.log(this.getEyeType)
        if(!this.getEyeType){
            console.log(8888)
            this.$store.commit('setEyeType', 'open')
        }
        
    },

    methods: {
        //护眼功能
        setUpEye(){
            if(this.getEyeType=='open'){
                this.$toast('已关闭护眼功能')
                this.$store.commit('setEyeType', 'close')
            }else{
                this.$toast('已开启护眼功能，系统每30分钟提醒您休息保护眼睛')
                this.$store.commit('setEyeType', 'open')
            }
        },
        //跳转到账号管理
        goToAccountManage(){
            this.$router.push({
                path: '/accountManage'
            })
        },
        //关于我们
        goToAbout(){
            this.$router.push({
                path: '/about'
            })
        },
        //隐私政策
        goToSecretPolicy(){
            this.$router.push({
                path: '/secretPolicy'
            })
        },
        //返回
        onClickLeft(){
            console.log('onClickLeft')
            this.$router.go(-1)
        }
    },
};
</script>

<style lang="less" scoped>

.record-box{
  margin: 15px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px 0 rgba(220,220,220,0.5);
  // padding: 10px 0;
  .custom-title{
    color: #333333;
  }
}
</style>
