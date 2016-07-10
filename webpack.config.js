var htmlWebpackPlugin = require('html-webpack-plugin');
var path = require("path");
console.log(path.resolve(__dirname,"app"))
module.exports = {
	entry:{
		build:"./app/demo.jsx"
	},
	output:{
		path:"./build/",
		filename:"./js/[name].js"
	},
	module:{
		loaders:[
             {  
                test: /\.scss$/,
                loaders: ["style", "css", "sass"],
                exclude:"/node_modules/",
                include:path.resolve(__dirname,"app")
            },
			{
				test:/\.css$/,
				loaders:["style","css"],
				exclude:"/node_modules/",
                include:path.resolve(__dirname,"app")
			},
			{
				test:/\.jsx?$/,
				loaders:['react-hot','babel?presets[]=es2015&presets[]=react'],
				exclude:"/node_modules/",
				include:path.resolve(__dirname,"app")
			},
			{
				test:/\.json$/,
				loader:'json-loader',
				exclude:"/node_modules/",
				include:path.resolve(__dirname,"app")

			},
			{
				test:/\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
				loader:'url-loader?limit=8192&name=./image/[name].[ext]',
				exclude:"/node_modules/",
				include:path.resolve(__dirname,"app")
			}
		]
	},
	devServer:{

	},
	resolve:{
		extensions:['','.js',".css",'.jsx',".scss"]  //自动补全识别后缀
	},
	plugins:[
		new htmlWebpackPlugin({
			title:"画廊应用",
			chunks:["build"],
			filename:'../index.html'
		})
	]
}