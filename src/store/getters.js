/*
 * @Author: wgj
 * @Date: 2021-03-22 19:53:07
 * @LastEditTime: 2021-04-21 13:33:15
 * @LastEditors: wgj
 * @Description: 
 */

const getters = {
  // 绑定管理筛选数据
  getBindFilter: state => state.bind.bindFilter,
  getDetailRouter: state => state.bind.detailRouter,
  getUserInfo: state => state.user.userInfo,
  getHasLogin: state => state.user.hasLogin,
  getEyeType: state => state.user.eyeType,
  getUserProfileInfo: state => state.user.profileInfo,
  getIsLoading: state => state.setting.isLoading,
  getIsError: state => state.setting.isError,


}
export default getters
