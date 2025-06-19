/* *
 *
 *  Imports
 *
 * */


// eslint-disable-next-line node/no-unpublished-import
// import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';
import * as Path from 'node:path';
import FSLib from '../libs/fs.js';

import Error16Plugin from './plugins/Error16Plugin.mjs';
import ProductMetaPlugin from './plugins/ProductMetaPlugin.mjs';
import UMDExtensionPlugin from './plugins/UMDExtensionPlugin.mjs';
import { resolveExternals } from './externals.mjs';


/* *
 *
 *  Constants
 *
 * */

const sourceFolder = Path.join('code', 'grid', 'es-modules');
const mastersFolder = Path.join(sourceFolder, 'masters');
const targetFolder = Path.join('code', 'grid');

const buildProps = FSLib.getFile(
    Path.join('tools', 'gulptasks', 'grid', 'build-properties.json'),
    true
);

const namespace = 'Grid';
const productMasters = [
    'grid-lite'
];

/* *
 *
 *  Distribution
 *
 * */


const webpacks = FSLib
    .getFilePaths(mastersFolder, true)
    .filter(masterFile => masterFile.endsWith('.js'))
    .map(masterFile => {
        const masterPath = Path.relative(mastersFolder, masterFile);
        const masterName = masterPath
            .replace(/(?:\.src)?\.js$/u, '')
            .replaceAll(Path.sep, Path.posix.sep);
        const webpackConfig = {
            // path to the main file
            entry: './' + masterFile.replaceAll(Path.sep, Path.posix.sep),
            mode: 'production',
            optimization: {
                concatenateModules: true,
                minimize: false,
                moduleIds: 'deterministic'
            },
            output: {
                filename: masterPath,
                globalObject: 'this',
                library: {
                    export: 'default',
                    name: (
                        productMasters.includes(masterName) ?
                            {
                                amd: 'grid/grid',
                                commonjs: 'grid',
                                root: namespace
                            } :
                            {
                                amd: `grid/${masterName}`,
                                commonjs: `grid/${masterName}`,
                                root: namespace
                            }
                    ),
                    type: 'umd',
                    umdNamedDefine: true
                },
                path: Path.resolve(targetFolder)
            },
            performance: {
                hints: 'error',
                maxAssetSize: 2500000,
                maxEntrypointSize: 2500000
            },
            plugins: [
                new Error16Plugin({
                    productBundles: productMasters.map(pm => `${pm}.src.js`)
                }),
                new ProductMetaPlugin({
                    productName: 'Grid',
                    productVersion: buildProps.version
                }),
                new UMDExtensionPlugin({
                    productBundles: productMasters.map(pm => `${pm}.src.js`)
                })
            ],
            resolve: {
                extensions: ['.js', '.ts']
            }
        };
        if (!productMasters.includes(masterName)) {
            webpackConfig.externalsType = 'umd';
            webpackConfig.externals = [
                info => resolveExternals(
                    info,
                    masterName,
                    sourceFolder,
                    namespace
                )
            ];
        }
        return webpackConfig;
    });


/* *
 *
 *  Default Export
 *
 * */


export default webpacks;
