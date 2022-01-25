<template>
 <div style="background: #f8f8f8;height: 100vh">
     <van-nav-bar title="选择城市" left-text="" :fixed="true" :placeholder="true" :z-index="99" :safe-area-inset-top="true" left-arrow @click-left="onClickLeft" />
     <van-index-bar :index-list="indexList">
         <div v-for="(value,index) in cityList" :key="index">

             <van-index-anchor style="background: #F8F8F8;" :index="value.initial" />
             <div>
                 <van-cell v-for="(imet,i) in value.list" :key="i" :title="imet.name" @click="selectTheCityClick(imet.name)" />
             </div>
         </div>
     </van-index-bar>
 </div>
</template>

<script>
import {
    saveProfileInfo,
    getUserProfileInfo
} from "../../api/user"
import city from '../../utils/city.json'
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {
            cityList: [],
            indexList: 'ABCDEFGHJKLMNOPQRSTWXYZ'.split(""),
        }
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        selectTheCityClick(value) {
            city.city.forEach(valus => {
                valus.list.forEach(ietm => {
                    if (ietm.name == value) {
                        let json = {
                            "interUser": "runLfb",
                            "interPwd": "25d55ad283aa400af464c76d713c07ad",
                            "accountNo": this.getUserInfo.accountNo,
                            "objectTypeCd": "A03", //固定值
                            "areaCode": ietm.code
                        }
                        saveProfileInfo(json).then((data) => {
                            if (!data.flag) {
                                console.log(data.msg)
                                return;
                            }
                            this.$toast(data.msg)
                            this.$router.go(-1)
                        })
                    }
                })
            })
        },
        cityListClick() {
            let i = 1010
            city.city.forEach(valus => {
                valus.list.forEach(ietm => {
                    ietm.code = i++
                })

            })
            this.cityList = city.city
        }
    },
    mounted() {
        // console.log(city)
        this.cityListClick()
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
}
</script>

<style lang="less" scoped>
/deep/.van-cell__title {
    font-weight: 500;
}
</style>
