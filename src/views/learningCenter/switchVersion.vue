<template>
<div>
    <div style="background: #f8f8f8;min-height: 100vh; ">
        <div class="tou">
            <div style="position: relative;">
                <div class="tou-return" :style="subjectList.length == 0 ? 'background: #f8f8f8' : 'background: #fff'" @click="onClickLeft">
                    <van-icon name="arrow-left" slot="left" />
                </div>
                <div class="tabs" v-show="subjectList.length > 0">
                    <van-tabs v-model="active" @click="switchClick" sticky>
                        <van-tab v-for="(value,index) in subjectList" :key="index" :title="value.subjectTypeName">
                            <van-notice-bar color="#5981F9" background="#E1E8FF">请选择您当前使用的教材版本</van-notice-bar>
                            <div class="textbookVersion" v-if="textbookVersion && textbookVersion.length > 0">
                                <div>
                                    <van-sidebar v-model="activeKey" @change="activeKeyClick">
                                        <van-sidebar-item v-for="(value,index) in textbookVersion" :key="index" :title="value.textBookName" />
                                    </van-sidebar>
                                </div>
                                <div style="background: #fff;width: 100%">
                                    <div class="secretary">
                                        <div class="image" style="" v-for="(value,index) in Textbook" :key="index" @click="oNswitchVersion(value.termType, value.subject)">
                                            <img :src="url" alt="">
                                            <span class="subjectClss">{{ value.subject }}</span>
                                            <div class="ageversion">
                                                <div>{{value.age}}</div>
                                                <div>{{value.version}}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </van-tab>
                    </van-tabs>
                </div>
            </div>
            <NoResult class="all-center" v-if="textbookVersion.length == 0 || subjectList.length == 0"></NoResult>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getGradeSubjectTypeRelationList
} from "@/api/resource"
import {
    getTextBookVersionByGradeTerm
} from "@/api/resource"
import {
    textbookSelection
} from '../../api/learningCenter'
import NoResult from '../../components/NoResult/index'
import { changeTheTeachingPicture } from '@/utils/filter'
export default {
    data() {
        return {
            active: 0,
            activeKey: 0,
            subjectList: [], // 教材
            Textbook: [],
            textbookVersion: [], //教材版本
            textBookId: '',
            subjectType: '',
            url: '',
        }
    },
    methods: {
        onClickLeft() {
            let storage = window.localStorage;
            if(storage.textbook){
                let textBook = JSON.parse(storage.textbook)
                let subjectList = this.subjectList[this.active].subjectType
                let arr = textBook.find(v => (v.subjectType == subjectList))
                if(!arr){
                    this.$toast(`请选择${this.subjectList[this.active].subjectTypeName}教材版本`)
                } else {
                    this.$router.go(-1)
                }
            }else{
                this.$toast(`请至少选择一个版本`)
            }
            
        },
        // Textbook information
        textbookInformation(value) {
            this.Textbook = [{
                subject: value,
                age: this.$options.filters.getGradeName(this.getUserProfileInfo.grade),
                version: '上册',
                termType: 'T01'
            }, {
                subject: value,
                age: this.$options.filters.getGradeName(this.getUserProfileInfo.grade),
                version: '下册',
                termType: 'T02'
            }]
        },
        //年级学科信息以及配置信息
        getGradeSubjectTypeRelationList() {
            return new Promise((resolve, reject) => {
                let params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,
                    "classGrade": this.grade,
                }
                getGradeSubjectTypeRelationList(params).then(res => {
                    if (res.flag) {
                        this.subjectList = res.data || [];
                        if (this.$route.query.subjectType) {
                            this.subjectList.forEach((v, index) => {
                                if (v.subjectType == this.$route.query.subjectType) {
                                    this.url = changeTheTeachingPicture(this.subjectList[index].subjectTypeName)
                                    this.active = index
                                    this.subjectType = this.subjectList[index].subjectType
                                    this.textbookInformation(this.subjectList[index].subjectTypeName)
                                }
                            })
                        } else {
                            this.url = changeTheTeachingPicture(this.subjectList[0].subjectTypeName)
                            this.textbookInformation(this.subjectList[0].subjectTypeName)
                            this.active = 0
                            this.subjectType = this.subjectList[0].subjectType
                        }
                        resolve(this.subjectList)
                    }
                })
            })
        },
        // 获取教材版本
        getTextBookVersionByGradeTerm() {
            this.getGradeSubjectTypeRelationList().then((data) => {
                let params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "gradeTermId": '',
                    "subjectType": this.subjectType,
                    "bookTypeIn": "",
                    "classGrade": this.getUserProfileInfo.grade
                }
                getTextBookVersionByGradeTerm(params).then(res => {
                    if (res.flag) {
                        this.textbookVersion = res.data || [];
                        if (this.textbookVersion.length == 0) {
                            this.Textbook = []
                        }
                    }
                })
            })
        },
        // 头部导航栏切换
        switchClick(name, title) {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "operateAccountNo": this.getUserInfo.accountNo,
                "gradeTermId": '',
                "subjectType": this.subjectList[name].subjectType,
                "bookTypeIn": "",
                "classGrade": this.getUserProfileInfo.grade
            }
            getTextBookVersionByGradeTerm(params).then(res => {
                if (res.flag) {
                    this.textbookVersion = res.data || [];
                    // 切换时教材更新
                    this.textbookInformation(title)
                }
                this.url = changeTheTeachingPicture(title)
                this.subjectType = this.subjectList[name].subjectType
                if (this.textbookVersion.length == 0) {
                    this.Textbook = []
                    return false
                }
                let storage = window.localStorage;
                let arr = null
                if (storage.textbook) {
                    JSON.parse(storage.textbook).forEach(values => {
                        if (values.subjectTypeName == title) {
                            arr = this.textbookVersion.find(value => (value.textBookId == values.textBookId))
                            if (arr) {
                                this.textbookVersion.forEach((value, index) => {
                                    if (value.textBookId == arr.textBookId) {
                                        this.activeKey = index
                                        this.textBookId = this.textbookVersion[index].textBookId;
                                    }
                                })
                            }
                        }
                    })
                } else {
                    this.activeKey = 0
                    this.textBookId = this.textbookVersion[0].textBookId;
                }
            })
        },
        // 教材切换
        activeKeyClick(index) {
            this.textBookId = this.textbookVersion[index].textBookId;
        },
        // 获取点击教材信息
        addTextbooks (item, cache, value) {
            item.textBookId = cache.textBookId
            item.termType = value
            item.termTypeName = value == 'T01' ? '上册' : '下册'
            item.textBookName = cache.textBookName
            return item
        },
        // 跳转教材目录
        oNswitchVersion(value, ietms) {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "classGrade": this.getUserProfileInfo.grade,
                "accountNo": this.getUserInfo.accountNo,
                "areaCode": '',
                "textBookId": this.textBookId || this.textbookVersion[0].textBookId,
                "subjectType": this.subjectType || this.subjectList[0].subjectType,
                "termType": value,
            }
            textbookSelection(params).then(res => {
                if (res.flag) {
                    let storage = window.localStorage;
                    this.subjectType = this.subjectType || this.subjectList[0].subjectType
                    this.textBookId = this.textBookId || this.textbookVersion[0].textBookId
                    let red = this.subjectList.find(value => (value.subjectType == this.subjectType))
                    let cache = this.textbookVersion.find(value => (value.textBookId == this.textBookId))
                    if (!storage.textbook) {
                        let dataFom = []
                        let ietm = this.addTextbooks(red, cache, value)
                        dataFom.push(ietm)
                        storage.setItem("textbook", JSON.stringify(dataFom));
                    } else {
                        let dataFoms = JSON.parse(storage.textbook)
                        let ietm = this.addTextbooks(red, cache, value)
                        dataFoms = dataFoms.filter((item) => (item.subjectTypeName != ietms));
                        dataFoms.unshift(ietm)
                        storage.setItem("textbook", JSON.stringify(dataFoms));
                    }
                    setTimeout(() => {
                        this.$router.go(-1)
                    }, 1000)
                } else {
                    this.$toast(res.msg);
                }

            })
        }
    },
    mounted() {
        if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
            this.grade = this.getUserProfileInfo.grade;
            this.getTextBookVersionByGradeTerm()
        }
    },
    watch: {
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    components: {
        NoResult
    }
}
</script>

<style lang="less" scoped>
/deep/.van-tab--active {
    font-weight: 700;

}

/deep/.van-tabs__line {
    background: #fff;
}

/deep/.van-icon {
    font-size: 16px;
}

.tou {
    .tou-return {
        position: fixed;
        top: 0;
        z-index: 200;
        width: 40px;
        padding-left: 14.5px;
        background: #fff;
        height: 42.23px;
        border: none;
        // line-height: 45.5px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
    }

    .tabs {
        border: none;
        box-sizing: border-box;
        margin: 0 auto;

        /deep/.van-tabs__wrap {
            padding-left: 28px;
            box-sizing: border-box;
        }
    }

    /deep/.van-sidebar-item--select {
        font-weight: 700;
    }

    /deep/.van-sidebar-item--select::before {
        background: #fff;
    }

       .textbookVersion {
        display: flex;
        height: 100vh;

        /deep/ .van-sidebar-item__text {
            width: 42px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            /* autoprefixer: ignore next */
            -webkit-box-orient: vertical;
        }
    }
    .secretary {
        width: 260px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: 0 auto;
        margin-top: 8px;
        
        .image {
            display: flex;
            justify-content: flex-start;
            flex-direction: column;
            position: relative;
            height: 123px;
            width: 104px;
            margin-top: 10px;
            img {
                height: 123px;
                width: 104px;
                object-fit: contain;
            }
            .subjectClss {
                position: absolute;
                font-size: 13px;
                font-weight: 700;
                right: 14.5px;
                top: 23.5px;
            }

            .ageversion {
                position: absolute;
                transform: scale(0.9);
                font-size: 11px;
                font-weight: 500;
                color: #FFFFFF;
                left: 22px;
                top: 45px;
            }
        }

    }
}
</style>
