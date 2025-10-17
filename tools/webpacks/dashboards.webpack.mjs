/* *
 *
 *  Imports
 *
 * */


import * as Path from 'node:path';
import FS from 'node:fs';
import FSLib from '../libs/fs.js';

import Error16Plugin from './plugins/Error16Plugin.mjs';
import ProductMetaPlugin from './plugins/ProductMetaPlugin.mjs';
import UMDExtensionPlugin from './plugins/UMDExtensionPlugin.mjs';
import { appendExternals, loadExternalsJSON, resolveExternals } from './externals.mjs';


/* *
 *
 *  Constants
 *
 * */

const dashboardsCfg = FSLib.getFile(
    Path.join('tools', 'gulptasks', 'scripts-dts', 'dashboards', '_config.json'),
    true
);

const dashboardsBuildProps = FSLib.getFile(
    Path.join('tools', 'gulptasks', 'dashboards', 'build-properties.json'),
    true
);

const sourceFolder = Path.join('code', 'dashboards', 'es-modules');
const mastersFolder = Path.join(sourceFolder, 'masters');
const targetFolder = Path.join('code', 'dashboards');

const namespace = 'Dashboards';
const productMasters = [
    'dashboards'
];

loadExternalsJSON(FSLib.path([import.meta.dirname, 'externals.json']));

const dashboardsExternals = FSLib.getFile(
    Path.join('tools', 'webpacks', 'externals-dashboards.json'),
    true
);

appendExternals(dashboardsExternals);

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
                                amd: `dashboards/${masterName}`,
                                commonjs: `dashboards/${masterName}`,
                                root: namespace
                            } :
                            {
                                amd: `dashboards/${masterName}`,
                                commonjs: `dashboards/${masterName}`,
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
                    productName: dashboardsCfg.product,
                    productVersion: process.env.DASH_RELEASE || dashboardsBuildProps.version
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
                    namespace,
                    productMasters[0], // dashboards as default product
                    'umd'
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
