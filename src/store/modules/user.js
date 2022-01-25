const user = {
  state: {
    userInfo: null,//用户信息
    hasLogin:false,//登录状态
    profileInfo: null
  },

  mutations: {

    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo
    },
    setHasLogin: (state, hasLogin) => {
      state.hasLogin = hasLogin
    },
    setEyeType: (state, eyeType) => {
      state.eyeType = eyeType
    },
    setUserProfileInfo: (state, profileInfo) => {
      state.profileInfo = profileInfo
    },
  },
  actions: {}
}

export default user
