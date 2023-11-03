const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.ts$/u, // This rule is for TypeScript files
                use: 'ts-loader',
                exclude: /node_modules/u
            },
            {
                test: /\.css$/u,
                use: ['style-loader', 'css-loader']
            }
        ]
    }
};
