<!--
 * @Author: wgj
 * @Date: 2021-03-31 12:50:18
 * @LastEditTime: 2021-04-16 20:01:16
 * @LastEditors: wgj
 * @Description: 
-->
<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar fixed placeholder title="隐私政策" left-text="" left-arrow @click-left="onClickLeft" />
    <div v-html="content">
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getContent
} from '@/api/index'

export default {
    data() {
        return {
            content: '',
            contentUrl: 'https://pubquanlang.oss-cn-shenzhen.aliyuncs.com/work/202001/userPrivateInfo.html'
        };
    },

    components: {},

    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
        })
    },

    mounted() {
        console.log('getUserInfo', this.getUserInfo)
        this.getContent();
    },

    methods: {
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        },
        getContent() {
            getContent(this.contentUrl).then(res => {
                this.content = res;
            })
        },
    },
};
</script>

<style lang="less" scoped>
</style>
