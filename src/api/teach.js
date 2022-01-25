
import axios from "../utils/request"
import * as qs from "qs"

//诊断任务创建
export const createDiagnosisTask = params => {
    return axios.post("teach/createDiagnosisTask", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//查询创建的任务
export const getCourseTaskDetail = params => {
    return axios.post("teach/getCourseTaskDetail", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//每道题作答
export const saveExamAnswer = params => {
    return axios.post("teach/saveExamAnswer", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//交卷
export const commitExamResultV3 = params => {
    return axios.post("teach/commitExamResultV3", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//诊断报告
export const getHuiXueTaskDetail = params => {
    return axios.post("teach/getHuiXueTaskDetail", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//学习建议
export const getStudySuggestion = params => {
    return axios.post("teach/getStudySuggestion", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//查询练习基地（一个课程完成后的练习）、单元测试(一个单元课程完成后的练习)、综合测试(一个教材版本课程完成后的练习)
export const getUserPracticeInfoList = params => {
    return axios.post("teach/getUserPracticeInfoList", qs.stringify({ requestJson: JSON.stringify(params) }))
}

//练习，测试任务创建
export const createHuiXueTask = params => {
    return axios.post("teach/createHuiXueTask", qs.stringify({ requestJson: JSON.stringify(params) }))
}

// 诊断记录
export const getHuiXueTaskList = params => {
    return axios.post("teach/getHuiXueTaskList", qs.stringify({ requestJson: JSON.stringify(params) }))
}

export const getLearningRecordList = params => {
    return axios.post("teach/getLearningRecordList", qs.stringify({ requestJson: JSON.stringify(params) }))
}