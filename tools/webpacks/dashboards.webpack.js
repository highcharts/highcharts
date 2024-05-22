/* eslint-disable */

const path = require('path');
const projectPath = path.resolve(__dirname, '..', '..');

module.exports = {
    entry: path.resolve(projectPath, 'ts', 'masters-dashboards', 'dashboards.src.ts'),
    mode: 'development',
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    output: {
        chunkFormat: 'module',
        filename: 'dashboards.src.js',
        path: path.resolve(projectPath, 'code'),
        uniqueName: 'dashboards',
        library: {
            name: 'Dashboards',
            type: 'umd'
        }
    }
};
