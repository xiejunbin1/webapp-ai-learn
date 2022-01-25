<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar fixed placeholder title="意见反馈" left-text="" left-arrow @click-left="onClickLeft" />
    <van-cell value="" is-link @click="chooseType">
        <template #title>
            <div v-if="!problemType">
                <span class="custom-title">反馈类型</span>
                <span style="color:#E55757">（必选）</span>
            </div>
            <span class="custom-title" v-else>{{problemName}}</span>
        </template>
    </van-cell>
    <div class='content'>
        <van-field v-model="problem" rows="5" autosize label="" type="textarea" maxlength="500" placeholder="在此处输入您的反馈内容" show-word-limit />
    </div>
    <div class="picture">
        <div class="mgb20">
            <span class="custom-title">添加图片</span>
            <span style="color:#AAAAAA">（最多3张）</span>
        </div>
        <div class="picture-box">
            <div class="pre-container" v-for="(item,index) in imgList" :key="index">
                <div style="position: relative;width: 100%;height: 100%;">
                    <img style="width: 100%;height: 100%;" :src="item.url" />
                    <svg-icon class="del" @click="del(index)" icon-class="icon-del" />
                </div>
            </div>
            <div class="upl-container" v-if="imgList.length < 3" @click="fileSelect">
                <span>+</span>
            </div>
            <input type="file" id="fileSelect" accept="image/*" style="display: none;" />
        </div>
    </div>
    <div class='button-box'>
        <div class='mgb15 button-item'>
            <van-button :loading="btnLoading" @click="submit" round block type="info">提交</van-button>
        </div>
    </div>
    <van-action-sheet v-model="showType" title="选择反馈内容">
        <div style='padding: 15px'>
            <van-button class='mgb10' round block plain type="info" v-for="(item,index) in typeList" :key="index" @click="sureType(item)">{{item.dictValue}}</van-button>
        </div>
    </van-action-sheet>
    <van-action-sheet v-model="showActionSheet" :actions="actions" cancel-text="取消" @select="handleSelect" @cancel="showActionSheet=false" />
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
import {
    getSysDictList
} from '@/api/sys-dict'
import {
    uploadFeedback
} from '@/api/opr-parent-feedback'
import {
    addAppraise
} from '@/api/public'
import {
    stsAuthCoverAccessUrl,
    doUpLoad
} from '@/api/upload'
import {
    generateTimeReqestNumber,
    randomString
} from "@/utils/filter";
export default {
    data() {
        return {
            imgList: [
                // {
                //     url: 'http://pubquanlang.oss-cn-shenzhen.aliyuncs.com/icon/201711/1511525237_GKeQM.jpg?x-oss-process=style/max_width_1000'
                // },
            ],
            photoList: [],
            imgObj: null,
            curFile: null,
            problem: '',
            showType: false,
            problemType: '',
            problemName: '',
            typeList: [],
            oSSObject: {},
            btnLoading: false,
            showActionSheet: false,
            actions: [{
                name: "从相册选取"
            }, {
                name: "拍照"
            }],
        };
    },

    components: {},

    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
        })
    },

    mounted() {
        console.log('getUserInfo', this.getUserInfo)
        this.getSysDictList()
        this.getOSSKey()
    },

    methods: {
        getSysDictList() {
            let params = {
                "interUser": "123",
                "interPwd": "123",
                "dictCode": "Domain_FeedbackT03_Question_Type"
            }
            getSysDictList(params).then(res => {
                if (res.flag) {
                    this.typeList = res.data[0].sysDictInfoList || []
                    console.log(JSON.parse(JSON.stringify(this.typeList)));
                }
            })
        },
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        },
        chooseType() {
            this.showType = true;
        },
        sureType(item) {
            console.log(item)
            this.showType = false;
            this.problemType = item.dictKey;
            this.problemName = item.dictValue;
        },
        // 向安卓提供的方法
        async avatarChangeAndroid(file) {
            this.base64ToFile(file).then(res => {
                this.uploadIMG(res)
            }).catch(err => {
                console.log(err,"errerr")
            })
        },
        //选取图片
        fileSelect() {
            var u = navigator.userAgent;
            var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
            // 如果是安卓端就调用原生安卓方法
            console.log(isAndroid, 'Android')
            if (isAndroid) {
                console.log('当前为安卓环境')
                android.chooseImage();
                return false
            }
            console.log("cordova" in window)
            if ("cordova" in window) {
                this.showActionSheet = !this.showActionSheet;
            } else {
                if (this.oSSObject == null) {
                    this.getOSSKey();
                }
                console.log("fileSelect", this.imgList);
                myPhoto("fileSelect").then(obj => {
                    console.log("obj", obj);
                    this.photoList = obj.list;
                    this.curFile = obj.curFile;
                    console.log("fileList", obj.list);
                    console.log("file", obj.curFile);
                    this.uploadIMG(obj.curFile);
                });
            }
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
        // 选择上传图片的方式
        handleSelect(item, index) {
            // index 0 相册  1 拍照
            this.showActionSheet = false;
            navigator.camera.getPicture(
                imageData => {
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
                        // if (this.oSSObject == null) {
                        //   this.getOSSKey();
                        // }
                        console.log("file");

                        console.log(this.curFile);
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
                    // sourceType : Camera.PictureSourceType.CAMERA,
                }
            );
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
            console.log("getOSSKey json", json);
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
        //上传图片
        uploadIMG(curFile) {
            console.log("开始上传");
            console.log(this.oSSObject);
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
            // console.log(formData);
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
                var imgObj = {
                    url: imgUrl
                };
                this.imgList.push(imgObj);
                console.log("this.imgList", this.imgList);
            });
        },
        submit() {
            if (!this.problemType) {
                this.$toast("请选择反馈类型！");
                return;
            }
            if (!this.problem) {
                this.$toast("请填写反馈内容");
                return;
            }
            if (this.problem.length < 10) {
                this.$toast("反馈内容必须在10-500字内");
                return;
            }
            var str = "";
            if (this.imgList.length > 0) {
                for (var i = 0; i < this.imgList.length; i++) {
                    str += this.imgList[i].url + ",";
                }
            }
            var json = {
                accountNo: this.getUserInfo.accountNo,
                problemType: this.problemType,
                problemTitle: '意见反馈',
                telOrQQ: this.getUserInfo.phoneNo,
                problem: this.problem,
                imgList: str,
                problemOrigin: "T03"
            }
            console.log(json);
            this.btnLoading = true;
            uploadFeedback(json).then(data => {
                console.log(data);
                if (data.flag) {
                    let img = "";
                    this.imgList.forEach(v => {
                        img += `<img style="width: 75px;height: 75px; margin: 0 10px 10px 0;" src="${v.url}">`;
                    });
                    const params = {
                        objectId: data.data[0].feedbackId,
                        appraiseContent: `<div style="font-size: 14px;margin: 10px 0;overflow:hidden; text-overflow:ellipsis;display:-webkit-box; -webkit-box-orient:vertical;-webkit-line-clamp:2;word-break: break-all;">${this.problem}</div><div style="display: flex;flex-wrap: wrap;">${img}</div>`, //this.obj.problem + str,
                        // accountNo: this.$store.getters.GET_LOGININFO.accountNo,
                        accountNo: this.getUserInfo.accountNo,
                        objectTypeCd: "A08"
                    };
                    addAppraise(params).then(res => {
                        this.btnLoading = false;
                        if (res.flag) {
                            this.$toast.success("提交成功");
                            this.$router.push("/mine");
                        } else {}
                    });
                } else {
                    this.btnLoading = false;
                    this.$toast.fail("提交失败！");
                }
            });
        },
        del(index) {
            this.imgList.splice(index, 1)
        }
    },
    created() {
        window.avatarChangeAndroid = this.avatarChangeAndroid
    },
};
var imgUploadList = [];

function myPhoto(id) {
    let fileInputs = document.getElementById(id);
    fileInputs.click();
    var p = new Promise(function (resolve, reject) {
        fileInputs.onchange = function (e) {
            console.log("targetevent", e);
            let files = e.target.files || e.dataTransfer.files;
            console.log("files", files);
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
.custom-title {
    font-weight: 600;
}

.content {
    margin: 15px;
    border-radius: 8px;
    overflow: hidden;
}

.picture {
    padding: 15px;
    font-size: 15px;

    /deep/.van-cell {
        background-color: '#999';
    }

    .van-uploader {
        border: 1px solid #AAAAAA;
        border-radius: 4px;
    }
}

.picture-box {
    display: flex;
    flex-wrap: wrap;
}

.pre-container {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin-right: 15px;

    img {
        border-radius: 8px;
    }

    // overflow: hidden;
    .del {
        position: absolute;
        top: -5px;
        right: -5px;
    }
}

.upl-container {
    font-size: 40px;
    width: 80px;
    height: 80px;
    border-radius: 4px;
    border: 1px solid #AAAAAA;
    color: #AAAAAA;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    // line-height: 80px;
}

.button-box {
    position: absolute;
    bottom: 0;

    .button-item {
        width: 345px;
        padding: 0 15px;
    }
}
</style>
