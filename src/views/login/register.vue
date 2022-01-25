<template>
<div class='register'>
    <van-nav-bar fixed placeholder left-arrow @click-left="onClickLeft" />
    <div class="content">
        <div class="font-blue login-text">注册</div>
        <div class="font-blue app-name mgt5">全朗AI慧学</div>
        <van-form>
            <div class='font-name mgt20'>手机号</div>
            <van-field v-model="mobile" name="phone" type="number" placeholder="请输入11位手机号" />
            <div class='font-name mgt20'>验证码</div>
            <van-field v-model="vailcode" name="vailcode" autocomplete="off" type="number" placeholder="请输入6位验证码">
                <van-button plain round type="info" v-if="!timer" @click="getVailCode" slot="button">获取验证码</van-button>
                <van-button plain round type="info" v-else :disabled="disabled" slot="button">
                    {{second}}秒后重新获取
                </van-button>
            </van-field>
            <div class='font-name mgt20'>密码</div>
            <van-field v-model="password" type="password" autocomplete="new-password" name="password" placeholder="请设置登录密码（6-20位）" />
            <van-button class='mgt25' round block type="info" :loading="codeBtnLoading" :disabled="!isLogin" @click="onSubmit">注册</van-button>
            <van-checkbox class="mgt25" v-model="checkedRead" checked-color="#43B992" shape="square">我已阅读并同意<span class="font-blue">《全朗AI慧学使用协议与隐私保护》</span></van-checkbox>
        </van-form>
    </div>

</div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import {
    getVailCode,
    registerUserInfo,
    doUserLogin
} from '@/api/login'
export default {
    name: 'login',
    components: {},
    data() {
        return {
            // isNoLogin:false,
            mobile: '',
            vailcode: '',
            password: '',
            codeBtnLoading: false,
            timer: null,
            second: 60,
            checkedRead: true
        };
    },
    //监听属性 类似于data概念
    computed: {
        isLogin: function () {
            return this.mobile != '' && this.vailcode != '' && this.password != ''
        }
    },
    //监控data中的数据变化
    watch: {},
    //方法集合
    methods: {
        onSubmit() {
            console.log('submit')
            if (!this.checkSubmit()) return;
            this.toRegister();
        },
        // 获取验证码
        getVailCode() {
            console.log('getVailCode')
            if (this.timer) return

            let params = {
                phoneNo: this.mobile
            }
            getVailCode(params).then(res => {
                console.log(res)
                if (res.flag === true) {
                    this.$toast('请查收验证码！')
                    this.disabled = true
                    if (!this.timer) {
                        this.timer = setInterval(() => {
                            console.log("定时器")
                            if (this.second > 0 && this.second <= 60) {
                                this.second--
                            } else {
                                clearInterval(this.timer)
                                this.second = 60
                                this.timer = null
                                this.disabled = false
                            }
                        }, 1000)
                    }
                } else {
                    console.log('获取验证码', res.msg)
                    this.$toast('请稍后获取！')
                }
            })
        },
        // 注册
        toRegister() {
            this.codeBtnLoading = true
            let params = {
                interUser: "runLfb",
                interPwd: "25d55ad283aa400af464c76d713c07ad",
                phoneNo: this.mobile,
                code: this.vailcode,
                password: this.$hex_md5(this.password)
            }
            console.log(params)
            registerUserInfo(params).then(res => {
                this.codeBtnLoading = false
                console.log(res)
                if (res.flag === true) {
                    this.toLogin()
                } else {
                    let msg = res.msg || '注册失败！'
                    this.$toast(msg)
                }
            })
        },
        toLogin() {
            let json = {
                'interUser': 'runLfb',
                'interPwd': '25d55ad283aa400af464c76d713c07ad',
                'phoneNoOrName': this.mobile,
                'sysType': 'S12',
                'roleType': 'A03', //学生
                'passwordNo': this.$hex_md5(this.password),
            }
            // json.userDeviceInfo = this.userDeviceInfo
            let params = {
                requestJson: JSON.stringify(json),
            }
            this.loginBtnLoading = true
            doUserLogin(params).then(async res => {
                console.log(res)
                if (res.flag) {
                    //存储用户数据
                    await this.$store.commit('setUserInfo', res.data[0].loginInfoVo.usrInfo)
                    //是否已登录
                    await this.$store.commit('setHasLogin', true)
                    //登录成功返回上一页 否则返回首页
                    if (this.$route.query.redirect) {
                        this.$router.replace(this.$route.query.redirect);
                    } else {
                        this.$router.replace(`/home`);
                    }
                } else {
                    this.$toast(res.msg)
                }
                this.loginBtnLoading = false
            }).catch(() => {
                this.loginBtnLoading = false
            })
        },
        //手机号校验
        isPoneAvailable(phoneNum) {
            var reg = /^[1][3-9][0-9]{9}$/
            if (!reg.test(phoneNum)) {
                return false
            } else {
                return true
            }
        },
        checkSubmit() {
            // if (!this.mobile) {
            //     this.$toast('请输入手机号!')
            //     return
            // }
            if (!this.isPoneAvailable(this.mobile)) {
                this.$toast('手机号格式错误，请重新输入!')
                return false
            }
            // if (!this.vailcode) {
            //     this.$toast('请输入验证码!')
            //     return
            // }
            // if (!this.password) {
            //     this.$toast('请设置登录密码!')
            //     return
            // }
            if (this.password.length < 6 || this.password.length > 20) {
                this.$toast('请设置6至20位数的密码');
                return false;
            }
            if (!this.checkedRead) {
                this.$toast('请阅读并勾选使用协议与隐私保护');
                return false;
            }
            return true;
        },
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        }
    },
    //生命周期 - 创建完成（可以访问当前this实例）
    created() {

    },
    //生命周期 - 挂载完成（可以访问DOM元素）
    mounted() {
        console.log("this.$route",this.$router)
    },
    beforeCreate() {}, //生命周期 - 创建之前
    beforeMount() {}, //生命周期 - 挂载之前
    beforeUpdate() {}, //生命周期 - 更新之前
    updated() {}, //生命周期 - 更新之后
    beforeDestroy() {
        clearInterval(this.timer)
        this.second = 60
        this.timer = null
        this.disabled = false
    }, //生命周期 - 销毁之前
    destroyed() {}, //生命周期 - 销毁完成
    activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
}
</script>

<style lang="less" scoped>
//@import url(); 引入公共css类
// @import '../../assets/css/variables.less';
// @import '../../assets/css/common.less';

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

    .btn-vailcode {
        float: right;
        margin-top: 25px;
        width: 105px;
        height: 36px;
        font-size: 14px;
        line-height: 36px;
    }

    .van-checkbox {
        font-size: 12px;
    }
     // 解决底部不够长问题
    /deep/ .van-cell::after {
        left: 0;
    }
}
</style>
