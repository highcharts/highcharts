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

const externals = FSLib.getFile(
    FSLib.path([import.meta.dirname, 'externals.json']),
    true
);


/* *
 *
 *  Functions
 *
 * */


/**
 * Creates a configuration to resolve an external reference via the given path.
 *
 * @param  {...Array<string>} pathMembers
 * Path to resolve to.
 *
 * @returns 
 * UMD configuration.
 */
function createUMDConfig(...pathMembers) {
    const commonjs = ['highcharts', ...pathMembers];
    return {
        amd: ['highcharts/highcharts', ...pathMembers],
        commonjs,
        commonjs2: commonjs,
        root: [namespace, ...pathMembers]
    };
}


/**
 * Resolves external references of the binded master file to specific UMD paths.
 *
 * @param {*} info
 * Webpack reference information.
 *
 * @param {string} masterName
 * Master name that gets bundled.
 *
 * @return
 * UMD config for external reference, or `undefined` to include reference in
 * bundle.
 */
export async function resolveExternals(info, masterName) {
    // eslint-disable-next-line no-invalid-this
    const path = Path
        .relative(sourceFolder, Path.join(info.context, info.request))
        .replace(/(?:\.src)?\.js$/u, '')
        .replaceAll(Path.sep, Path.posix.sep);
    const name = Path.basename(path);

    // Quick exit on entry point
    if (masterName === name) {
        return void 0;
    }

    // Quick exit on standalone
    if (masterName.includes('standalone')) {
        return void 0;
    }

    for (const external of externals) {
        if (external.files.includes(path)) {
            return (
                external.included.includes(masterName) ?
                    void 0 :
                    createUMDConfig(
                        ...external.namespacePath
                            .replace(/\{name\}/gsu, name)
                            .split('.')
                            .slice(1)
                    )
            );
        }
    }

    return void 0;
}


/* *
 *
 *  Distribution
 *
 * */


const webpacks = FSLib
    .getFilePaths(mastersFolder, true)
    .filter(masterFile => masterFile.endsWith('.js'))
    .map(masterFile => {
        const masterPath = Path.relative(mastersFolder, masterFile)
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
            webpackConfig.externalsType = 'umd';
            webpackConfig.externals = [
                (info) => resolveExternals(info, masterName)
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
