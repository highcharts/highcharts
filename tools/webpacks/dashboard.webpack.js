/* eslint-disable */

const path = require('path');
const projectPath = path.resolve(__dirname, '..', '..');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin").default;

module.exports = {
    entry: path.resolve(projectPath, 'ts', 'masters', 'dashboard.src.ts'),
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
        filename: 'dashboard.min.js',
        path: path.resolve(projectPath, 'code'),
    },
};
