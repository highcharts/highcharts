/* eslint-disable */

const path = require('path');
const projectPath = path.resolve(__dirname, '..', '..');

module.exports = {
    devtool: 'inline-source-map',
    entry: path.resolve(projectPath, 'ts', 'masters-dashboards', 'modules', 'layout.src.ts'),
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js'],
        extensionAlias: {
            '.js': ['.ts', '.js'],
        },
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'ts-loader',
                options: {
                    transpileOnly: true
                }
            }]
        }]
    },
    optimization: {
        usedExports: true,
        minimize: false
    },
    output: {
        chunkFormat: 'module',
        filename: 'layout.src.js',
        path: path.resolve(projectPath, 'code', 'dashboards' , 'modules'),
        uniqueName: 'dashboards',
        library: {
            export: 'default',
            name: {
                amd: `highcharts/dashboards/modules/layout`,
                commonjs: `highcharts/dashboards/modules/layout`,
                root: 'Highcharts.Dashboards'
            },
            type: 'umd',
            umdNamedDefine: true
        }
    }
};
