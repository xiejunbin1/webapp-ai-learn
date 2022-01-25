<template>
<div style="background: #f8f8f8;height: 100vh">
    <van-nav-bar fixed placeholder title="关于我们" left-text="" left-arrow @click-left="onClickLeft" />
    <div class="maxBox" style="overflow-y: scroll">
      <div class="txt">
        <p class="title">全朗简介</p>
        <div class="ne">
          <p>广东全朗教育成立于2012年，中小学学习方法训练全国领军品牌。全朗教育秉承着“让学习更高效”的使命，集学生学习习惯方法训练、家庭教育父母课程及学校智慧课堂改革于一体，每年赢得近万名余对学员与家长的高度认可。现分设佛山禅城、顺德大良、顺德容桂、顺德乐从、顺德北滘等多个校区。</p>
          <p>自成立以来，全朗教育凭借标准技术化的教学服务体系、先进的学习方法训练模式和完善的家庭教育父母课程，帮助无数家庭改善亲子关系，提升孩子学习能力和成绩，并持续多年实现75%以上学员考取当地区属高中，95%以上学员考取普通高中。</p>
          <p>2015年，全朗教育响应国家对“互联网+”教育的号召，重资打造“高分云”智慧教学平台，携手10余所公办学校成立“互联网+”课改学校联盟，将互联网技术与“以学定教”的新型课堂深度融化，深入推进全日制学校教研教学的信息化课改，并获得当地合作校的一致好评。</p>
          <p class="big">获得荣誉</p>
          <p>“2015年全国教培行业百强”、“CCTV英语大赛全国知名品牌”、“德育研究会常务理事单位”、“2017年教育科技十佳品牌。</p>
          <p class="big">咨询电话及地址:</p>
          <div class="area">
            <p>禅城校区：0757-22158555</p>
            <p>佛山市禅城区体育路1号百花上路酒店2楼</p>
            <p>&nbsp;</p>
            <p>大良校区：0757-63293333</p>
            <p>佛山市顺德区大良东乐路德福大厦2楼</p>
            <p>&nbsp;</p>
            <p>容桂校区：0757-22159777</p>
            <p>佛山市顺德区容桂容奇大道中126号</p>
            <p>&nbsp;</p>
            <p>乐从校区：0757-63204333</p>
            <p>佛山市顺德区乐从镇新桂路B22号创丰楼2楼</p>
            <p>&nbsp;</p>
            <p>龙江校区：0757-63234999</p>
            <p>佛山市顺德区龙江镇星联商业城一期2层2188</p>
            <p>&nbsp;</p>
            <p>杏坛校区：0757-63917222</p>
            <p>佛山市顺德区杏坛镇建设东路6号明珠楼2层</p>
          </div>
        </div>
        <div class="kongbai"></div>
      </div>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from 'vuex'
export default {
    data() {
        return {};
    },

    components: {},

    computed: {
        ...mapGetters({
            getUserInfo: 'getUserInfo',
        })
    },

    mounted() {
        console.log('getUserInfo', this.getUserInfo)
    },

    methods: {
        //返回
        onClickLeft() {
            console.log('onClickLeft')
            this.$router.go(-1)
        }
    },
};
</script>

<style lang="less" scoped>
.maxBox {
  .txt {
    width: 100%;
    background-color: #ffffff;
    .title {
      font-size: 16px;
      font-weight: 700;
      text-align: center;
      padding: 10px 0;
    }
    .ne {
      padding: 0 10px;
      font-size: 14px;
      p {
        text-indent: 2em;
        line-height: 30px;
      }
      .big {
        font-weight: 700;
        padding: 10px 0;
      }
      .area {
        text-indent: 2em;
        font-size: 0.813em;
        font-family: MicrosoftYaHei;
        color: rgba(102, 102, 102, 1);
        p {
          line-height: 24px;
        }
      }
    }
  }
}
.kongbai {
  width: 100%;
  height: 6.25em;
}
</style>
