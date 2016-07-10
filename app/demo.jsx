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


var MainReactApp = React.createClass({
    render:function(){
        return (
            <section className = "stage">
                <section className = "img-sec">
                </section>
                <nav className = "controller-nav">
                </nav>
            </section>
            )
    }
})

ReactDOM.render(<MainReactApp />,document.getElementById('container'))




 