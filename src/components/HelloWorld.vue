<template>
  <div class="hello">
    <div id="container" style="height:800px;"></div>
    <div id="container2" style="height:800px;"></div>
  </div>
</template>

<script>
    export default {
        name: 'HelloWorld',
        data(){
            return {
                blist:[],
                districtLoading:0
            }
        },
        // mounted(){
        //     let opts = {
        //         subdistrict: 0,
        //         extensions: 'all',
        //         level: 'city'
        //     };
        //     //利用行政区查询获取边界构建mask路径
        //     //也可以直接通过经纬度构建mask路径
        //     let district = new AMap.DistrictSearch(opts);
        //     district.search('辽宁省', function(status, result) {
        //         let bounds = result.districtList[0].boundaries;
        //         let mask = []
        //         for(let i =0;i<bounds.length;i+=1){
        //             mask.push([bounds[i]])
        //         }
        //         let map = new AMap.Map('container', {
        //             mask:mask,
        //             center:[122.36024,40.30534],
        //             // disableSocket:true,
        //             // showLabel:false,
        //             // labelzIndex:130,
        //             // viewMode:'2D',
        //             // pitch:40,
        //             zoom:8,
        //             mapStyle: 'amap://styles/04766cf6eefb08eae2ad1ac4371c34a3',
        //             // layers:[
        //             //     new AMap.TileLayer.RoadNet({
        //             //         //rejectMapMask:true
        //             //     }),
        //             //     new AMap.TileLayer.Satellite()
        //             // ]
        //         });
        //         //添加描边
        //         for(let i =0;i<bounds.length;i+=1){
        //             new AMap.Polyline({
        //                 path:bounds[i],
        //                 strokeColor:'#99ffff',
        //                 strokeWeight:4,
        //                 map:map
        //             })
        //         }
        //     });
        // },
        created(){
            this.$nextTick(()=>{
                this.initBmap()
                this.getBoundary();
            })

        },
        methods:{
            initBmap(){
                //提示：下面的代码用jquery，所以如果有不能运行的情况请引用后尝试
//百度地图api container对应前端div名称 前端要引用2.0版本的百度地图api
//需引用api.map.baidu.com/library/AreaRestriction/1.2/src/AreaRestriction_min.js
                let map = new BMapGL.Map("container2", { enableMapClick: false }); // 创建地图实例，禁止点击地图底图
//设置样式
                this.map=map
                // map.setMapStyle({
                //     styleJson: [
                //         {//不显示点信息
                //             "featureType": "poi",
                //             "elementType": "all",
                //             "stylers": {
                //                 "color": "#ffffff",
                //                 "visibility": "off"
                //             }
                //         }
                //     ]
                // });
                //
                // map.disableDragging();//禁止拖动
                // map.disableDoubleClickZoom();//禁止双击缩放
            },



            getBoundary() {


                this.addDistrict("广州越秀区");
                this.addDistrict("广州从化区");
                this.addDistrict("广州荔湾区");
                this.addDistrict("广州天河区");
                this.addDistrict("广州白云区");
                this.addDistrict("广州黄埔区");
                this.addDistrict("广州花都区");
                this.addDistrict("广州番禺区");
                this.addDistrict("广州南沙区");
                this.addDistrict("广州海珠区");
                this.addDistrict("广州增城");

            },

            /**
             * 添加行政区划
             * @param {} districtName 行政区划名
             * @returns  无返回值
             */
            addDistrict(districtName) {
                //使用计数器来控制加载过程
                this.districtLoading++;
                let bdary = new BMapGL.Boundary();
                bdary.get(districtName, function (rs) {       //获取行政区域
                    let count = rs.boundaries.length; //行政区域的点有多少个
                    if (count === 0) {
                        alert('未能获取当前输入行政区域');
                        return;
                    }
                    for (let i = 0; i < count; i++) {
                        this.blist.push({ points: rs.boundaries[i], name: districtName });
                    };
                    //加载完成区域点后计数器-1
                    this.districtLoading--;
                    if (districtLoading == 0) {
                        //全加载完成后画端点
                        this.drawBoundary();
                    }
                });
            },


            /**
             * 各种鼠标事件绑定
             */
            click(evt) {
                alert(evt.target.name);
            },

            mouseover(evt) {
                evt.target.label.setZIndex(99);
                evt.target.label.setPosition(evt.point);
                evt.target.label.show();
            },

            mousemove(evt) {
                evt.target.label.setPosition(evt.point);
            },

            mouseout(evt) {
                evt.target.label.hide();
            },

            drawBoundary() {
                //包含所有区域的点数组
                let pointArray = [];

                /*画遮蔽层的相关方法
                *思路: 首先在中国地图最外画一圈，圈住理论上所有的中国领土，然后再将每个闭合区域合并进来，并全部连到西北角。
                *      这样就做出了一个经过多次西北角的闭合多边形*/
                //定义中国东南西北端点，作为第一层
                let pNW = { lat: 59.0, lng: 73.0 }
                let pNE = { lat: 59.0, lng: 136.0 }
                let pSE = { lat: 3.0, lng: 136.0 }
                let pSW = { lat: 3.0, lng: 73.0 }
                //向数组中添加一次闭合多边形，并将西北角再加一次作为之后画闭合区域的起点
                let pArray = [];
                pArray.push(pNW);
                pArray.push(pSW);
                pArray.push(pSE);
                pArray.push(pNE);
                pArray.push(pNW);
                //循环添加各闭合区域
                for (let i = 0; i < blist.length; i++) {
                    //添加显示用标签层
                    let label = new BMapGL.Label(blist[i].name, { offset: new BMapGL.Size(20, -10) });
                    label.hide();
                    map.addOverlay(label);

                    //添加多边形层并显示
                    let ply = new BMapGL.Polygon(blist[i].points, { strokeWeight: 5, strokeColor: "#FF0000", fillOpacity: 0.01, fillColor: " #FFFFFF" }); //建立多边形覆盖物
                    ply.name = blist[i].name;
                    ply.label = label;
                    ply.addEventListener("click", click);
                    ply.addEventListener("mouseover", mouseover);
                    ply.addEventListener("mouseout", mouseout);
                    ply.addEventListener("mousemove", mousemove);
                    map.addOverlay(ply);

                    //添加名称标签层
                    let centerlabel = new BMapGL.Label(blist[i].name, { offset: new BMapGL.Size(0, 0) });
                    centerlabel.setPosition(ply.getBounds().getCenter());
                    map.addOverlay(centerlabel);

                    //将点增加到视野范围内
                    let path = ply.getPath();
                    pointArray = pointArray.concat(path);
                    //将闭合区域加到遮蔽层上，每次添加完后要再加一次西北角作为下次添加的起点和最后一次的终点
                    pArray = pArray.concat(path);
                    pArray.push(pArray[0]);
                }

            },
            addPly(){

                //限定显示区域，需要引用api库
                let boundply = new BMapGL.Polygon(pointArray);
                BMapLib.AreaRestriction.setBounds(map, boundply.getBounds());
                map.setViewport(pointArray);    //调整视野

                //添加遮蔽层
                let plyall = new BMapGL.Polygon(pArray, { strokeOpacity: 0.0000001, strokeColor: "#000000", strokeWeight: 0.00001, fillColor: "#ffffff", fillOpacity: 0.9 }); //建立多边形覆盖物
                map.addOverlay(plyall);
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
</style>
