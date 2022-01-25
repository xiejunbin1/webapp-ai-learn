<!--
 * @Author: wgj
 * @Date: 2021-03-26 09:18:45
 * @LastEditTime: 2021-04-16 20:16:09
 * @LastEditors: wgj
 * @Description: 
-->
<!--  -->
<template>
<div class='mine-box' style="">
    <div class="picture">
        <img :src="bannerUrl" class="banner-img" alt="">
        <div class="info-box">
            <div class="photo-box">
                <img class="white-background" :src="whiteBackgroudUrl" alt="">
                <img class="default-photo" :src="getUserInfo&&getUserInfo.iconUrl?getUserInfo.iconUrl:defaultPhotoUrl" alt="">
            </div>
            <div class="name-box">
                <div v-if="!getUserInfo" @click="toLogin">
                    <div class='name'>注册/登录</div>
                    <div class="phone">开启您的高效学习之旅</div>
                </div>
                <div v-else @click="informationClick">
                    <div class='name'>{{getUserInfo.loginName}}</div>
                    <div class="phone">{{getUserInfo.phoneNo}}</div>
                </div>
            </div>
        </div>
    </div>
    <div class="record-box">
        <van-cell value="" is-link @click="goTo('诊断记录')">
            <template #title>
                <svg-icon class='mgr10 fs20' icon-class="icon-diagnosis-record" />
                <span class="custom-title">诊断记录</span>
            </template>
        </van-cell>
        <van-cell value="" is-link @click="goTo('学习记录')">
            <template #title>
                <svg-icon class='mgr10 fs20'  icon-class="icon-learn-record" />
                <span class="custom-title">学习记录</span>
            </template>
        </van-cell>
        <van-cell value="" is-link @click="goTo('练习记录')">
            <template #title>
                <svg-icon class='mgr10 fs20' icon-class="icon-exercise-record" />
                <span class="custom-title">练习记录</span>
            </template>
        </van-cell>
        <van-cell value="" is-link @click="goTo('测试记录')">
            <template #title>
                <svg-icon class='mgr10 fs20'  icon-class="icon-test-record" />
                <span class="custom-title">测试记录</span>
            </template>
        </van-cell>
    </div>
    <div class="record-box">
        <van-cell value="" is-link @click="contactCustomer">
            <template #title>
                <svg-icon class='mgr10 fs20'  icon-class="icon-contact-customer" />
                <span class="custom-title">联系客服</span>
            </template>
        </van-cell>
        <van-cell value="" is-link @click="goToOpinion">
            <template #title>
                <svg-icon class='mgr10 fs20'  icon-class="icon-opinion" />
                <span class="custom-title">意见反馈</span>
            </template>
        </van-cell>
    </div>
    <div class="record-box">
        <van-cell value="" is-link @click="goToSetUp">
            <template #title>
                <svg-icon class='mgr10 fs20'   icon-class="icon-set-up" />
                <span class="custom-title">设置</span>
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
            bannerUrl: require('@/assets/img/mine/mine-banner.png'),
            whiteBackgroudUrl: require('@/assets/img/mine/white-background-photo.png'),
            defaultPhotoUrl: require('@/assets/img/mine/default-photo.png'),
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
    },

    methods: {
        goTo(value) {
            switch(value) {
                case '诊断记录': this.$router.push({path: '/diagnosticRecord'}); break;
                case '学习记录': this.$router.push({path: '/learningRecord'}); break;
                case '练习记录': this.$router.push({path: '/practiceRecord'}); break;
                case '测试记录': this.$router.push({path: '/testRecord'}); break;
            }
        },
        //联系客服
        contactCustomer() {
            this.$dialog.alert({
                message: '客服电话：0757-6326-7777\n工作时间：9:00-18:00',
                confirmButtonText:'知道了',
            }).then(() => {
                // on close
            });
        },
        toLogin() {
            this.$router.push({
                path: '/login'
            })
        },
        //跳转意见反馈
        goToOpinion() {
            this.$router.push({
                path: '/opinion'
            })
        },
        goToSetUp() {
            this.$router.push({
                path: '/setUp'
            })
        },
        // 跳转个人信息
        informationClick() {
            this.$router.push({
                path: '/personalCenter'
            })
        }
        
    },
};
</script>

<style lang="less" scoped>
.picture {
    position: relative;
    .banner-img{
        width: 375px;
    }
    .info-box {
        position: absolute;
        top: 52px;
        left: 17px;
        display: flex;
        align-items: center;
        // width: 100%;

        .photo-box {
            .white-background{
                width: 67px;
                height: 67px;
            }
            .default-photo {
                position: absolute;
                top: 2.5px;
                left: 2.52px;
                border-radius: 50%;
                overflow: hidden;
                width: 62px;
                height: 62px;
                object-fit: cover;
            }
        }

        .name-box {
            color: #fff;
            margin-left: 20px;

            .name {
                font-size: 16px;
                // line-height: 25px;
                margin-bottom: 7px;
            }

            .phone {
                font-size: 11px;
            }
        }
    }
}

.record-box {
    margin: 15px;
    border-radius: 8px;
    overflow: hidden;
    padding: 10px 0;
    background: #fff;
    box-shadow: 0 2px 8px 0 rgba(220,220,220,0.5);

    // padding: 10px 0;
    .custom-title {
        color: #333333;
        font-size: 15px;
    }
}
.mine-box{
    background: #f8f8f8;
    min-height: 100vh;
    padding-bottom: 60px;
}
</style>
