<template>
    <div class="no-data">
        <div class="no-data-img">
            <img :src="imgUrl" alt="">
        </div>
        <p>{{text}}</p>
    </div>
</template>
<script>
export default {
    name:'NoResult',
    props:{
        imgUrl: { 
            type: String,
            default: require('@/assets/img/no-result.png')
        },
        text: {
            type: String,
            default: '暂无资源' 
        }
    }
}
</script>

<style lang="less" scoped>
.no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    .no-data-img {
      width: 211px;
      height: 223px;
      img {
        width: 100%;
      }
    }
    p {
      margin-top: 30px;
      font-size: 15px;
      color: #999;
    }
}
</style>

