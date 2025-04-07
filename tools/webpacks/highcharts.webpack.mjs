/* *
 *
 *  Imports
 *
 * */


// eslint-disable-next-line node/no-unpublished-import
// import BDWP from 'bundle-declarations-webpack-plugin';
import * as Path from 'node:path';
import FSLib from '../libs/fs.js';

import Error16Plugin from './plugins/Error16Plugin.mjs';
import ProductMetaPlugin from './plugins/ProductMetaPlugin.mjs';
import UMDExtensionPlugin from './plugins/UMDExtensionPlugin.mjs';
import { makeExternals, resolveExternals } from './externals.mjs';


/* *
 *
 *  Constants
 *
 * */


const __dirname = import.meta.dirname;

const sourceFolder = Path.join('code', 'es-modules');
const mastersFolder = Path.join(sourceFolder, 'masters');

const esmTargetFolder = Path.join('code', 'esm');
const umdTargetFolder = Path.join('code');

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
 *  Functions
 *
 * */


function getMasterName(masterPath) {
    return masterPath
        .replace(/(?:\.src)?\.js$/u, '')
        .replaceAll(Path.sep, Path.posix.sep);
}


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
        const masterName = getMasterName(masterPath);
        const umdWebpack = {
            // path to the main file
            entry: './' + masterFile.replaceAll(Path.sep, Path.posix.sep),
            mode: 'production',
            optimization: {
                concatenateModules: true,
                mangleExports: false,
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
                path: Path.resolve(umdTargetFolder)
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
                // new BDWP.BundleDeclarationsWebpackPlugin({
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
                    namespace,
                    productMasters[0],
                    'umd'
                )
            ];
        }
        return umdWebpack;
    });


/**
 * ES module bundles
 */
const esmWebpacks = umdWebpacks.map(umdWebpack => {
    const masterPath = umdWebpack.output.filename;
    const masterName = getMasterName(masterPath);
    const esmWebpack = {
        entry: umdWebpack.entry,
        experiments: {
            outputModule: true
        },
        externalsType: 'module-import',
        module: {
            rules: [
                {
                    test: /\.src\.js$/u,
                    exclude: /node_modules/u,
                    use: {
                        loader:
                            Path.join(__dirname, 'plugins/MastersLoader.mjs'),
                        options: {
                            mastersFolder,
                            requirePrefix: 'highcharts'
                        }
                    }
                }
            ]
        },
        mode: 'production',
        optimization: umdWebpack.optimization,
        output: {
            filename: masterPath,
            globalObject: 'this',
            library: {
                type: 'modern-module'
            },
            module: true,
            path: Path.resolve(esmTargetFolder)
        }
    };

    esmWebpack.plugins = [
        new ProductMetaPlugin({
            productName: 'Highcharts'
        })
    ];

    if (
        masterName !== productMasters[0] &&
        !masterName.includes('standalone')
    ) {
        esmWebpack.externals = [
            (info) => {
                const contextPath =
                    FSLib.path([info.context, info.request], true);

                if (contextPath.includes(mastersFolder)) {
                    return makeExternals(
                        info,
                        masterName,
                        mastersFolder,
                        namespace,
                        'module-import'
                    );
                } else {
                    return resolveExternals(
                        info,
                        masterName,
                        sourceFolder,
                        namespace,
                        productMasters[0],
                        'module-import'
                    );
                }
            }
        ];
    }

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
