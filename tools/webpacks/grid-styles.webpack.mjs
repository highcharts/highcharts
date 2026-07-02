/* eslint-disable node/no-unpublished-import */
import * as FS from 'node:fs';
import * as Path from 'node:path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import RemoveEmptyScriptsPlugin from 'webpack-remove-empty-scripts';
import Webpack from 'webpack';


/* *
 *
 *  Helpers
 *
 * */

function extractLeadingComments(content) {
    const match = content.match(/^(\s*\/\*[\s\S]*?\*\/\s*)+/u);

    return match ? `${match[0].trimEnd()}\n` : '';
}


/* *
 *
 *  Constants
 *
 * */

const stylesFolder = Path.join('css', 'grid');
const targetFolder = Path.join('code', 'grid', 'css');
const bannerByOutput = new Map([[
    'grid-lite.css',
    extractLeadingComments(
        FS.readFileSync(Path.resolve(stylesFolder, 'grid-lite.css'), 'utf8')
    )
], [
    'grid-pro.css',
    extractLeadingComments(
        FS.readFileSync(Path.resolve(stylesFolder, 'grid-pro.css'), 'utf8')
    )
], [
    'grid.css',
    extractLeadingComments(
        FS.readFileSync(Path.resolve(stylesFolder, 'grid.css'), 'utf8')
    )
]]);

/* *
 *
 *  Webpack configuration
 *
 * */

export default {
    entry: {
        'grid-lite': Path.resolve(stylesFolder, 'grid-lite.css'),
        'grid-pro': Path.resolve(stylesFolder, 'grid-pro.css'),
        grid: Path.resolve(stylesFolder, 'grid.css') // deprecated
    },
    output: {
        path: Path.resolve(targetFolder),
        clean: false
    },
    module: {
        rules: [{
            test: /\.css$/u,
            use: [
                MiniCssExtractPlugin.loader,
                'css-loader'
            ]
        }]
    },
    plugins: [
        new RemoveEmptyScriptsPlugin(),
        new Webpack.BannerPlugin({
            banner: data => bannerByOutput.get(Path.basename(data.filename)) || '',
            raw: true,
            test: /(^|\/)grid(?:-lite|-pro)?\.css$/u
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ],
    optimization: {
        minimize: false,
        splitChunks: false,
        runtimeChunk: false
    },
    devtool: false,
    mode: 'production'
};
