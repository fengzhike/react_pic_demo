require('./style/main')

var React = require('react')
var ReactDOM = require('react-dom');

//获取图片相关数据
var imageDatas = require('./data/imgData.json')

//利用自执行函数,将图片名信息，转成图片URL路径信息
imageDatas = (function getImgeURl(imageDatasArr){
    for(var i = 0 ,j = imageDatasArr.length; i < j; i++){
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURl = require('./images/' + singleImageData.fileName);
       imageDatasArr[i] =  singleImageData;
    }
    return imageDatasArr;
})(imageDatas)

//添加渲染盒子
var Container = document.createElement('div');
Container.id = 'container';
document.body.appendChild(Container);

var ImgFigure = React.createClass({
    handleClick:function(e){
        if(this.props.arrange.isCenter){
            this.props.inverse()
        }else{
            this.props.center()
        }

       

        e.stopPropagation();
        e.preventDefault();
    },  
    render:function(){
        var styleObj = {};
        //如果
        if (this.props.arrange.pos){
            styleObj = this.props.arrange.pos;   
        }
        if(this.props.arrange.rotate){
            ['Moz','ms','Webkit',''].forEach(function(value){
                 styleObj[value + 'transform'] = 'rotate('+this.props.arrange.rotate +'deg)';
            }.bind(this))
        }
        if(this.props.arrange.isCenter){
            styleObj.zIndex = 11;
        }
        var imgFigureClassName = 'img-figure';
        imgFigureClassName += this.props.arrange.isInverse ? ' inverse' : ''; 
        return (
                <figure className ={imgFigureClassName} style = {styleObj} onClick = {this.handleClick}>
                    <img src = {this.props.data.imageURl}
                        alt = {this.props.data.title}
                    />
                    <figcaption>
                        <h2 className = "img-title">{this.props.data.title}</h2>
                        <div className = "img-back" onClick = {this.handleClick} >
                            <p>
                                {this.props.data.desc } 
                            </p>
                        </div>
                    </figcaption>
                </figure>
            )
    }
});
/*

    控制组件
 */
var ControllerUnit = React.createClass({
    handleClick:function(e){
        //点击居中图片，翻转，否则居中  
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }else{
            this.props.center();
        }




        e.preventDefault();
        e.stopPropagation();
    },
    render:function(){

        var controllerUnitClassName = "controller-unit";
        //对应的是居中的图片，显示按钮居中态
        if(this.props.arrange.isCenter){
            controllerUnitClassName += ' center';
            //同时，是反转图片，对应翻转态
            if(this.props.arrange.isInverse){
                controllerUnitClassName += ' inverse';
            }
        }
        return (
            <span className = {controllerUnitClassName} onClick = {this.handleClick}></span>
            )
    }
})


var MainReactApp = React.createClass({

    Constant:{
        centerPos:{//中心图片位置
            left:0,
            right:0
        },
        hPosRange:{//水平方向的取值范围
            leftSecX:[0,0],
            rightSecX:[0,0],
            y:[0,0]
        },
        vPosRange:{//垂直方向的取值范围
            x:[0,0],
            topY:[0,0]

        }
    },

//反转图片，输入当前被执行inverse操作的图片对应的图片信息数组的index，
//return一个函数：闭包函数，期内return一个真正要执行的函数
    inverse:function(index){
        //console.log(this.state.imgsArrangeArr)
        return function(){
            var imgsArrangeArr = this.state.imgsArrangeArr;
            //console.log( this.state)
            imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
           // console.log(imgsArrangeArr[index].isInverse )
            this.setState({
                imgsArrangeArr:imgsArrangeArr
            })
        }.bind(this)



    },
    /*
        利用rearrange的函数，居中吧 对应index的图片
     */
    center:function(index){
        return function(){
            this.rearrange(index)
        }.bind(this)
    },

    //重新布局所有图片
    //指定居中哪一个图片
    rearrange:function(centerIndex){
        //console.log(this.Constant) 
        var imgsArrangeArr = this.state.imgsArrangeArr,
            Constant = this.Constant,
            centerPos = Constant.centerPos,
            hPosRange = Constant.hPosRange,
            vPosRange = Constant.vPosRange,
            hPosRangeRight = hPosRange.rightSecX,
            hPosRangeLeft = hPosRange.leftSecX,
            hPosRangeY = hPosRange.y,
            vPosRangeTopY = vPosRange.topY,
            vPosRangeX = vPosRange.x,

            imgsArrangeTopArr = [],
            //上侧取一个或者不取
            topImgNum = Math.floor(Math.random() * 2) ,
            topImgSpliceIndex = 0,
            //中心图片
            imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

        //首先居中 centerindex的图片
        imgsArrangeCenterArr[0] = {
            pos : centerPos, 
            rotate :0,
            isCenter :true   
        }
        //取出要布局上侧的图片状态信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum) );
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        //布局上侧图片
        imgsArrangeTopArr.forEach(function(value,index){
            imgsArrangeTopArr[index] = {
              pos:{
                top:getRangeRandom( vPosRangeTopY[0], vPosRangeTopY[1] ),
                left:getRangeRandom(vPosRangeX[0], vPosRangeX[1] )
              },
              rotate:get30degRandom(),
              isCenter:false  
            }
        });
        //布局左右两侧图片
        for(var i = 0,j = imgsArrangeArr.length,k = j/2;i<j;i++){
            var hPosRangeLORX = null;
            //前半部分左边，右半部分右边
            if(i<k){
                hPosRangeLORX = hPosRangeLeft;
            }else{
                hPosRangeLORX = hPosRangeRight;
            }
            
            imgsArrangeArr[i] = {
                pos :{
                    top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
                    left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
                },
                rotate:get30degRandom(),
                isCenter:false
            }


        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){

            imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);

        }
        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0] );
       
        this.setState({
            imgsArrangeArr:imgsArrangeArr
        })

    },
    getInitialState:function(){
        return {
            imgsArrangeArr:[
                  /* pos:{
                    left:'0',
                    top:'0'
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                */
            ]
        }
        
    },
    //组件加载以后为每张图片计算其未知的范围
    componentDidMount:function(){
        //舞台宽度，以及半宽取整
        var stageDOM = ReactDOM.findDOMNode(this.refs.stage) ,
            stageW = stageDOM.scrollWidth,
            stageH = stageDOM.scrollHeight,
            halfStageW = Math.ceil(stageW/2),
            halfStageH = Math.ceil(stageH/2);
        //拿到一个imgFigure的大小
        var imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
            imgW = imgFigureDOM.scrollWidth,
            imgH = imgFigureDOM.scrollHeight,
            halfImgW = Math.ceil(imgW/2),
            halfImgH = Math.ceil(imgH/2);
        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        };  
        //计算左、右侧图片排布位置的取值范围
        this.Constant.hPosRange = {
            leftSecX: [-halfImgW , halfStageW - halfImgW*3],
            rightSecX:[halfStageW + halfImgW , stageW - halfImgW],
            y:[-halfImgH,stageH - halfImgH]
        };
        //计算上侧图片位置的取值范围
        this.Constant.vPosRange = {
            x:[halfStageW- imgW,halfStageW],
            topY:[-halfImgH, halfStageH - halfImgH * 3]

        };

        this.rearrange(0);
    },
    render:function(){
        var contrellerUnits = [],
            imgFigures = [];
        imageDatas.forEach(function(value,index){
            if(!this.state.imgsArrangeArr[index]){
                this.state.imgsArrangeArr[index] = {
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,
                    isInverse:false,
                    isCenter:false
                };
            };
            imgFigures.push(<ImgFigure key ={ "img-fig"+index} data = {value} ref = {"imgFigure" +index } arrange = {this.state.imgsArrangeArr[index]} inverse = {this.inverse(index)} center = {this.center(index)}/>)
            contrellerUnits.push(<ControllerUnit key ={ "con-unit"+index}  arrange = {this.state.imgsArrangeArr[index]}  inverse = {this.inverse(index)} center = {this.center(index)} />)
        }.bind(this))

        return (
            <section className = "stage" ref = "stage">
                <section className = "img-sec">
                    {imgFigures}
                </section>
                <nav className = "controller-nav">
                    {contrellerUnits}
                </nav>
            </section>
            )
    }
});


//将大管家渲染到document中
ReactDOM.render(<MainReactApp />,document.getElementById('container'));



//获取两个值之间的随机值

function getRangeRandom(low,high){
    return (Math.random()*(high - low) + low)
}
function get30degRandom(){
    return((Math.random() > 0.5 ? '': '-' )+  Math.ceil(Math.random()*30) )
}



