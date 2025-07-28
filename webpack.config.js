const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports={
    //入口
    entry:path.resolve(__dirname,'js/nav.js'),
    output: {
        path:path.resolve(__dirname,'finally'),
        filename:'finally_index.js',
        clean:true//生成打包内容之前溴铵清空输出目录
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:path.resolve(__dirname,'/index.html'),
            filename:path.resolve(__dirname,'finally/finally_index.html')
        }),
        new MiniCssExtractPlugin()

    ],
    module:{
        rules:[{
            test: /\.css$/i,
            use:[MiniCssExtractPlugin.loader,'css-loader']
        },
    ],
    },
}