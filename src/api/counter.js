
import axios from "../utils/request"
import * as qs from "qs"

export const getUserLearningInfo = params => {
return axios.post("counter/getUserLearningInfo", qs.stringify({ requestJson: JSON.stringify(params) }))
}