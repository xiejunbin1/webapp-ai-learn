<template>
  <div style="background: #f8f8f8;min-height: 100vh; ">
    <ChooseTextBook :subjectActiveIndex.sync="active" :subjectList="subjectList" :textBookObj="textBookObj" @onClickLeft="onClickLeft" @changeSubject="onClick" @switchVersion="switchVersion">
      <div slot="content">
        <div class="unit" v-if="List && List.length > 0">
          <div v-for="(value,index) in List" :key="index">
            <div class="unit-text" style="color: #333333;font-weight: 500;">{{ value.nodeName }}</div>
            <ul>
              <li style="font-weight: 400;" v-for="(ietm,index) in value.children" :key="index">
                <span class="videoPractice" @click="videoPracticeClick(ietm)">{{ ietm.nodeName }}</span>
                <span class="lianxi" @click="exercise(ietm,value)">
                  <img :src="ietm.onlineCourseLearningDetail ? learningCenter1 : learningCenter2" alt="">
                  <span :style="ietm.onlineCourseLearningDetail === null ? 'color: #CDCDCD' : 'color: #5981F9'">练习</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ChooseTextBook>
    <NoResult class="all-center" v-if="!subjectList || subjectList.length<=0 && !List || List.length<=0"></NoResult>
    <NoResult class="all-center" v-else-if="!subjectList || subjectList.length<=0"></NoResult>
    <NoResult class="mgt30" v-else-if="!List || List.length<=0"></NoResult>
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
  learningCenterDirectory,
  createLearnCentreCourse
} from '../../api/learningCenter'
import {
  arrToTree
} from '@/utils/arrToTree.js'
import ChooseTextBook from "@/components/ChooseTextBook"
import NoResult from '../../components/NoResult/index'
import {
  createHuiXueTask
} from "@/api/teach"
export default {
  data() {
    return {
      active: 0,
      subjectList: [],
      textBookObj: {},
      subject: '',
      grade: '',
      List: [],
      subjectType: '',
      textbookVersion: '',
      age: '',
      version: '',
      learningCenter1: require('../../assets/img/learningCenter/1.png'),
      learningCenter2: require('../../assets/img/learningCenter/2.png'),
      url: '',
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    // 切换版本
    switchVersion() {
      this.$router.push({
        name: 'switchVersion',
        query: {
          subjectType: this.textBookObj.subjectType
        }
      })
    },
    // 导航栏切换
    onClick(title) {
      console.log(this.textBookObj)
      this.subject = title
      this.textbookInformation()
      this.learningCenterDirectory()
      let storage = window.localStorage;
      let textBook = JSON.parse(storage.textbook)
      let add = textBook.find(v => (v.subjectTypeName == title))
      if (add) {
        for (var i = 0; i < textBook.length; i++) {
          if (textBook[i].subjectType === this.subjectList[this.active].subjectType) {
            textBook.splice(i, 1);
            break;
          }
        }
        textBook.unshift(add);
        storage.setItem("textbook", JSON.stringify(textBook));
      }
    },
    // 获取当前学科
    judgmentMaterials() {
      let storage = window.localStorage;
      let arr = null
      if (storage.textbook) {
        let textBook = JSON.parse(storage.textbook)
        arr = textBook.find(v => (v.subjectType == this.textBookObj.subjectType))
      }
      return arr
    },
    // 教材信息
    textbookInformation() {
      return new Promise((resolve, reject) => {
        console.log(this.subjectList, "this.subjectList")
        if (this.subjectList.length > 0) {
          try {
            let storage = window.localStorage;
            let textBook = JSON.parse(storage.textbook)
            this.subject = this.subject || textBook[0].subjectTypeName
            let arrt = textBook.find(v => (v.subjectTypeName == this.subject))
            this.textBookObj = arrt || textBook[0]
            this.subjectList.forEach((value, index) => {
              if (arrt.subjectTypeName == value.subjectTypeName) {
                this.active = index
              }
            })
            resolve('成功')
          } catch (e) {
            console.log(e)
            resolve('失败')
            this.$router.push({
              path: '/switchVersion',
              query: {
                subjectType: this.subjectList[this.active].subjectType || ''
              }
            })
          }
        }
      })

    },
    //年级学科信息
    getGradeSubjectTypeRelationList() {
      return new Promise((resolve, reject) => {
        let params = {
          "interUser": "runLfb",
          "interPwd": "25d55ad283aa400af464c76d713c07ad",
          "accountNo": this.getUserInfo.accountNo,
          "classGrade": this.grade
        }
        getGradeSubjectTypeRelationList(params).then(res => {
          if (res.flag) {
            this.subjectList = res.data || [];
            this.textbookInformation().then((v) => {
              if (v == '成功') {
                this.learningCenterDirectory()
                resolve(this.subjectList)
              }
            })
          } else {
            this.$toast(res.msg)
            resolve(this.subjectList)
          }
        })
      })
    },
    // 练习图片切换
    practicePictureSwitching() {
      this.List.forEach(value => {
        if (value.children) {
          value.children.sort(function (a, b) {
            return a.indexNo - b.indexNo;
          })
        }
      })
    },
    // 学习课件获取
    async learningCenterDirectory() {
      let arr = this.judgmentMaterials()
      let params = {
        "interUser": "runLfb",
        "interPwd": "25d55ad283aa400af464c76d713c07ad",
        "operateAccountNo": this.getUserInfo.accountNo,
        "accountNo": this.getUserInfo.accountNo,
        "classGrade": this.grade,
        "textBookId": arr.textBookId,
        "termType": arr.termType,
        "subjectType": arr.subjectType
      }
      learningCenterDirectory(params).then((res) => {
        if (res.flag) {
          let list = res.data
          let bookCourseListTermT01 = null
          bookCourseListTermT01 = arrToTree(list, 'nodeId', 'parentId');
          bookCourseListTermT01 = JSON.parse(JSON.stringify(bookCourseListTermT01))
          if (bookCourseListTermT01.length == 0) { this.List = []; return false }
          this.List = bookCourseListTermT01[0].children
          console.log(this.List, "this.Listthis.Listthis.List")
          this.practicePictureSwitching()
        } else {
          this.$toast(res.msg)
        }
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
    // 选择课程
    videoPracticeClick(item) {
      console.log(8888888)
      let arr = this.judgmentMaterials()
      console.log(arr, "88888")
      console.log(!item.onlineCourseLearningDetail)
      if (!item.onlineCourseLearningDetail) {
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
          "parentId": item.parentId
        }
        createLearnCentreCourse(params).then(res => {
          if (res.flag) {
            this.learningCenterDirectory()
            setTimeout(() => {
              if (data.length == 0) {
                this.$toast('该课程没有学习课件')
                return false
              }
              data.forEach(value => {
                if (value.courseId == item.courseId) {
                  this.jumpToVideoPlaybackPage(value)
                }
              })
            }, 1000)
          }
        })
        return false
      }
      this.jumpToVideoPlaybackPage(item)
    },
    exercise(item, values) {
      if (!item.onlineCourseLearningDetail) {
        this.$toast('请先学习微课再进行练习')
        return
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
          },]
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
    // 跳转视频播放页
    jumpToVideoPlaybackPage(item) {
      if (!item.resHuiXueResourceRelationVoList) {
        this.$toast('该课程没有学习课件')
        return false
      }
      let arr = this.judgmentMaterials()
      let userInfo = this.$store.getters.getUserInfo;
      let classGrade = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
      let titleName = `${arr.textBookName}${classGrade}${arr.subjectTypeName}${arr.termTypeName}`
      userInfo.titleName = titleName;
      this.$store.commit('setUserInfo', userInfo)
      let id = item.resHuiXueResourceRelationVoList[0].objectId
      console.log(this.subjectList, "this.subjectType------------")
      this.$router.push({
        name: 'videoPractice',
        query: {
          subjectType: this.subjectType == '' ? this.subjectType = arr.subjectType : this.subjectType = this.subjectType,
          id: id
        }
      })

    },
  },
  async mounted() {
    if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
      this.grade = this.getUserProfileInfo.grade;
      await this.getGradeSubjectTypeRelationList()
    }
  },
  computed: {
    ...mapGetters({
      getUserInfo: 'getUserInfo',
      getUserProfileInfo: 'getUserProfileInfo',
      getHasLogin: 'getHasLogin'
    })
  },
  components: {
    NoResult,
    ChooseTextBook
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
    height: 44px;
    border: none;
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
    .secretary {
      width: 345px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 0.533vw 2.133vw 0 rgb(220 220 220 / 50%);
      height: 155px;
      margin: 0 auto;
      margin-top: 20px;
      display: flex;
      align-items: center;
      .secretary-left {
        height: 80%;
        font-size: 15px;
        font-weight: 700;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        color: #333333;
        div:nth-child(1) {
          margin-left: 25px;
        }
        div:nth-child(2) {
          font-size: 12px;
          color: #5981f9;
          width: 90px;
          height: 30px;
          border: 1px solid #5981f9;
          text-align: center;
          border-radius: 20px;
          line-height: 35px;
          margin-left: 20px;
        }
      }
    }
    .unit {
      width: 345px;
      background: #fff;
      height: 100%;
      margin: 0 auto;
      margin-top: 20px;
      border-radius: 10px;
      box-shadow: 0 0.533vw 2.133vw 0 rgb(220 220 220 / 50%);
      padding: 20px;
      box-sizing: border-box;
      .unit-text {
        font-weight: 700;
        font-size: 17px;
        padding-top: 20px;
        box-sizing: border-box;
        padding-bottom: 10px;
      }
      ul li {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 15px;
        color: #333333;
        border-bottom: 1px solid #dddddd;
        padding: 5px 0;
        .videoPractice {
          width: 200px;
          text-overflow: ellipsis;
        }
        .lianxi {
          display: flex;
          align-items: center;
          color: #cdcdcd;

          img {
            width: 15px;
            height: 15px;
            object-fit: contain;
          }
        }
      }
    }
    .image {
      position: relative;
      height: 105px;
      width: 85px;
      margin-left: 34px;
      img {
        height: 105px;
        width: 85px;
        object-fit: contain;
      }
      .subjectClss {
        position: absolute;
        font-size: 13px;
        font-weight: 700;
        right: 10.5px;
        top: 20.5px;
      }
      .ageversion {
        position: absolute;
        transform: scale(0.8);
        font-size: 11px;
        font-weight: 500;
        color: #ffffff;
        left: 15px;
        top: 38px;
      }
    }
  }
}
</style>