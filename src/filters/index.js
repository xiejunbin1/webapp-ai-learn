export function getGradeName(grade) {
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

export function getSubjectName(subject) {
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



export function getTermTypeName(termType){
    let termTypeName = ''
    switch (termType) {
      case 'T01':
        termTypeName = '上册'
        break
      case 'T02':
        termTypeName = '下册'
        break
    }
    return termTypeName
}

export function getTitleDegree(titleDegree){
  let titleDegreeName = ''
  switch (titleDegree) {
    case 'D01':
      titleDegreeName = '简单'
      break
    case 'D02':
      titleDegreeName = '中等'
      break
    case 'D03':
      titleDegreeName = '困难'
      break
  }
  return titleDegreeName
}

export function getPracticeTypeName(practiceType){
  let practiceTypeName = ''
  switch (practiceType) {
    case 'P01':
      practiceTypeName = '开始练习'
      break
    case 'P02':
      practiceTypeName = '继续练习'
      break
    case 'P03':
      practiceTypeName = '重新练习'
      break
  }
  return practiceTypeName
}
//获取学科书本图片链接
export function changeTheTeachingPicture(subjectName){
  let url = ''
  switch (subjectName) {
    case '语文':
        url = require('@/assets/img/learningCenter/shuben2.png');
        break;
    case '数学':
        url = require('@/assets/img/learningCenter/shuben1.png');
        break;
    case '英语':
        url = require('@/assets/img/learningCenter/shuben3.png');
        break;
    case '物理':
        url = require('@/assets/img/learningCenter/shuben1.png');
        break;
    case '化学':
        url = require('@/assets/img/learningCenter/shuben2.png');
        break;
    case '政治':
        url = require('@/assets/img/learningCenter/shuben.png');
        break;
    case '历史':
        url = require('@/assets/img/learningCenter/shuben.png');
        break;
    case '生物':
        url = require('@/assets/img/learningCenter/shuben3.png');
        break;
    case '地理':
        url = require('@/assets/img/learningCenter/shuben3.png');
        break;
  }
  return url
}