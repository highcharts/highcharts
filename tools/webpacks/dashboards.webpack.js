/* eslint-disable */

const path = require('path');
const projectPath = path.resolve(__dirname, '..', '..');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

module.exports = {
    devtool: false,
    entry: path.resolve(projectPath, 'ts', 'masters.off', 'dashboards.src.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        plugins: [
            new ResolveTypeScriptPlugin({
                includeNodeModules: false,
            })
        ],
    },
    output: {
        chunkFormat: 'module',
        filename: 'dashboards.src.js',
        path: path.resolve(projectPath, 'code'),
        uniqueName: 'dashboards',
        library: {
            name: 'Dashboards',
            type: 'umd',
        }
    },
};
