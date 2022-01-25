<template>
<div class="awe" id="awe" style="width: 100px; height: 100px" >
    <div class="botton">
        <button class="enlarge" @click="enlargeClick">+</button>
        <button class="enlarge" @click="emptyTheCanvas">-</button>
        <button class="enlarge" @click="rubber">橡皮</button>
        <button class="enlarge" @click="brush">画笔</button>
        <button class="enlarge" @click="baocun">保存</button>
        <button class="enlarge" @click="qingkong">清空</button>
    </div>
    <div class="canvas" >
        <canvas class="canvasas" id="drawing-board"  @touchstart.stop.prevent="onmousedown" @touchmove.stop.prevent="onmousemove" @touchend.stop.prevent="onmouseup" ></canvas>
        <canvas id="drawing-board1"></canvas>
    </div>
</div>
</template>
<script>
export default {
data () {
    return {
        myPaint: false,
        myClickX: [],
        myClickY: [],
        myClickDrag: [],
        myContext: null,
        canvas: null,
        image: null,
        myContextRce: null,
        canvasRce: null,
        img: null,
        rubberShow: false,
        rubberShow1: false,
        url1: '',
        res: '',
        swer: false
    }
},
methods: {
    // 定义画布对象  画布显示二维图片
    canvas1() {
        this.myContext = document.getElementById('drawing-board').getContext('2d');
        this.canvas = document.getElementById('drawing-board')
        this.myContextRce = document.getElementById('drawing-board1').getContext('2d');
        this.canvasRce = document.getElementById('drawing-board1')
        
    },
    // 禁止滚轮放大缩小图片
    mousewheel() {
        window.addEventListener('mousewheel', function (event) {
            if (event.ctrlKey === true || event.metaKey) {
                event.preventDefault();
            }
        }, { passive: false });
    },
    initialization1 () {
        // 将图片放到画布里面 myContext.drawImage(img, 0, 0)
        this.img = new Image()//创建一个image对象 通过构造函数创建 img 实例
        this.img.src =  "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3228549874,2173006364&fm=26&gp=0.jpg";
        this.img.setAttribute("crossOrigin",'Anonymous')//  解决图片跨域问题
        this.canvasRce.width = this.img.width;
        this.canvasRce.height = this.img.height;
        this.img.onload =  (e) => { // 确保图片完整获取到，创建一个异步事件
            this.drawImage1();
        };
    },
    drawImage1(sec = 1) {
        this.canvasRce.width = this.img.width * (sec == 1 ? 0.5 : sec);
        this.canvasRce.height = this.img.height * (sec == 1 ? 0.5 : sec);
        this.img.width = this.img.width * (sec == 1 ? 0.5 : sec);
        this.img.height = this.img.height * (sec == 1 ? 0.5 : sec);
        this.myContextRce.drawImage(this.img,0,0,this.img.width, this.img.height);
    },

    // 定义一个image对象并设置好它的onload事件和src属性。
    initialization () {
        // 将图片放到画布里面 myContext.drawImage(img, 0, 0)
        this.image = new Image()//创建一个image对象 通过构造函数创建 img 实例
        this.image.src = "https://dss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3228549874,2173006364&fm=26&gp=0.jpg";
        this.image.setAttribute("crossOrigin",'Anonymous')//  解决图片跨域问题
        this.image.onload =  (e) => { // 确保图片完整获取到，创建一个异步事件
            this.drawImage();
        };
    },
    drawImage(sec = 1) {
        this.myContext.clearRect(0, 0, this.canvas.width, this.canvas.height); // 清空画版
        this.canvas.width = this.image.width * (sec == 1 ? (this.swer == true ? 1 : 0.5)  : sec)
        this.canvas.height = this.image.height * (sec == 1 ? (this.swer == true ? 1 : 0.5)  : sec)
        this.image.width = this.image.width * (sec == 1 ? (this.swer == true ? 1 : 0.5)  : sec)
        this.image.height = this.image.height * (sec == 1 ? (this.swer == true ? 1 : 0.5)  : sec)
        this.myContext.drawImage(this.image,0,0,this.image.width, this.image.height);
        this.swer = false
        
    },
    // 在图片上做画根据鼠标移动轨迹
    redraw(){
        this.myContext.strokeStyle = '#f00'; // 设置颜色
        this.myContext.lineJoin = 'round';
        this.myContext.lineWidth = 5; //设置粗细
        for(let i=0;i<this.myClickX.length;i++){
            this.myContext.beginPath();
            if(this.myClickDrag[i] && i){
                this.myContext.moveTo(this.myClickX[i-1], this.myClickY[i-1])
            }else{
                this.myContext.moveTo(this.myClickX[i]-1,this.myClickY[i])
            }
            this.myContext.lineTo(this.myClickX[i],this.myClickY[i]);
            this.myContext.closePath();
            this.myContext.stroke();
        }
    },
    // 将鼠标移动的轨迹放到myClickDrag 数组中
    addClick(x,y,dragging){
        this.myClickX.push(x);
        this.myClickY.push(y);
        this.myClickDrag.push(dragging);
    },
    // 鼠标按下事件
    onmousedown(e) {
        console.log(e.targetTouches[0].clientX,"pageX")
        if(this.rubberShow){
            this.rubberShow1 = true
            return false
        }
        this.myPaint = true
        this.addClick(e.targetTouches[0].clientX-this.canvas.offsetLeft, e.targetTouches[0].clientY - this.canvas.offsetTop);
        if(this.myPaint){
            this.redraw();
        }
    },
    // 鼠标移动事件
    onmousemove(e) {
        if(this.myPaint){
            this.addClick(e.targetTouches[0].clientX-this.canvas.offsetLeft,e.targetTouches[0].clientY - this.canvas.offsetTop,true);
            this.redraw();
        }
        if(this.rubberShow1){
            this.myContext.clearRect(e.targetTouches[0].clientX-this.canvas.offsetLeft,e.targetTouches[0].clientY - this.canvas.offsetTop,10,10);
        }
    },
    // 鼠标抬起事件
    onmouseup() {
        this.swer = true
        this.myPaint = false;
        this.rubberShow1 = false
        this.image.src = this.canvas.toDataURL("image/png");
        this.myClickX = new Array();
        this.myClickY = new Array();
        this.myClickDrag = new Array();
    },
    // 鼠标移除canvas画布
    onmouseout() {
        this.myPaint = false;
    },
    // 画布放大
    enlargeClick () {
        this.drawImage(1.2)
        this.drawImage1(1.2)
    },
    // 画布缩小
    emptyTheCanvas() {
        this.drawImage(0.8)
        this.drawImage1(0.8)
    },
    // 橡皮檫
    rubber() {
        this.rubberShow = true
        this.myPaint = false
    },
    brush () {
        this.rubberShow = false
    },
    // 保存
    baocun() {
        let imgtext = new Image()
        imgtext.src = this.img.src
        imgtext.setAttribute("crossOrigin",'Anonymous')//  解决图片跨域问题
        imgtext.onload = (e) => {
            this.myContext.drawImage(imgtext,0,0,this.image.width, this.image.height);
            let imgtext1 = new Image()
            imgtext1.src = this.image.src
            imgtext1.setAttribute("crossOrigin",'Anonymous')//  解决图片跨域问题
            imgtext1.onload = (e) => {
                this.myContext.drawImage(imgtext1,0,0,this.image.width, this.image.height);
                this.url1 = this.canvas.toDataURL("image/png"); //"image/png" 这里注意一下
                var a = document.createElement('a');          // 创建一个a节点插入的document
                var event = new MouseEvent('click')           // 模拟鼠标click点击事件
                a.download = '图片名字'                  // 设置a节点的download属性值
                a.href = this.url1;                                 // 将图片的src赋值给a节点的href
                a.dispatchEvent(event)      
            }
        }
    },
    // 清空
    qingkong () {
        this.myContext.clearRect(0,0,this.image.width, this.image.height)
        this.myClickX = new Array();
        this.myClickY = new Array();
        this.myClickDrag = new Array();
    }
},   

async mounted () {
    await this.canvas1()
    await this.initialization() 
    await this.initialization1() 
    this.mousewheel()
}
}
</script>

<style lang="less">
.awe{
    width: 100vw !important;
    height: 100vh !important;
    display: flex;
    position: relative;
    .botton{
        height: 100%;
        position: absolute;
        z-index: 1000;
    }
    .enlarge{
        width: 40px;
        height: 40px;
        font-size: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .canvas{
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        .canvasas{
            position: absolute;
        }
    }
}
    
</style>