<template>
<div style="background: #f8f8f8;min-height: 100vh; ">
    <div class="player-wrap" id="vWrap">
        <van-nav-bar :title="title" :fixed="true" :placeholder="true" :z-index="99" left-text="" left-arrow @click-left="onClickLeft" />
        <div v-if="this.playerOptions.sources[0].src">
            <video-player id="vide" ref="videoPlayer" 
            class="video-player vjs-custom-skin" 
            :playsinline="true" 
            :options="playerOptions" 
            @play="onPlayerPlay($event)" 
            @pause="onPlayerPause($event)" 
            @ended="onPlayerEnded($event)" 
            @waiting="onPlayerWaiting($event)" 
            @playing="onPlayerPlaying($event)" 
            @statechanged="playerStateChanged($event)" 
            @ready="playerReadied" 
            @timeupdate="onPlayerTimeupdate($event)">
            </video-player>
        </div>
    </div>
    <div class="unit" v-if="List && List.length > 0">
        <div class="unit-tiet">{{ titleName }}</div>
        <div v-for="(value,index) in List" :key="index">
            <div class="unit-text" style="color: #333333;font-weight: 500;">{{ value.nodeName }}</div>
            <ul>
                <li style="font-weight: 400;" v-for="(ietm,index) in value.children" :key="index">
                    <span style="color: #333333" @click="videoPracticeClick(ietm, value)">{{ ietm.nodeName }}</span>
                    <span class="lianxi" @click="exercise(ietm, value)">
                        <img :src="ietm.onlineCourseLearningDetail ? learningCenter1 : learningCenter2" alt="">
                        <span :style="ietm.onlineCourseLearningDetail === null ? 'color: #CDCDCD' : 'color: #5981F9'">练习</span>
                    </span>
                </li>
            </ul>
        </div>
    </div>
    <NoResult class="mgt30" v-else></NoResult>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    learningCenterDirectory,
    videoAuthorization,
    createLearnCentreCourse,
    updateLearnCentreCourse
} from '../../api/learningCenter'
import {
    createHuiXueTask
} from "@/api/teach"
import {
    arrToTree
} from '@/utils/arrToTree.js'
import NoResult from '../../components/NoResult/index'
export default {
    data() {
        return {
            title: '',
            videoLength: 0,
            playerOptions: {
                // playbackRates : [ 0.5, 1.0, 1.5, 2.0, 3.0, 4.0, 5.0, 16.0 ], //可选择的播放速度
                autoplay: false, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                sources: [{
                    type: "video/mp4",
                    src: ''
                }],
                // poster: '', //你的封面地址
                // width: document.documentElement.clientWidth,
                notSupportedMessage: '此视频暂无法播放，请稍后再试', //允许覆盖Video.js无法播放媒体源时显示的默认信息。
                controlBar: {
                    timeDivider: true, //当前时间和持续时间的分隔符
                    durationDisplay: true, //显示持续时间
                    remainingTimeDisplay: false, //是否显示剩余时间功能
                    fullscreenToggle: true //全屏按钮
                }
            },
            gklog: '', //视频观看时长
            List: [],
            grade: '',
            id: this.$route.query.id,
            subjectType: this.$route.query.subjectType,
            textBookId: this.$route.query.textBookId,
            termType: this.$route.query.termType,
            Daty: '',
            titleName: '',
            learningCenter1: require('../../assets/img/learningCenter/1.png'),
            learningCenter2: require('../../assets/img/learningCenter/2.png'),
        }
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        // 同态添加编辑图片
        contactPicture() {
            this.List.forEach(value => {
                value.children.sort(function (a, b) {
                    return a.indexNo - b.indexNo;
                })
            })
        },
        // 获取当前教材版本从缓存中拿到
        judgmentMaterials() {
            let storage = window.localStorage;
            let textBook = JSON.parse(storage.textbook)
            let subjectType = this.subjectType
            console.log(textBook,"textBook" ,subjectType)
            let arr = textBook.find(v => (v.subjectType == subjectType))
            return arr
        },

        // 获取教材信息
        learningCenterDirectory() {
            return new Promise((resolve, reject) => {
                let params = {}
                console.log(this.textBookId,this.termType,this.subjectType, 'this.subjectTypethis.subjectType')
                if (this.textBookId) {
                    params = {
                        "interUser": "runLfb",
                        "interPwd": "25d55ad283aa400af464c76d713c07ad",
                        "operateAccountNo": this.getUserInfo.accountNo,
                        "accountNo": this.getUserInfo.accountNo,
                        "classGrade": this.grade,
                        "textBookId": this.textBookId,
                        "termType": this.termType,
                        "subjectType": this.subjectType
                    }
                } else {
                    let arr = this.judgmentMaterials()
                    console.log(arr,"arrarrarr")
                    params = {
                        "interUser": "runLfb",
                        "interPwd": "25d55ad283aa400af464c76d713c07ad",
                        "operateAccountNo": this.getUserInfo.accountNo,
                        "accountNo": this.getUserInfo.accountNo,
                        "classGrade": this.grade,
                        "textBookId": arr.textBookId,
                        "termType": arr.termType,
                        "subjectType": arr.subjectType
                    }
                }
                learningCenterDirectory(params).then(async (res) => {
                    if (res.flag) {
                        let list = res.data
                        let bookCourseListTermT01 = null
                        bookCourseListTermT01 = arrToTree(list, 'nodeId', 'parentId');
                        bookCourseListTermT01 = JSON.parse(JSON.stringify(bookCourseListTermT01))
                        this.List = bookCourseListTermT01[0].children
                       
                        this.contactPicture()
                        resolve(this.List)
                    }
                })
            })
        },
        // 获取当前播放的视频对象
        getTheVideo(res) {
            let a = {}
            res.forEach(arr => {
                arr.children.forEach(v => {
                    if (v.courseId == this.id) {
                        a.children = arr
                        a.add = v
                    }
                })
            })
            return a
        },
        // OSS 授权
        ossAuthorization() {
            this.learningCenterDirectory().then(res => {
                let arr = this.getTheVideo(res)
                if (!arr.add) {
                    this.$toast('该课程没有学习课件')
                    return false
                }
                if (!arr.add.resHuiXueResourceRelationVoList) {
                    this.$toast('该课程没有学习课件')
                    return false
                }
                this.titleName = this.getUserInfo.titleName
                this.title = arr.add.nodeName
                // this.playerOptions.poster = arr.add.url
                if (arr.add.onlineCourseLearningDetail.learningStatus != "S03") {
                    console.log("888888888888888")
                    this.gklog = arr.add.onlineCourseLearningDetail.learningDuration
                }else {
                    console.log("8888888888888887777")
                    this.gklog = 0
                }
                let fomdeta = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "belongSchoolId": this.getUserProfileInfo.schoolId || -1,
                    "url": arr.add.resHuiXueResourceRelationVoList[0].resCoursewareInfo.dstUrl
                }
                videoAuthorization(fomdeta).then(rde => {
                    // this.playerOptions.poster = rde.data[0].accessUrl + '?spm=a2c4g.11186623.2.1.yjOb8V&x-oss-process=video/snapshot,t_7000,f_jpg,w_800,h_600,m_fast';
                    // console.log(this.playerOptions.poster)
                    this.playerOptions.sources[0].src = rde.data[0].accessUrl
                })
            })
        },
        // 返回所有课程
        allChapters() {
            let data = []
            this.List.forEach(v => {
                v.children.forEach(iemt => {
                    if (iemt.nodeType == "N00") {
                        data.push(iemt)
                    }
                })
            })
            return data
        },
        // 切换课程
        videoPracticeClick(item, values) {
            if (!item.onlineCourseLearningDetail) {
                let arr = this.judgmentMaterials()
                let data = this.allChapters()
                let params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "accountNo": this.getUserInfo.accountNo,
                    "classGrade": this.grade,
                    "textBookId": arr.textBookId,
                    "termType": arr.termType,
                    "subjectType": arr.subjectType,
                    "sysCourseId": item.courseId,
                    "totalChapterNum": data.length,
                    "parentId": values.parentId
                }
                createLearnCentreCourse(params).then(res => {
                    this.learningCenterDirectory()
                    setTimeout(() => {
                        data.forEach(value => {
                            if (value.courseId == item.courseId) {
                                if (!value.resHuiXueResourceRelationVoList) {
                                    this.$toast('该课程没有学习课件')
                                    return false
                                }
                                this.id = value.courseId
                                this.ossAuthorization()
                            }
                        })
                    }, 1000)
                })
                return false
            }
            if (!item.resHuiXueResourceRelationVoList) {
                this.$toast('该课程没有学习课件')
                return false
            } else {
                this.id = item.courseId
                this.ossAuthorization()
            }
        },
        // 保存视频播放进度
        saveVideoProgress(values) {
            let arr = this.getTheVideo(this.List)
            console.log(arr)
            if( Object.keys(arr).length == 0){
                return false
            }
            let ree = []
            arr.children.children.forEach(v => {
                ree.push(v.courseId)
            })
            if (arr.add.onlineCourseLearningDetail.learningStatus == "S03") {
                values = 'S03'
            }
            let fonmData = {}
            if (this.textBookId) {
                fonmData = {
                    "interUser": 'runLfb',
                    "interPwd": '25d55ad283aa400af464c76d713c07ad',
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "accountNo": this.getUserInfo.accountNo,
                    "learningDetailId": arr.add.onlineCourseLearningDetail.learningDetailId,
                    "learningProgressId": arr.add.onlineCourseLearningDetail.learningProgressId,
                    "recordId": arr.add.onlineCourseLearningDetail.onlineCourseId,
                    "sysCourseId": arr.add.courseId,
                    "parentId": arr.add.parentId,
                    "sysCourseIdList": ree.join(),
                    "learningDuration": parseInt(this.Daty),
                    "learningStatus": values,
                    learningRate: Math.ceil(this.Daty / this.videoLength * 100),
                    "subjectType": this.subjectType,
                    "classGrade": this.grade,
                    "termType": this.termType,
                }
            } else {
                let add = this.judgmentMaterials()
                fonmData = {
                    "interUser": 'runLfb',
                    "interPwd": '25d55ad283aa400af464c76d713c07ad',
                    "operateAccountNo": this.getUserInfo.accountNo,
                    "accountNo": this.getUserInfo.accountNo,
                    "learningDetailId": arr.add.onlineCourseLearningDetail.learningDetailId,
                    "learningProgressId": arr.add.onlineCourseLearningDetail.learningProgressId,
                    "recordId": arr.add.onlineCourseLearningDetail.onlineCourseId,
                    "sysCourseId": arr.add.courseId,
                    "parentId": arr.add.parentId,
                    "sysCourseIdList": ree.join(),
                    "learningDuration": parseInt(this.Daty),
                    "learningStatus": values,
                    learningRate: Math.ceil(this.Daty / this.videoLength * 100),
                    "subjectType": add.subjectType,
                    "classGrade": this.grade,
                    "termType": add.termType,
                }
            }

            updateLearnCentreCourse(fonmData).then(res => {

            })
        },

        exercise(item, values) {
            if (!item.onlineCourseLearningDetail) {
                this.$toast('请先学习微课再进行练习')
            }
            if (item.onlineCourseLearningDetail.learningStatus == 'S03') {
                let jianji = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
                let add = this.judgmentMaterials()
                //命名规则：年级学科+练习+年月日时分
                const taskName = jianji + add.subjectTypeName + '练习' + this.$moment().format('YYYYMMDDHHmm')
                const params = {
                    "interUser": "runLfb",
                    "interPwd": "25d55ad283aa400af464c76d713c07ad",
                    "accountNo": this.getUserInfo.accountNo,

                    "subjectType": add.subjectType,
                    "classGrade": add.classGrade,
                    "termType": add.termType,
                    "sysCourseIdList": [item.courseId],
                    "examRuleList": [{
                        "type": "T01", //选择题
                        "cnt": 20, //20道
                        "score": 5 //每道5分
                    }],
                    "shareType": 'S03',
                    "diffLevel": null,
                    "degree": "D02",
                    "duration": 0, //写死
                    "taskName": taskName,
                    "taskType": 'T23', //练习
                    "usedList": [{
                        resourceType: 'R97', //章节
                        resourceId: values.nodeId
                    }, ]
                }
                createHuiXueTask(params).then(res => {
                    if (res.flag) {
                        let query = {
                            taskId: res.data.taskId,
                            tchCourseId: res.data.tchCourseId,
                        }
                        this.$router.push({
                            path: '/togetherPractice',
                            query: query
                        })
                    } else {
                        let msg = res.msg || '创建失败';
                        this.$toast(msg)
                    }
                })
            } else {
                this.$toast('请先学习微课再进行练习')
            }
        },

        // 播放回调
        onPlayerPlay(player) {
            player.currentTime(this.gklog);
            this.videoLength = player.duration();
        },

        // 暂停回调
        onPlayerPause(player) {
            this.gklog = this.Daty 
            console.log(this.gklog,"this.gklogthis.gklogthis.gklog")
        },

        // 视频播完回调
        onPlayerEnded(player) {
            this.saveVideoProgress("S03")
            // 视频播放完毕后重置视频
            this.gklog = 0
            this.$refs.videoPlayer.player.src(this.playerOptions.sources[0].src)
        },

        // DOM元素上的readyState更改导致播放停止
        onPlayerWaiting(player) {
            //   console.log(player)
        },

        // 已开始播放回调
        onPlayerPlaying(player) {
            //   console.log(player)
        },
        // 点击全屏 调用原生横竖屏
        onPlayerTimeupdate(player) {
            if ("cordova" in window) {
                if (player.player_.isFullscreen_ == true) {
                    screen.orientation.lock('landscape');
                } else {
                    screen.orientation.lock('portrait');
                }
            }
        },
        //播放状态改变回调
        playerStateChanged(playerCurrentState) {
            this.Daty = playerCurrentState.timeupdate == undefined ? this.Daty : playerCurrentState.timeupdate
        },

        //将侦听器绑定到组件的就绪状态。与事件监听器的不同之处在于，如果ready事件已经发生，它将立即触发该函数。。
        playerReadied(player) {
            this.playerOptions.autoplay = true
            // 禁用进度条
            document.getElementsByClassName('vjs-progress-control')[0].style.pointerEvents = 'none'
        },

        // 全屏按钮
        fullScreenHandle() {

            if (!this.myPlayer.isFullscreen()) {
                this.myPlayer.requestFullscreen()
                this.myPlayer.isFullscreen(true)
            } else {
                this.myPlayer.exitFullscreen()
                this.myPlayer.isFullscreen(false)
            }
        },

    },
    mounted() {
        if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
            this.grade = this.getUserProfileInfo.grade;
        }
        this.ossAuthorization()
    },
    beforeDestroy() {
        this.saveVideoProgress("S02")
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
/deep/.video-js {
    width: 100%;
    height: 180px;
}

/*播放按钮设置成宽高一致，圆形，居中*/
/deep/.vjs-custom-skin>.video-js .vjs-big-play-button {
    background-color: rgba(0, 0, 0, 0.45);
    font-size: 3.5em;
    border-radius: 50%;
    height: 2em !important;
    line-height: 2em !important;
    margin-top: -1em !important;
    margin-left: -1em !important;
    width: 2em !important;
    outline: none;
}

/deep/.video-js .vjs-big-play-button .vjs-icon-placeholder:before {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
}

/*control-bar布局时flex，通过order调整剩余时间的位置到进度条右边*/
/deep/.vjs-custom-skin>.video-js .vjs-control-bar .vjs-remaining-time {
    order: 3 !important;
}

/*进度条背景轨道*/
/deep/.video-js .vjs-slider {
    border-radius: 1em;
}

/*进度条进度*/
/deep/.vjs-custom-skin>.video-js .vjs-play-progress,
.vjs-custom-skin>.video-js .vjs-volume-level {
    border-radius: 1em;
}

/*鼠标进入播放器后，播放按钮颜色会变*/
/deep/.video-js:hover .vjs-big-play-button,
.vjs-custom-skin>.video-js .vjs-big-play-button:active,
.vjs-custom-skin>.video-js .vjs-big-play-button:focus {
    background-color: rgba(0, 0, 0, 0.4) !important;
}

/*control bar*/
/deep/.video-js .vjs-control-bar {
    background-color: rgba(0, 0, 0, 0.2) !important;
}

/*点击按钮时不显示蓝色边框*/
/deep/.video-js .vjs-control-bar button {
    outline: none;
}

/deep/.video-js {
    width: 100%;
}

/deep/.video-js .vjs-tech {
    width: 100%;
    height: 100%;
}

/deep/.vjs-progress-control {
    // display: none;
}

.unit {
    width: 345px;
    background: #fff;
    height: 100%;
    margin: 0 auto;
    margin-top: 20px;
    border-radius: 10px;
    box-shadow: 3px 3px 3px #DCDCDC;
    padding: 20px;
    box-sizing: border-box;

    .unit-tiet {
        width: 100%;
        color: #333333;
        font-size: 18px;
        font-weight: 500;
        text-align: center;
    }

    .unit-text {
        font-weight: 700;
        font-size: 15px;
        padding-top: 20px;
        box-sizing: border-box;
    }

    ul li {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        color: #333333;
        border-bottom: 1px solid #DDDDDD;

        .lianxi {
            display: flex;
            align-items: center;
            color: #CDCDCD;

            img {
                width: 15px;
                height: 15px;
            }
        }
    }
}
</style>
