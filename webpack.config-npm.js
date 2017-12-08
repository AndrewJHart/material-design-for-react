var path = require('path');
var webpack = require('webpack');

var config = {
    entry: './src/lib/index.js',

    output: {
        path: path.join(__dirname, "./public/dist"),
        filename: 'reactmaterial.js',
        libraryTarget: 'umd'
    },
    
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',

                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                include: /node_modules/,
                loader: 'style-loader!css-loader'
            },
            { test: /\.svg$/, loader: 'svg-loader' },
            {
                test: /\.css$/,
                include: /src/,
                loader: 'style-loader!css-loader'
            }
        ]
    },
     externals: [{
        'react': {
            root: 'React',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react'
        }
    }, {
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom'
        }
    }],
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,   // enable source maps to map errors (stack traces) to modules
            output: {
              comments: false, // remove all comments
            },
          })
    ]
}
console.log('output path...' + config.output.path);
module.exports = config;