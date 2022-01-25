<template>
<div class="home">
    <van-nav-bar fixed placeholder title="全朗AI慧学测试" left-text="" left-arrow @click-left="chooseGrade">
        <template #left>
            <span class="home-left-title">{{grade | getGradeName}}</span>
            <van-icon color="#666" name="arrow-down" size="18" />
        </template>
    </van-nav-bar>
    <div class="content">
        <div class='banner'>
            <!-- <van-image fit="contain" :src="bannerUrl" /> -->
            <!-- <img class="banner-img" :src="bannerUrl" alt=""> -->
                <svg-icon  icon-class='icon-home-banner'></svg-icon>

        </div>
        <div class='menu'>
            <div class='menu-item' @click="goToJudge(item)" v-for="(item,index) in menuList" :key="index">
                <svg-icon class="fs50" :icon-class='item.imgUrl'></svg-icon>
                <span class='mgt10'>{{item.menuName}}</span>
            </div>
        </div>
        <div class="textbook">
            <div class="textbook-name">学习教材</div>
            <div class='textbook-box' v-if="subjectList && subjectList.length>0">
                <div class='textbook-item' @click="goToLearn(item)" v-for='(item,index) in subjectList' :key="index">
                    <!-- <span class="textbook-item-img"><svg-icon :icon-class="'tab-home-'+item.subjectType"></svg-icon></span> -->
                    <svg-icon :icon-class="'tab-home-'+item.subjectType"></svg-icon>

                    <!-- <span class="textbook-item-img"><svg-icon icon-class="icon-home-test-S01"></svg-icon></span> -->

                    <span class='name'>{{item.subjectTypeName}}</span>
                    <div class='grade-name'>
                        {{item.classGrade | getGradeName}}
                        {{item.termType | getTermTypeName}}
                    </div>
                    <span class='textbook-name' v-if="item.textBookName">
                        {{item.textBookName}}
                    </span>
                    <span class="textbook-name" v-else>未选择版本</span>
                </div>
                <!-- 解决最后一行不满时没有左对齐问题     +'00'，不然key和上边的div冲突了
                参考：https://blog.csdn.net/Storm_Bluecat/article/details/115251736 -->
                <div class='default-box' v-for="n in 3" :key="n+'00'"></div>
            </div>
            <NoResult class='mgt30' v-else></NoResult>
        </div>
    </div>

    <dialogChooseGrade :showChooseGrade.sync="showChooseGrade" :chooseGrade.sync="grade" @sureChooseGrade="sureChooseGrade" />
</div>
</template>

<script>
// @ is an alias to /src
import {
    saveProfileInfo
} from "@/api/user"
import {
    getGradeSubjectTypeRelationList
} from "@/api/resource"
import NoResult from "@/components/NoResult"
import {
    mapGetters
} from 'vuex'
import dialogChooseGrade from './components/dialogChooseGrade'
export default {
    name: 'Home',
    components: {
        dialogChooseGrade,
        NoResult
    },
    data() {
        return {
            grade: '',
            gradeName: '未选择',
            showChooseGrade: false,
            bannerUrl: require('@/assets/img/home/banner.png'),
            menuList: [{
                    imgUrl: 'icon-home-judge',
                    menuName: '诊断学情',
                    path: '/judgeLearningSubject'
                },
                {
                    imgUrl: 'icon-home-learn',
                    menuName: '学习中心',
                    path: '/learningCenter'
                },
                {
                    imgUrl: 'icon-home-exercise',
                    menuName: '练习基地',
                    path: '/practiceList'
                },
                {
                    imgUrl: 'icon-home-test',
                    menuName: '测试考场',
                    path: '/testList'
                },
            ],
            subjectList: [], //科目
        }
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    mounted() {
        console.log('this.getUserProfileInfo', this.getUserProfileInfo)
        console.log(JSON.parse(JSON.stringify(this.$store.getters.getUserProfileInfo)));
        if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
            this.grade = this.getUserProfileInfo.grade;
            this.getGradeSubjectTypeRelationList()
        } else {
            this.showChooseGrade = true;
        }
    },
    methods: {
        //点击选择年级
        chooseGrade() {
            if (this.getHasLogin) {
                this.showChooseGrade = true;
            } else {
                this.$router.push('/login')
            }

        },
        //选择年级确认
        sureChooseGrade(item) {
            this.showChooseGrade = false;
            if (this.getUserInfo && this.getUserInfo.accountNo) {
                this.saveProfileInfo();
            } else { //没有登录的情况下只更新本地缓存，不更新后台数据，登录完才去更新
                this.saveUserInfoAndUpdateGradeSubjectList()
            }

        },
        goToJudge(item) {
            if (item.path) {
                if (!this.grade) return this.$toast('请选择年级')
                this.$router.push({
                    path: item.path
                })
            } else {
                this.$toast('正在研发，敬请关注！')
            }
        },
        textbookJump(item) {
            if (this.getHasLogin) {
                let storage = window.localStorage;
                if(storage.textbook){
                    let textBook = JSON.parse(storage.textbook)
                    let add = textBook.find(v => (v.subjectTypeName == item.subjectTypeName))
                    if(add){
                        for (var i = 0; i < textBook.length; i++) {
                            if (textBook[i].subjectType === item.subjectType) {
                                textBook.splice(i, 1);
                                break;
                            }
                        }
                        textBook.unshift(add);
                        storage.setItem("textbook", JSON.stringify(textBook));
                        this.$router.push({
                            path: '/learningCenter',
                        })
                    }else{
                        this.$router.push({
                            path: '/switchVersion',
                            query: {
                                subjectType: item.subjectType
                            }
                        })
                    }
                }else{
                    this.$router.push({
                        path: '/switchVersion',
                        query: {
                            subjectType: item.subjectType
                        }
                    })
                }
            } else {
                this.$router.push('/login')
                return false
            }
        },
        goToLearn(item) {
            switch (item.subjectTypeName) {
                case '语文':
                    this.textbookJump(item);
                    break;
                case '数学':
                    this.textbookJump(item);
                    break;
                case '英语':
                    this.textbookJump(item);
                    break;
                case '物理':
                    this.textbookJump(item);
                    break;
                case '化学':
                    this.textbookJump(item);
                    break;
                case '政治':
                    this.textbookJump(item);
                    break;
                case '历史':
                    this.textbookJump(item);
                    break;
                case '生物':
                    this.textbookJump(item);
                    break;
                case '地理':
                    this.textbookJump(item);
                    break;
            }
        },
        //保存更新用户档案信息
        saveProfileInfo() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "objectTypeCd": "A03", //固定值
                "grade": this.grade
            }
            saveProfileInfo(params).then(res => {
                if (res.flag) {
                    this.saveUserInfoAndUpdateGradeSubjectList()
                } else {
                    this.$toast(res.msg)
                }
            })
        },
        saveUserInfoAndUpdateGradeSubjectList() {
            let data = {
                grade: this.grade
            }
            this.$store.commit('setUserProfileInfo', data)
            this.getGradeSubjectTypeRelationList();
        },
        //年级学科信息以及配置信息
        getGradeSubjectTypeRelationList() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo ? this.getUserInfo.accountNo : null,
                "classGrade": this.grade
            }
            getGradeSubjectTypeRelationList(params).then(res => {
                if (res.flag) {
                    this.subjectList = res.data || [];
                    // this.subjectList.length = 9;
                } else {
                    this.$toast(res.msg)
                }
            }, err => {
                console.log('年级学科信息以及配置信息 err', err)
            })
        },
    }
}
</script>

<style lang="less" scoped>
.content {
    padding: 10px 15px 60px 15px;

    .banner {
        width: 100%;
        // font-size: 300px;
        text-align: center;
        svg{
            width: 345px;
            height: 150px;
        }
        .banner-img {
            width: 345px;
        }
    }

    .menu {
        display: flex;
        justify-content: space-between;
        padding: 25px 5px;

        .menu-item {
            // width: 60px;
            // height: 60px;
            font-size: 13px;
            color: #333;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            font-weight: 400;
        }
    }

    .textbook {
        .textbook-name {
            color: #333;
            font-size: 18px;
            font-weight: 500;
            padding-left: 5px;
        }

        .textbook-box {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-top: 25px;
        }

        // .textbook-box:after {
        //     content: "";
        //     width: 107px;
        // }

        .textbook-item {
            display: flex;
            // align-items: center;
            justify-content: flex-start;
            flex-direction: column;
            position: relative;
            margin: 0 0 20px 0;
            // width: 33%;
            // align-items: center;
            font-size: 108px;

            .textbook-item-img {}

            .name {
                position: absolute;
                top: 20px;
                left: 15px;
                font-size: 16px;
                font-weight: 500;
                color: #fff;
            }

            .grade-name {
                color: #333;
                font-size: 13px;
                font-weight: 500;
                line-height: 19px;
                padding: 5px 8px;
            }

            .textbook-name {
                color: #aaa;
                font-size: 12px;
                font-weight: 400;
                line-height: 17px;
                padding-left: 8px;
            }

        }

        .default-box {
            width: 107px;
            height: 0;
        }

    }
}

/deep/.van-hairline--bottom::after {

    border: 0 none;
}

.home-left-title {
    color: #666;
    font-size: 15px;
    margin-right: 5px
}

@media screen and (min-device-width: 481px) and (max-device-width: 768px) {
    .content .textbook .textbook-item {
        font-size: 30vw !important;
    }
}
</style><style lang="less">

</style>
