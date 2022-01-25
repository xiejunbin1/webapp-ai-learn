import axios from "../utils/request"
import * as qs from "qs"

export const textbookSelection = params => {
    return axios.post("resource/saveUserLearningCenterDeploy", qs.stringify({ requestJson: JSON.stringify(params) }))
}

export const learningCenterDirectory = params => {
    return axios.post("teach/getLearnCentreCatalog", qs.stringify({ requestJson: JSON.stringify(params) }))
}
export const videoAuthorization = params => {
    return axios.post("public/stsAuthAccessUrl", qs.stringify({ requestJson: JSON.stringify(params) }))
}

export const createLearnCentreCourse = params => {
    return axios.post("teach/createLearnCentreCourse", qs.stringify({ requestJson: JSON.stringify(params) }))
}

export const updateLearnCentreCourse = params => {
    return axios.post("teach/updateLearnCentreCourse", qs.stringify({ requestJson: JSON.stringify(params) }))
}








