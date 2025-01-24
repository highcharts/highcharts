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


const sourceFolder = Path.join('code', 'es-modules');
const mastersFolder = Path.join(sourceFolder, 'masters');
const targetFolder = Path.join('code');

const namespace = 'Highcharts';
const productMasters = [
    'highcharts',
    'highcharts-gantt',
    'highmaps',
    'highstock',
    'standalone-navigator'
];


/* *
 *
 *  Distribution
 *
 * */


/**
 * UMD bundles
 */
const umdWebpacks = FSLib
    .getFilePaths(mastersFolder, true)
    .filter(masterFile => masterFile.endsWith('.js'))
    .map(masterFile => {
        const masterPath = Path.relative(mastersFolder, masterFile)
        const masterName = masterPath
            .replace(/(?:\.src)?\.js$/u, '')
            .replaceAll(Path.sep, Path.posix.sep);
        const umdWebpack = {
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
                                amd: `highcharts/highcharts`,
                                commonjs: `highcharts`,
                                root: namespace
                            } :
                            {
                                amd: `highcharts/${masterName}`,
                                commonjs: `highcharts/${masterName}`,
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
                    productName: 'Highcharts'
                }),
                new UMDExtensionPlugin({
                    productBundles: productMasters.map(pm => `${pm}.src.js`)
                }),
                // new BundleDeclarationsWebpackPlugin.BundleDeclarationsWebpackPlugin({
                //     entry: {
                //         filePath: `./${masterFile}`.replace(/\.js$/u, '.d.ts'),
                //         output: {
                //             sortNodes: false,
                //             // dts-bundle-generator comments in output
                //             noBanner: false,
                //         }
                //     },
                //     outFile: Path.join(targetFolder, masterName) + '.d.ts',
                //     compilationOptions: {
                //         followSymlinks: false,
                //         preferredConfigPath: './ts/tsconfig.json'
                //     }
                // })
            ],
            resolve: {
                extensions: ['.js', '.ts']
            }
        };
        if (!productMasters.includes(masterName)) {
            umdWebpack.externalsType = 'umd';
            umdWebpack.externals = [
                (info) => resolveExternals(
                    info,
                    masterName,
                    sourceFolder,
                    namespace
                )
            ];
        }
        return umdWebpack;
    });


/**
 * ES module bundles
 */
const esmWebpacks = umdWebpacks.map(umdWebpack => {
    const esmWebpack = JSON.parse(JSON.stringify({
        ...umdWebpack,
        experiments: {
            outputModule: true
        },
        externals: void 0,
        externalsType: 'module',
        output: {
            filename: umdWebpack.output.filename,
            libraryTarget: 'module',
            module: true,
            path: Path.resolve(Path.join(targetFolder, 'es-bundles'))
        },
        plugins: void 0
    }));

    esmWebpack.plugins = [
        new ProductMetaPlugin({
            productName: 'Highcharts'
        })
    ];

    // if (umdWebpack.externals) {
    //     esmWebpack.externals = [
    //         (info) => umdWebpack.externals[0](info)?.commonjs2
    //     ];
    // }

    return esmWebpack;
});


/* *
 *
 *  Default Export
 *
 * */


export default [
    ...umdWebpacks,
    ...esmWebpacks
];
