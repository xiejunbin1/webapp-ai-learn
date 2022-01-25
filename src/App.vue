<!--
 * @Author: wgj
 * @Date: 2021-03-22 19:40:55
 * @LastEditTime: 2021-04-28 15:13:23
 * @LastEditors: wgj
 * @Description: 
-->
<!--
 * @Author: wgj
 * @Date: 2021-03-22 19:40:55
 * @LastEditTime: 2021-03-24 09:39:48
 * @LastEditors: wgj
 * @Description: 
-->
<template>
  <div id="app">
    <div class="returnClss xuanfu" id="moveDiv"  @touchstart="down" @touchmove.stop.prevent="move" @touchend="end" v-if="$route.name != 'home'">
      <div @click="returnClick">返回</div>
    </div>
    <!-- <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div> -->
    <footer-menu v-if="showMenu" />
    <!-- <van-skeleton title avatar :row="3" :loading="loading"> -->
      <transition name="fade">
        <loading v-if="this.$store.getters.getIsLoading"></loading>
      </transition>
      <transition :mode="mode" :name="transitionName">
        <router-view class="center"></router-view>
      </transition>
    <!-- </van-skeleton> -->
  </div>
</template>

<script>
// @ is an alias to /src
import footerMenu from '@/components/footerMenu.vue';
import Loading from '@/components/loading';
var version = require("/public/version.json");
export default {
  name: 'Home',
  components: {
    footerMenu,
    Loading,
  },
  data() {
    return {
      loading: true,
      mode: '',
      transitionName: 'slide-left', //默认动画
      flags: false,
      position: { x: 0, y: 0 },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: '',
    };
  },
  computed: {
    showMenu() {
      return this.$route.meta.showMenu;
    },
  },
  watch: {
    $route(to, from) {
      //页面切换动画
      console.log(to);
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      if (toIndex == undefined) {
        this.mode = 'out-in';
        this.transitionName = '';
      } else {
        this.mode = '';
        this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left';
      }
    },
  },
  methods: {
    // 实现移动端拖拽
    down(event) {
      this.flags = true;
      var touch;
      if (event.touches) {
        touch = event.touches[0];
      } else {
        touch = event;
      }
      this.position.x = touch.clientX;
      this.position.y = touch.clientY;
      this.dx = moveDiv.offsetLeft;
      this.dy = moveDiv.offsetTop;
    },
    
    move(event) {
      if (this.flags) {
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.nx = touch.clientX - this.position.x;
        this.ny = touch.clientY - this.position.y;
        this.xPum = this.dx + this.nx;
        this.yPum = this.dy + this.ny;
        const maxWidth = window.screen.width - 80; //屏幕分辨率宽度减去悬浮框宽高
        const maxHeight = window.screen.height - 80;
        // const maxWidth = window.screen.width; //屏幕分辨率宽度减去悬浮框宽高
        // const maxHeight = window.screen.height;
        if (this.xPum < 0) {
          //屏幕x限制
          this.xPum = 0;
        } else if (this.xPum > maxWidth) {
          this.xPum = maxWidth;
        }
        if (this.yPum < 0) {
          //屏幕y限制
          this.yPum = 0;
        } else if (this.yPum > maxHeight) {
          this.yPum = maxHeight;
        }
        moveDiv.style.left = this.xPum + 'px';
        moveDiv.style.top = this.yPum + 'px';
        //阻止页面的滑动默认事件；如果碰到滑动问题，1.2 请注意是否获取到 touchmove
        document.addEventListener(
          'touchmove',
          function () {
            event.preventDefault();
          },
          false
        );
      }
    },
    //鼠标释放时候的函数
    end() {
      this.flags = false;
    },
    returnClick() {
      console.log(77777)
      this.$router.push({path: '/'})
    }
  },
  mounted() {
    console.log("version",version)
    this.loading = false;
    console.log('showMenu', this.showMenu, this.$store.getters.getIsLoading);
    //app.vue mounted里面执行
    setTimeout(() => {
      this.$version(version);
    }, 500);
  },
};
</script>
<style lang="less">
* { touch-action: pan-y; }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #333;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.returnClss{
  position: fixed;
  z-index: 999;
  width: 70px;
  height: 70px;
  border: deeppink;
  border-radius: 50%;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 20px;
  right: 20px;
  box-shadow: 0px 6px 20px 0px rgba(0, 37, 35, 0.2);
  font-size: 14px;
  -webkit-animation: 3s opacity2 , roundRule 2.5s ease-in-out infinite;
  -webkit-transform-origin:  top center;
}
@-webkit-keyframes roundRule{
  0%, 100%{
    -webkit-transform: rotate(-15deg);
  }
  50%{
    -webkit-transform: rotate(15deg);
  }
}

@keyframes opacity2{
  0%{opacity:0}
  20%{opacity:0}
  40%{opacity:.4}
  60%{opacity:.6;}
  80%{opacity:.8;}
  100%{opacity:1}
}


.xuanfu {
  width: 70px;
  height: 70px;
  /* 如果碰到滑动问题，1.3 请检查 z-index。z-index需比web大一级*/
  z-index: 999;
  position: fixed;
}
</style>
