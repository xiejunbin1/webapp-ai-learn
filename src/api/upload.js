import axios from '../utils/request'
import * as qs from 'qs'
//上传鉴权
export const stsAuthCoverAccessUrl = params => {
    return axios.post('/public/stsAuthUploadPolicyForDirect', qs.stringify({requestJson:JSON.stringify(params)})).then((respone) => {
    //   console.log('stsAuthUploadPolicyForDirect ', respone.data)
      return respone
    })
}

export const doUpLoad = (url, data) => {
    return new Promise((resolve, reject) => {
      console.log(data)
      axios({
        url: url,
        method: 'post',
        data: data,
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 0
        // onUploadProgress(e) {
        //   console.log(e.loaded,'======');
        // }
      })
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }