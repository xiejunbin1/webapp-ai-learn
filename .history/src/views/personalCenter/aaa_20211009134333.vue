    <template>
            <!--  -->
                <div ref="tagcanvasbox" class="tagcanvasbox">
                    <canvas ref="tagcanvas" 
                        width='844' height='475'
                        @mousedown ="mouseDown($event)" 
                        @mouseup ="mouseUp($event)"
                        @mousemove ="mouseMove($event)"
                        @contextmenu.prevent ="contextMenu($event)"
                        @mouseout ="mouseOut($event)"
                        ></canvas>
                </div>
            </template>
            <script>
            export default {
                name:'canvas',
                //props:{imgCanvas:{type:Object,default:{imgcanvasW:844,imgcanvasH:475}},},
                data(){
                    return{
                        ctx:'',
                        tagObj:{
                            newrecsObj:{},
                            recs:[{h: 36,w: 58,x: 404,y: 161},{h: 67,w: 58,x: 239,y: 49}],  //两个矩形的宽高与坐标
                            x:0, 
                            y:0,
                            url:'',
                            radious:5,
                            recSize:5,
                            drag:false,
                            resize:false,
                            draw:false,
                            showLitRecs:true,
                            index:-1,
                            side:0,
                            startX:0,
                            startY:0,
                            isRightClick:false
                        }
                    }
                },
                mounted(){
                    this.ctx = this.$refs.tagcanvas.getContext('2d');
                },
                methods:{
                    mouseOut(e){
                        let dom = this.$refs.tagcanvas;
                        let x =e.clientX;
                        let y =e.clientY;
                        let domx1 = dom.offsetLeft;
                        let domy1 = dom.offsetTop;
                        let domx2 = dom.offsetLeft + dom.offsetWidth;
                        let domy2 = dom.offsetTop + dom.offsetHeight;
                        if( x < domx1 || x > domx2 || y < domy1 || y > domy2){
                            this.clearCanvas(this.$refs.tagcanvas, this.ctx);
                            this.drawOldRecs(this.tagObj.recs, this.ctx);
                        }
                    },
                    mouseDown(e){
                        // let ctx = this.$refs.tagcanvas.getContext('2d');
                        window.console.log('down',e);
                        this.tagObj.x = e.offsetX;
                        this.tagObj.y = e.offsetY;
                        this.tagObj.index = this.getEventIndex(this.tagObj.recs, this.tagObj.x, this.tagObj.y, this.tagObj.radious); //得到落点所在框的序数
                        window.console.log(this.tagObj.index,this.tagObj.recs);
                        if (e.button == 2) {
                            if (this.tagObj.index >= 0) {
                                this.tagObj.isRightClick = true;
                            }
                            return;
                        }
                        if (this.tagObj.index >= 0) { //移动或者放缩
                            this.tagObj.startX = this.tagObj.recs[this.tagObj.index].x;
                            this.tagObj.startY = this.tagObj.recs[this.tagObj.index].y;
                            this.tagObj.side = this.getEventArea(this.tagObj.recs[this.tagObj.index], this.tagObj.x, this.tagObj.y, this.tagObj.radious); //得到落点在一个框中的区域
                            // console.log(this.tagObj.side,this.tagObj.index);
                            if (this.tagObj.side < 9) { //准备缩放
                                this.tagObj.resize = true;
                            } else { //准备拖动
                                this.tagObj.drag = true;
                            }
                            this.drawLitRecs(this.ctx, this.prepareLitRecs(this.tagObj.recs[this.tagObj.index]), this.tagObj.recSize); //画移动小框
                        } else {
                            this.tagObj.draw = true;
                        }
                        this.changeResizeCursor(this.$refs.tagcanvas, this.tagObj.side); //判断小框类型
                    },
                    mouseUp(e){
                        if (this.tagObj.isRightClick == true) {
                            this.tagObj.index = this.getEventIndex(this.tagObj.recs, this.tagObj.x, this.tagObj.y, this.tagObj.radious);
                            this.tagObj.recs.splice(this.tagObj.index, 1);
                            this.clearCanvas(this.$refs.tagcanvas, this.ctx);
                            for (var i = 0; i < this.tagObj.recs.length; i++) {
                                this.ctx.strokeRect(this.tagObj.recs[i].x, this.tagObj.recs[i].y, this.tagObj.recs[i].w, this.tagObj.recs[i].h);
                            }
                            this.tagObj.isRightClick = false;
                            return;
                        }
                        this.tagObj.resize = false;
                        this.tagObj.drag = false;
                        if (this.tagObj.draw) {
                            this.addToRecs(this.$refs.tagcanvas, e); //添加框
                            this.tagObj.draw = false;
                        }
                    },
                    mouseMove(e){
                        var index;
                        var side;
                        this.clearCanvas(this.$refs.tagcanvas, this.ctx);
                        this.drawRuler(this.$refs.tagcanvas, this.ctx, e);
                        this.drawOldRecs(this.tagObj.recs, this.ctx); //必须放在moveRec之下
                        index = this.getEventIndex(this.tagObj.recs, e.offsetX, e.offsetY, this.tagObj.radious);
                        if (index > -1) {
                            side = this.getEventArea(this.tagObj.recs[index], e.offsetX, e.offsetY, this.tagObj.radious); //得到落点在一个框中的区域
                            // console.log(index,JSON.stringify(this.tagObj.recs),this.tagObj.radious,side);
                        } else {
                            side = 0;
                        }
                        this.changeResizeCursor(this.$refs.tagcanvas, side);
                        // console.log(this.tagObj.showLitRecs && index >= 0 && side > 0);
                        if (this.tagObj.showLitRecs && index >= 0 && side > 0) {
                            this.drawLitRecs(this.ctx, this.prepareLitRecs(this.tagObj.recs[index]), this.tagObj.recSize);
                        }
                        if (this.tagObj.draw) {
                            this.drawRec(this.$refs.tagcanvas, this.ctx, e);
                        }
                        if (this.tagObj.drag) {
                            // console.log('139',this.$refs.tagcanvas, this.tagObj.recs[this.tagObj.index], e);
                            this.moveRec(this.$refs.tagcanvas, this.tagObj.recs[this.tagObj.index], e);
                        }
                        if (this.tagObj.resize) {
                            this.reSizeRec(this.tagObj.side, this.tagObj.recs[this.tagObj.index], e.offsetX, e.offsetY, this.tagObj.recSize);
                        }
                    },
                    contextMenu(e){
                            window.console.log(e)
                            return false;
                    },
                    getEventIndex(recs, x, y, radious) { //得到落点所在框的序数，-1代表没有落在任何框内 ，  // x初始值为0，y初始值为0
                        if (recs.length == 0) {
                            return -1;
                        }
                        for (var i = 0; i < recs.length; i++) {
                            if (x > (recs[i].x - radious) && x < (recs[i].x + recs[i].w + radious) &&
                                y > (recs[i].y - radious) && y < (recs[i].y + recs[i].h + radious)) {
                                return i;
                            }
                            if (i == recs.length - 1) {
                                return -1;
                            }
                        }
                    },
                    clearCanvas(canvas, ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    },
                    getEventArea(data, x, y, radious) { //得到落点在一个框中的区域
                        if (x > (data.x - radious) && x < (data.x + radious)) {
                            if (y > (data.y - radious) && y < (data.y + radious)) {
                                return 1;
                            } else if (y > (data.y + radious) && y < (data.y + data.h - radious)) {
                                return 2;
                            } else if(y > (data.y + data.h - radious)&& y < (data.y + data.h + radious)){
                                return 3;
                            }
                        } else if (x > (data.x + data.w - radious) && x < (data.x + data.w + radious)) {
                            if (y > (data.y - radious) && y < (data.y + radious)) {
                                return 4;
                            } else if (y > (data.y + radious) && y < (data.y + data.h - radious)) {
                                return 5;
                            } else if (y > (data.y + data.h - radious) && y < (data.y + data.h + radious)){
                                return 6;
                            }
                        } else {
                            if (y > (data.y - radious) && y < (data.y + radious) && x > (data.x + radious) && x < (data.x + data.w- radious)) {
                                return 7;
                            } else if (y > (data.y + data.h - radious) && y < (data.y + data.h + radious) && x > (data.x + radious) && x < (data.x + data.w - radious)) {
                                return 8;
                            } else {
                                return 9;
                            }
                        }
                    },
                    drawLitRecs(ctx, data, size) { //画移动时的小框,data为矩形框9个点的坐标
                        for (var i = 0; i < data.length; i++) {
                            ctx.strokeRect(data[i][0] - size / 2, data[i][1] - size / 2, size, size);
                        }
                    },
                    changeResizeCursor(canvas, index) {
                        switch (index) {
                            case 0:
                                canvas.style.cursor = "crosshair";
                                break;
                            case 1:
                                canvas.style.cursor = "se-resize";
                                break;
                            case 2:
                                canvas.style.cursor = "e-resize";
                                break;
                            case 3:
                                canvas.style.cursor = "ne-resize";
                                break;
                            case 4:
                                canvas.style.cursor = "sw-resize";
                                break;
                            case 5:
                                canvas.style.cursor = "w-resize";
                                break;
                            case 6:
                                canvas.style.cursor = "nw-resize";
                                break;
                            case 7:
                                canvas.style.cursor = "s-resize";
                                break;
                            case 8:
                                canvas.style.cursor = "n-resize";
                                break;
                            case 9:
                                canvas.style.cursor = "move";
                                break;
                            default:
                                canvas.style.cursor = "default";
                        }
                    },
                    addToRecs(canvas, e) {
                        var rec = {};
                        rec.x = (this.tagObj.x > e.offsetX) ? e.offsetX : this.tagObj.x;
                        rec.y = (this.tagObj.y > e.offsetY) ? e.offsetY : this.tagObj.y;
                        rec.w = Math.abs(e.offsetX - this.tagObj.x);
                        rec.h = Math.abs(e.offsetY - this.tagObj.y);
                        //rec.type = currentSelectedType;
                        this.tagObj.newrecsObj = rec;
                        this.tagObj.recs.push(this.tagObj.newrecsObj);
                        this.tagObj.url = this.$refs.tagcanvas.toDataURL();
                    },
                    drawRuler(canvas, ctx, e) { //鼠标画图辅助线
                        ctx.beginPath();
                        ctx.strokeStyle = 'red';
                        ctx.lineWidth = 1;
                        //ctx.strokeStyle="#FF0000";
                        ctx.moveTo(e.offsetX, 0);
                        ctx.lineTo(e.offsetX, canvas.height);
                        ctx.moveTo(0, e.offsetY);
                        ctx.lineTo(canvas.width, e.offsetY);
                        ctx.stroke();
                    },
                    prepareLitRecs(data) { //把一个框的左上角坐标和宽高输入，得到8个坐标，左3，右3中2
                        var li = [];
                        li[0] = [data.x, data.y];
                        li[1] = [data.x, data.y + data.h / 2];
                        li[2] = [data.x, data.y + data.h];
                        li[3] = [data.x + data.w, data.y];
                        li[4] = [data.x + data.w, data.y + data.h / 2];
                        li[5] = [data.x + data.w, data.y + data.h];
                        li[6] = [data.x + data.w / 2, data.y];
                        li[7] = [data.x + data.w / 2, data.y + data.h];
                        return li;
                    },
                    drawOldRecs(recs, ctx) { //鼠标画图后
                    // let tagctx = this.$refs.tagcanvas.getContext('2d');
                        //btn_clear();
                        if (recs.length == 0) {
                            return 0;
                        }
                        // console.log(recs);
                        for (var i = 0; i < recs.length; i++) {
                            //for (var j = 0; j < tags.length; j++) {
                            //if (recs[i].type == tags[j].en_name) {
                            //var id = document.getElementById('type_' + tags[j].en_name);
                            //id.style.background = tags[j].color;
                            this.ctx.beginPath();
                            ctx.lineWidth = 3;
                            //ctx.strokeStyle =tags[j].color;
                            ctx.strokeStyle = "rgb(121, 245, 57)";
                            ctx.strokeRect(recs[i].x, recs[i].y, recs[i].w, recs[i].h);
                            //break;
                            //}
                            //}
                        }
                    },
                    drawRec(canvas, ctx, e) { //画图
                        ctx.strokeRect(this.tagObj.x, this.tagObj.y, e.offsetX - this.tagObj.x, e.offsetY - this.tagObj.y);
                    },
                    moveRec(canvas, rec, e) {
                        // console.log(canvas, rec,JSON.stringify(rec), e);
                        rec.x = this.tagObj.startX + e.offsetX - this.tagObj.x;
                        rec.y = this.tagObj.startY + e.offsetY - this.tagObj.y;
                    },
                    reSizeRec(index, rec, ex, ey, recSize) {
                        var temX = rec.x;
                        var temY = rec.y;
                        if (index < 4 && temX + rec.w - ex > recSize) {
                            rec.x = ex;
                        }
                        if ((index == 1 || index == 4 || index == 7) && temY + rec.h - ey > recSize) {
                            rec.y = ey;
                        }
                        if (index < 4) {
                            if (temX + rec.w - ex > recSize) {
                                rec.w = temX + rec.w - ex;
                            }
                        } else if (index < 7) {
                            if (ex - temX > recSize) {
                                rec.w = ex - temX;
                            }
                        }
                        if (index == 1 || index == 4 || index == 7) {
                            if (temY + rec.h - ey > recSize) {
                                rec.h = temY + rec.h - ey;
                            }
                        } else if (index == 3 || index == 6 || index == 8) {
                            if (ey - temY > recSize) {
                                rec.h = ey - temY;
                            }
                        }
                    }
                }
            }
            </script>
            <style scoped>
            .tagcanvasbox{
                width: 100%;
                height: 100%;
                position: relative;
            }
            canvas{
                position: absolute;
                top: 0;
                left: 0;
            }
            </style>
 