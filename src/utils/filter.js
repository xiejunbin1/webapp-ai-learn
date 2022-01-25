// 时间戳转换为yyyyMMddHHmmss
let generateTimeReqestNumber = () => {
    var date = new Date()
    return date.getFullYear().toString() + pad2(date.getMonth() + 1) + pad2(date.getDate()) + pad2(date.getHours()) + pad2(date.getMinutes()) + pad2(date.getSeconds())
  
  }
  let randomString = (len) => {
    len = len || 32
    var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
    var maxPos = $chars.length
    var pwd = ''
    for (let i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return pwd
  }
  let pad2 = (n) => {
    return n < 10 ? '0' + n : n
  }

let getSubjectName=(subject)=> {
    let subjectName = '其他'
    switch (subject) {
      case 'S01':
        subjectName = '语文'
        break
      case 'S02':
        subjectName = '数学'
        break
      case 'S03':
        subjectName = '英语'
        break
      case 'S04':
        subjectName = '物理'
        break
      case 'S05':
        subjectName = '化学'
        break
      case 'S06':
        subjectName = '政治'
        break
      case 'S07':
        subjectName = '历史'
        break
      case 'S08':
        subjectName = '生物'
        break
      case 'S09':
        subjectName = '地理'
        break
    }
    return subjectName
}

let getGradeName=(grade)=> {
  let gradeName = '其他'
  switch (grade) {
    case 'G01':
      gradeName = '一年级'
      break
    case 'G02':
      gradeName = '二年级'
      break
    case 'G03':
      gradeName = '三年级'
      break
    case 'G04':
      gradeName = '四年级'
      break
    case 'G05':
      gradeName = '五年级'
      break
    case 'G06':
      gradeName = '六年级'
      break
    case 'G07':
      gradeName = '初一'
      break
    case 'G08':
      gradeName = '初二'
      break
    case 'G09':
      gradeName = '初三'
      break
    case 'G10':
      gradeName = '高一'
      break
    case 'G11':
      gradeName = '高二'
      break
    case 'G12':
      gradeName = '高三'
      break
  }
  return gradeName
}
// 更改教学图片
let changeTheTeachingPicture = (value) => {
  let url = ''
  switch (value) {
    case '语文':
      url = require('../../src/assets/img/learningCenter/shuben2.png');
      break;
    case '数学':
      url = require('../../src/assets/img/learningCenter/shuben1.png');
      break;
    case '英语':
      url = require('../../src/assets/img/learningCenter/shuben3.png');
      break;
    case '物理':
      url = require('../../src/assets/img/learningCenter/shuben1.png');
      break;
    case '化学':
      url = require('../../src/assets/img/learningCenter/shuben2.png');
      break;
    case '政治':
      url = require('../../src/assets/img/learningCenter/shuben.png');
      break;
    case '历史':
      url = require('../../src/assets/img/learningCenter/shuben.png');
      break;
    case '生物':
      url = require('../../src/assets/img/learningCenter/shuben3.png');
      break;
    case '地理':
      url = require('../../src/assets/img/learningCenter/shuben3.png');
      break;
  }
  return url
}

let datrasx = (diagnosticList) => {
  diagnosticList.forEach((value, index) => {
      let str = value.diagnoseVolumeAttributes
      if (RegExp(/语文/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/yuWen.png')
          diagnosticList[index].Textbook = '语文'
      }
      if (RegExp(/数学/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/shuXue.png')
          diagnosticList[index].Textbook = '数学'
      }
      if (RegExp(/英语/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/yingYu.png')
          diagnosticList[index].Textbook = '英语'
      }
      if (RegExp(/地理/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/diLi.png')
          diagnosticList[index].Textbook = '地理'
      }
      if (RegExp(/化学/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/huaXue.png')
          diagnosticList[index].Textbook = '化学'
      }
      if (RegExp(/生物/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/shengWu.png')
          diagnosticList[index].Textbook = '生物'
      }
      if (RegExp(/历史/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/Lishi.png')
          diagnosticList[index].Textbook = '历史'
      }
      if (RegExp(/政治/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/zhengZhi.png')
          diagnosticList[index].Textbook = '政治'
      }
      if (RegExp(/物理/).test(str)) {
          diagnosticList[index].url = require('../assets/img/testRoom/wuLi.png')
          diagnosticList[index].Textbook = '物理'
      }
  });

  return diagnosticList
}

export {
  generateTimeReqestNumber,
  randomString,
  getSubjectName,
  getGradeName,
  changeTheTeachingPicture,
  datrasx
}