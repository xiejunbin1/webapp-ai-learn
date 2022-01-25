<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar fixed placeholder title="个人信息" left-text="" left-arrow @click-left="onClickLeft" />
    <div class="avatar" @click="avatarChange">
        <div class="avatar_left">
            <span style="color:#333333;font-weight: 500">个人头像</span>
        </div>
        <div class="avatar_right">
            <span class="avatar-Img">
                <img :src="getUserInfo&&getUserInfo.iconUrl?getUserInfo.iconUrl:defaultPhotoUrl" alt="">
            </span>
            <van-icon name="arrow" size="17px" color="#666666" />
        </div>

        <input type="file" id="fileSelect" name="image" accept="image/*" style="display: none;" />
        <!-- <input type="file" @change="text" name="image" accept="image/*"  /> -->

    </div>
    <div style="margin-top: 10px;">
        <van-cell title="真实姓名" is-link :value="fonmData.name || '请输入姓名'" @click="editClick('真实姓名')" />
        <van-cell title="性别" is-link :value="fonmData.gender || '请选择性别'" @click="editClick('性别')" />
        <van-cell title="所在城市" is-link :value="fonmData.city || '请选择城市'" @click="editClick('所在城市')" />
        <van-cell title="所在学校" is-link :value="fonmData.school || '请选择所在学校'" @click="editClick('所在学校')" />
        <van-cell title="就读年级" is-link :value="fonmData.Age || '请选择就读年纪'" @click="editClick('就读年纪')" />
    </div>
    <!-- 编辑姓名 -->
    <van-dialog v-model="actualNameShow" show-cancel-button @confirm='actualNameClick'>
        <div style="text-align: center;margin-top: 5px;">真实姓名</div>
        <div style="margin-top: 10px;">
            <van-cell-group>
                <van-field v-model="name" :formatter="formatter" label="真实姓名" placeholder="请输入用户名" />
            </van-cell-group>
        </div>
    </van-dialog>
    <!-- 性别 -->
    <van-action-sheet v-model="genderShow" :actions="genderList" @select="onSelect" title="性别选择" />
    <!-- 所在学校 -->
    <van-dialog v-model="schoolShow" show-cancel-button @confirm="determineTheSchool">
        <div style="text-align: center;margin-top: 5px;">所在学校</div>
        <div style="margin-top: 10px;">
            <van-cell-group>
                <van-field v-model="school" :formatter="formatter" label="所在学校" placeholder="请输入学校名称" />
            </van-cell-group>
        </div>
    </van-dialog>
    <!-- 选择年级 -->
    <dialogChooseGrade :showChooseGrade.sync="showChooseGrade" :chooseGrade.sync="grade" @sureChooseGrade="sureChooseGrade" />
    <!-- 选择头像 -->
    <van-action-sheet v-model="showActionSheet" :actions="actions" cancel-text="取消" @select="handleSelect" @cancel="showActionSheet=false" />
</div>
</template>

<script>
import dialogChooseGrade from '../../views/home/components/dialogChooseGrade'
import {
    saveProfileInfo,
    getUserProfileInfo
} from "../../api/user"
import {
    mapGetters
} from 'vuex'
import {
    generateTimeReqestNumber,
    randomString
} from "../../utils/filter";
import {
    stsAuthCoverAccessUrl,
    doUpLoad
} from '../../api/upload'
import city from '../../utils/city.json'
export default {
    data() {
        return {
            fonmData: {
                name: '',
                gender: '',
                city: '',
                school: '',
                Age: ''
            },
            actualNameShow: false, //编辑姓名弹框
            name: '',
            defaultPhotoUrl: require('@/assets/img/mine/default-photo.png'),
            photoList: [],
            imgObj: null,
            curFile: null,

            genderShow: false, //性别弹框
            genderList: [{
                name: '男'
            }, {
                name: '女'
            }],

            schoolShow: false, //学校弹框
            school: '',

            showChooseGrade: false,
            grade: '',

            showActionSheet: false,
            actions: [{
                name: "从相册选取"
            }, {
                name: "拍照"
            }],
            oSSObject: {},
            imgList: [],
            dataurl: null,
        }
    },
    methods: {
        //返回
        onClickLeft() {
            this.$router.go(-1)
        },
        // 编辑个人信息
        editClick(value) {
            console.log(value, "valuevaluevaluevaluevalue")
            switch (value) {
                case '真实姓名':
                    this.actualNameShow = true;
                    break;
                case '性别':
                    this.genderShow = true;
                    break;
                case '所在学校':
                    this.schoolShow = true;
                    break;
                case '就读年纪':
                    this.showChooseGrade = true;
                    break;
                case '所在城市':
                    this.$router.push({
                        path: '/selectTheCity'
                    })
            }
        },
        userProfileInfo() {
            let json = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
            }
            getUserProfileInfo(json).then(data => {
                if (data.flag) {
                    if (data.data == null || data.data.length == 0) return false
                    this.fonmData.name = data.data.userName
                    if (data.data.sexTypeCd == '') {
                        this.fonmData.gender = ''
                    } else {
                        this.fonmData.gender = data.data.sexTypeCd == "S01" ? "男" : '女'
                    }
                    this.fonmData.school = data.data.schoolName
                    let i = 1010
                    city.city.forEach(valus => {
                        valus.list.forEach(ietm => {
                            ietm.code = i++
                        })

                    })
                    city.city.forEach(valus => {
                        valus.list.forEach(ietm => {
                            if (ietm.code == data.data.areaCode) {
                                this.fonmData.city = ietm.name
                            }
                        })
                    })
                }

            })
        },
        // 公共修改保存信息 publicEdit
        publicEdit(value, i) {
            let json = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "objectTypeCd": "A03", //固定值
                ...value
            }
            saveProfileInfo(json).then((data) => {
                if (!data.flag) {
                    console.log(data.msg)
                    return;
                }
                this.$toast(data.msg)
                this.userProfileInfo()
                switch (i) {
                    case 1:
                        this.fonmData.name = this.name;
                        this.name = '';
                        break;
                    case 2:
                        this.fonmData.school = this.school;
                        this.school = '';
                        break;
                }
            })
        },
        // 真实姓名
        actualNameClick() {
            if (this.name.length == '') {
                this.$toast('请填写姓名')
                return
            } else if (this.name.length > 25) {
                this.$toast('姓名字数须在2~25之间')
                return
            } else if (this.name.length < 2) {
                this.$toast('姓名字数须在2~25之间')
                return
            }
            this.publicEdit({
                'userName': this.name
            }, 1)
        },
        // 性别选择
        onSelect(value) {
            this.genderShow = !this.genderShow
            this.fonmData.gender = value.name
            let json = {
                "sexTypeCd": value.name == '男' ? 'S01' : 'S02'
            }
            this.publicEdit(json)
        },
        //选择年级确认
        sureChooseGrade(item) {
            this.showChooseGrade = false;
            this.saveProfileInfo();
        },
        // 确定选择学校
        determineTheSchool() {
            this.fonmData.school = this.school
            if (this.school.length == '') {
                this.$toast('请填写学校名称')
                return
            } else if (this.school.length > 100) {
                this.$toast('姓名字数须在4~100之间')
                return
            } else if (this.school.length < 4) {
                this.$toast('姓名字数须在4~100之间')
                return
            }
            this.publicEdit({
                'schoolName': this.school
            }, 2)
        },

        //保存更新用户档案信息
        saveProfileInfo() {
            let params = {
                "interUser": "runLfb",
                "interPwd": "25d55ad283aa400af464c76d713c07ad",
                "accountNo": this.getUserInfo.accountNo,
                "objectTypeCd": "A03", //固定值
                "grade": this.grade
            }
            this.fonmData.Age = this.$options.filters.getGradeName(this.grade)
            saveProfileInfo(params).then(res => {
                if (res.flag) {
                    let data = {
                        grade: this.grade
                    }
                    this.$store.commit('setUserProfileInfo', data)
                } else {
                    this.$toast(res.msg)
                }
            })
        },
        // 向安卓提供的方法
        async avatarChangeAndroid(file) {
            this.base64ToFile(file).then(res => {
                this.uploadIMG(res)
            }).catch(err => {
                console.log(err,"errerr")
            })
        },
        // 头像更改
        avatarChange() {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            // 如果是安卓端就调用原生安卓方法
            if (isAndroid) {
                android.chooseImage();
                return false
            }
            if ("cordova" in window) {
                this.showActionSheet = !this.showActionSheet;
            } else {
                if (this.oSSObject == null) {
                    this.getOSSKey();
                }
                myPhoto("fileSelect").then(obj => {
                    this.photoList = obj.list;
                    this.curFile = obj.curFile;
                    this.uploadIMG(obj.curFile);
                });
            }
        },
        //上传鉴权
        getOSSKey() {
            let json = {
                interUser: "runLfb",
                interPwd: "25d55ad283aa400af464c76d713c07ad",
                // operateAccountNo: this.$store.getters.GET_LOGININFO.accountNo,
                operateAccountNo: this.getUserInfo.accountNo,
                belongSchoolId: 24,
                docTypeCd: "T16",
                sysTypeCd: "T01"
            }
            console.log("23323232==============");
            stsAuthCoverAccessUrl(json).then(data => {
                if (!data.flag) {
                    console.log(data.msg)
                    return;
                }
                console.log("stsAuthCoverAccessUrl", data.data[0]);
                var obj = data.data[0].tokenInfo;
                var tmpSignatureObj = {
                    host: obj.host,
                    policyBase64: obj.policy,
                    accessid: obj.accessid,
                    signature: obj.signature,
                    expire: parseInt(obj.expire),
                    key: obj.dir + "/",
                    size: obj.sizelimit
                };
                this.oSSObject = tmpSignatureObj;
            });
        },
        handleSelect(item, index) {
            // index 0 相册  1 拍照
            this.showActionSheet = false;
            navigator.camera.getPicture(
                imageData => {
                    console.log(imageData,"imageDataimageDataimageData")
                    let imgBase = "data:image/jpeg;base64," + imageData;
                    try {
                        // this.cropperData.visible = true;
                        this.photoList = [...this.photoList, {
                            base64: imgBase
                        }];
                        var arr = imgBase.split(","),
                            mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]),
                            n = bstr.length,
                            u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        this.curFile = new Blob([u8arr], {
                            type: mime
                        });
                        this.uploadIMG(this.curFile);
                    } catch (e) {
                        console.log(e);
                    }
                },
                failMsg => {
                    // this.$toast.fail(failMsg);
                }, {
                    quality: 50, //像素质量[0,100]
                    destinationType: Camera.DestinationType.DATA_URL,

                    sourceType: index == 1 ?
                        Camera.PictureSourceType.CAMERA : Camera.PictureSourceType.SAVEDPHOTOALBUM
                }
            );
        },
        base64ToFile(urlData) {
            console.log(urlData,"urlDataurlData")
            let imgBase = "data:image/jpeg;base64," + urlData;
            return new Promise((resolve, reject)=> {
                try {
                    this.photoList = [...this.photoList,{
                        base64: imgBase
                    }]
                    let arr = imgBase.split(',');
                    let mime = arr[0].match(/:(.*?);/)[1];
                    let bytes = atob(arr[1]); // 解码base64
                    let n = bytes.length
                    let ia = new Uint8Array(n);
                    while (n--) {
                        ia[n] = bytes.charCodeAt(n);
                    }
                    let curFile = new File([ia], '11', {
                        type: mime
                    });
                    resolve(curFile)
                } catch (error) {
                    reject(error)
                }
            }).catch(err => {
                console.log(err, '-------------')
            })
        },

        //上传图片
        uploadIMG(curFile) {
            console.log(curFile, "curFilecurFile")
            var filetime = generateTimeReqestNumber();
            let randomStr = randomString(5);
            let formData = new FormData();
            formData.append(
                "key",
                this.oSSObject.key +
                this.getUserInfo.accountNo + '_' +
                filetime + '_' +
                randomStr +
                ".jpeg"
            );
            formData.append("policy", this.oSSObject.policyBase64);
            formData.append("OSSAccessKeyId", this.oSSObject.accessid);
            formData.append("signature", this.oSSObject.signature);
            formData.append("file", curFile);
            formData.append("success_action_status", "200");
            doUpLoad(this.oSSObject.host, formData).then(data => {
                console.log("doUpLoad", data);
                var imgUrl =
                    this.oSSObject.host +
                    "/" +
                    this.oSSObject.key +
                    this.getUserInfo.accountNo + '_' +
                    filetime + '_' +
                    randomStr +
                    ".jpeg";
                this.publicEdit({
                    iconUrl: imgUrl
                })
                let userInfo = this.$store.getters.getUserInfo;
                userInfo.iconUrl = imgUrl;
                this.$store.commit('setUserInfo', userInfo)
            });

        },

        formatter(value) {
            // 过滤输入的数字
            return value.replace(/\d/g, '');
        },
    },
    mounted() {
        // console.log(this.$store.commit('setUserInfo','http://askhajshhjgq.png'))
        if (this.getUserProfileInfo && this.getUserProfileInfo.grade) {
            this.grade = this.getUserProfileInfo.grade;
            this.fonmData.Age = this.$options.filters.getGradeName(this.getUserProfileInfo.grade)
        }
        this.getOSSKey()
        this.userProfileInfo()
    },
    created() {
        window.avatarChangeAndroid = this.avatarChangeAndroid
    },
    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
            getUserProfileInfo: 'getUserProfileInfo',
            getHasLogin: 'getHasLogin'
        })
    },
    components: {
        dialogChooseGrade
    }
}

var imgUploadList = [];

function myPhoto(id) {
    let fileInputs = document.getElementById(id);
    fileInputs.click();
    var p = new Promise(function (resolve, reject) {
        console.log("8989898-----")
        console.log(fileInputs.onchange, "fileInputsfileInputsfileInputs")
        fileInputs.onchange = function (e) {
            console.log("targetevent", e);
            let files = e.target.files || e.dataTransfer.files;
            console.log("files-------", files);
            if (!files.length) return;
            let file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (e) {
                file["base64"] = e.target.result;
                file["ind"] = imgUploadList.length;
                if (imgUploadList.indexOf(file) > -1) {
                    return;
                } else {
                    imgUploadList.push(file);
                }
            };
            console.log("file1111", file);
            var obj = {
                curFile: file,
                list: imgUploadList
            };
            resolve(obj);
        };
    });
    return p;
}
</script>

<style lang="less" scoped>
.avatar {
    width: 100%;
    height: 70px;
    background: #fff;
    padding: 15px;
    box-sizing: border-box;
    display: flex;
    align-items: center;

    .avatar_left {
        width: 80%;
        font-size: 15px;
    }

    .avatar_right {
        width: 20%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .avatar-Img {
        border-radius: 4px;
    }

    .avatar-Img img {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        object-fit: cover;
    }
}

/deep/.van-cell__title {
    font-weight: 500;
}

/deep/.van-cell__value {
    font-weight: 400;
}
</style>
