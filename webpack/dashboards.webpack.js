const path = require('path');
const projectPath = path.resolve(__dirname, '..');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        dashboards: path.resolve(projectPath, 'ts', 'masters-dashboards', 'dashboards.src.ts'),
        'modules/layout': path.resolve(projectPath, 'ts', 'masters-dashboards', 'modules', 'layout.src.ts')
    },
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js'],
        extensionAlias: {
            '.js': ['.ts', '.js']
        }
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
        filename: '[name].src.js',
        path: path.resolve(projectPath, 'dist', 'dashboards'),
        uniqueName: 'dashboards',
        library: {
            export: 'default',
            name: {
                amd: 'highcharts/dashboards',
                commonjs: 'highcharts/dashboards',
                root: 'Dashboards'
            },
            type: 'umd',
            umdNamedDefine: true
        }
    }
};
