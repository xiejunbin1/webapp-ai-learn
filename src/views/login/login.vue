<template>
<div class="">
    <van-nav-bar fixed placeholder right-text="立即注册" left-arrow @click-left="onClickLeft" @click-right="onClickRight" />
    <div class="content">
        <div class="font-blue login-text">登录</div>
        <div class="font-blue app-name mgt5">全朗AI慧学</div>
        <van-form @submit="onSubmit">
            <div class="font-name mgt20">账户</div>
            <van-field v-model="username" name="username" placeholder="请输入用户名或手机号" />
            <div class="font-name mgt20">密码</div>
            <van-field v-model="password" type="password" name="password" placeholder="请输入登录密码" />
            <div class="find-password" @click="retrieveClick">找回密码</div>
            <van-button round block type="info" :loading="loginBtnLoading" :disabled="!isLogin" native-type="submit">登录</van-button>
        </van-form>
    </div>
</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
    doUserLogin
} from '@/api/login';
import {
    getUserProfileInfo,
    saveProfileInfo
} from '@/api/user';
export default {
    name: 'login',
    components: {},
    data() {
        return {
            // isNoLogin:false,
            username: '',
            password: '',
            loginBtnLoading: false,
        };
    },
    //监听属性 类似于data概念
    computed: {
        isLogin: function () {
            return this.username != '' && this.password != '';
        },
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        onSubmit() {
            console.log('submit');
            if (!this.checkSubmit()) return;
            this.toLogin();
        },
        toLogin() {
            let json = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                phoneNoOrName: this.username,
                sysType: 'S13',
                roleType: 'A03', //学生
                passwordNo: this.$hex_md5(this.password),
            };
            // json.userDeviceInfo = this.userDeviceInfo
            let params = {
                requestJson: JSON.stringify(json),
            };
            this.loginBtnLoading = true;
            doUserLogin(params)
                .then(async (res) => {
                    console.log(res);
                    if (res.flag) {
                        //登录完存储的用户信息在退出登录时均要手动清除！！！！ accountManage页面
                        //存储用户数据
                        await this.$store.commit('setUserInfo', res.data[0].loginInfoVo.usrInfo);
                        //是否已登录
                        await this.$store.commit('setHasLogin', true);
                        console.log(this.$store.getters.getUserProfileInfo);
                        //存储前需判断用户登录前是否已经选择过年级，是的话先更新用户选择的年级
                        if (this.$store.getters.getUserProfileInfo && this.$store.getters.getUserProfileInfo.grade) {
                            this.saveProfileInfo(res.data[0].loginInfoVo.usrInfo);
                        } else {
                            this.getUserInfoSuccess(res.data[0].loginInfoVo.usrInfo);
                        }
                    } else {
                        this.$toast(res.msg);
                    }
                    this.loginBtnLoading = false;
                })
                .catch(() => {
                    this.loginBtnLoading = false;
                });
        },
        getUserInfoSuccess(res) {
            Promise.all([this.getUserProfileInfo(res.accountNo)]).then((res) => {
                //登录成功如果有上一页，则返回上一页否则返回首页
                if (this.$route.query.redirect) {
                    this.$router.replace(this.$route.query.redirect);
                } else {
                    this.$router.replace(`/home`);
                }
            });
        },
        //保存更新用户档案信息
        saveProfileInfo(obj) {
            let params = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                accountNo: obj.accountNo,
                objectTypeCd: 'A03', //固定值
                grade: this.$store.getters.getUserProfileInfo.grade,
            };
            saveProfileInfo(params).then((res) => {
                if (res.flag) {
                    this.getUserInfoSuccess(obj);
                } else {
                    this.$toast(res.msg);
                }
            });
        },
        //获取用户档案信息
        getUserProfileInfo(accountNo) {
            let params = {
                interUser: 'runLfb',
                interPwd: '25d55ad283aa400af464c76d713c07ad',
                accountNo: accountNo,
            };
            return getUserProfileInfo(params).then((res) => {
                if (res.flag && res.data) {
                    //存储用户档案信息
                    //存储前需判断用户登录前是否已经选择过年级，是的话更新年级
                    if (this.$store.getUserProfileInfo && this.$store.getUserProfileInfo.grade) {
                        res.data.grade = this.$store.getUserProfileInfo.grade;
                    }
                    this.$store.commit('setUserProfileInfo', res.data);
                }
            });
        },
        checkSubmit() {
            if (this.password.length < 6 || this.password.length > 20) {
                this.$toast('请设置6至20位数的密码');
                return false;
            }
            return true;
        },
        //立即注册
        onClickRight() {
            console.log('onClickRight');
            this.$router.push(`/register`);
        },
        //返回
        onClickLeft() {
            console.log('onClickLeft');
            this.$router.go(-1);
        },
        retrieveClick() {
            this.$router.replace(`/retrievePassword`);
            // this.$router.push({
            //     path: '/retrievePassword'
            // })
        },
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {},
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {},
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {}, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>

<style lang="less" scoped>
.content {
    padding: 35px;

    .login-text {
        font-size: 30px;
        line-height: 42px;
        font-weight: 600;
    }

    .app-name {
        font-size: 20px;
        line-height: 28px;
        font-weight: 600;
    }

    /deep/.van-cell {
        padding: 10px 0;
    }

    .font-name {
        font-size: 20px;
        color: #333;
        font-weight: 600;
    }

    .find-password {
        color: #333;
        margin: 15px 0 25px 0;
        font-size: 14px;
    }

    /deep/.van-field--error .van-field__control,
    .van-field--error .van-field__control::placeholder {
        color: #969799;
    }

    // 解决底部边线不够长问题
    /deep/ .van-cell::after {
        left: 0;
    }
}
</style>
