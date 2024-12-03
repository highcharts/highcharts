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


const sourceFolder = './code/es5/es-modules/';
const mastersFolders = [
    'masters',
    'masters-es5'
].map(path => Path.join(sourceFolder, path));
const targetFolder = './code/es5/';

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
 * @return
 * UMD config for external reference, or `undefined` to include reference in
 * bundle.
 */
async function resolveExternals(info) {
    // eslint-disable-next-line no-invalid-this
    const masterName = this.masterName;
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

    // Check for product-specific additions
    switch (path) {
        case 'Core/Axis/Color/ColorAxis':
        case 'Series/ColorMapComposition':
            if (
                masterName !== 'modules/coloraxis' &&
                masterName !== 'modules/heatmap' &&
                masterName !== 'modules/map' &&
                masterName !== 'modules/sunburst' &&
                masterName !== 'modules/treemap'
            ) {
                return createUMDConfig(name);
            }
            break;
        case 'Core/HttpUtilities':
            if (
                masterName !== 'modules/data' &&
                masterName !== 'modules/exporting'
            ) {
                return createUMDConfig(name);
            }
            break;
        case 'Extensions/Annotations/NavigationBindings':
            if (
                masterName !== 'modules/annotations' &&
                masterName !== 'modules/annotations-advanced' &&
                masterName !== 'modules/stock-tools'
            ) {
                return createUMDConfig(name);
            }
            break;
        case 'Extensions/DataGrouping/ApproximationRegistry':
            if (
                masterName !== 'modules/datagrouping' &&
                masterName !== 'modules/stock'
            ) {
                return createUMDConfig('dataGrouping', 'approximations');
            }
            break;
        case 'Gantt/Pathfinder':
            if (
                masterName !== 'modules/gantt' &&
                masterName !== 'modules/pathfinder'
            ) {
                return createUMDConfig(name);
            }
            break;
        case 'Stock/Navigator/Navigator':
        case 'Stock/Scrollbar/Scrollbar':
            if (
                masterName !== 'modules/accessibility' &&
                masterName !== 'modules/gantt' &&
                masterName !== 'modules/navigator' &&
                masterName !== 'modules/stock'
            ) {
                return createUMDConfig(name);
            }
            break;
        case 'Stock/RangeSelector/RangeSelector':
            if (
                masterName !== 'modules/accessibility' &&
                masterName !== 'modules/gantt' &&
                masterName !== 'modules/stock'
            ) {
                return createUMDConfig(name);
            }
            break;
        default:
            break;
    }

    // Fallback to core namespace
    switch (path) {
        case 'Core/Animation/AnimationUtilities':
        case 'Core/Defaults':
        case 'Core/Globals':
        case 'Core/Renderer/RendererUtilities':
        case 'Core/Utilities':
            return createUMDConfig();
        case 'Core/Animation/Fx':
        case 'Core/Axis/Axis':
        case 'Core/Axis/PlotLineOrBand/PlotLineOrBand':
        case 'Core/Axis/Stacking/StackItem':
        case 'Core/Axis/Tick':
        case 'Core/Chart/Chart':
        case 'Core/Color/Color':
        case 'Core/Legend/Legend':
        case 'Core/Legend/LegendSymbol':
        case 'Core/Pointer':
        case 'Core/Renderer/HTML/AST':
        case 'Core/Renderer/SVG/SVGElement':
        case 'Core/Renderer/SVG/SVGRenderer':
        case 'Core/Renderer/RendererRegistry':
        case 'Core/Series/DataLabel':
        case 'Core/Series/Point':
        case 'Core/Series/Series':
        case 'Core/Series/SeriesRegistry':
        case 'Core/Templating':
        case 'Core/Time':
        case 'Core/Tooltip':
            return createUMDConfig(name);
        case 'Series/Area/AreaSeries':
            return createUMDConfig('Series', 'types', 'area');
        case 'Series/AreaSpline/AreaSplineSeries':
            return createUMDConfig('Series', 'types', 'areaspline');
        case 'Series/Bar/BarSeries':
            return createUMDConfig('Series', 'types', 'bar');
        case 'Series/Column/ColumnSeries':
            return createUMDConfig('Series', 'types', 'column');
        case 'Series/Line/LineSeries':
            return createUMDConfig('Series', 'types', 'line');
        case 'Series/Pie/PieSeries':
            return createUMDConfig('Series', 'types', 'pie');
        case 'Series/Scatter/ScatterSeries':
            return createUMDConfig('Series', 'types', 'scatter');
        case 'Series/Spline/SplineSeries':
            return createUMDConfig('Series', 'types', 'spline');
        default:
            return void 0;
    }

}


/* *
 *
 *  Distribution
 *
 * */


const webpacks = [].concat(...mastersFolders.map(mastersFolder => FSLib
    .getFilePaths(mastersFolder, true)
    .filter(masterFile => masterFile.endsWith('.js'))
    .map(masterFile => {
        const masterPath = Path.relative(mastersFolder, masterFile)
        const masterName = masterPath.replace(/(?:\.src)?\.js$/u, '');
        const webpackConfig = {
            // path to the main file
            entry: `./${masterFile}`,
            mode: 'production',
            optimization: {
                concatenateModules: true,
                minimize: false,
                moduleIds: 'deterministic'
            },
            output: {
                chunkFormat: 'array-push',
                filename: `./${masterPath}`,
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
            },
            target: 'es5'
        };
        if (!productMasters.includes(masterName)) {
            webpackConfig.externalsType = 'umd';
            webpackConfig.externals = [resolveExternals.bind({
                masterName
            })];
        }
        return webpackConfig;
    })
));


/* *
 *
 *  Default Export
 *
 * */


export default webpacks;
