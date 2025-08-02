const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    //入口
    entry: path.resolve(__dirname, 'js/nav.js'),
    output: {
        path: path.resolve(__dirname, 'finally'),
        filename: 'finally_index.js',
        clean: true,
        assetModuleFilename: 'data/img/[name][ext]'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'finally_index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'finally_index.css'
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: 'data/img', to: 'data/img' }   // 相对项目根
            ]
          })

    ],
    module: {
        rules: [{
            test: /\.css$/i,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        ],
    },
}