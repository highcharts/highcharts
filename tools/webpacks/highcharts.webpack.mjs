/* *
 *
 *  Imports
 *
 * */

// eslint-disable-next-line node/no-unpublished-import
// import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';
import * as Path from 'node:path';
import FSLib from '../../tools/gulptasks/lib/fs.js';

/* *
 *
 *  Constants
 *
 * */

const sourceFolder = './code/es-modules/';
const mastersFolder = Path.join(sourceFolder, 'masters');
const targetFolder = './code/';

const namespace = 'Highcharts';
const productMasters = [
    'highcharts',
    'highcharts-gantt',
    'highmaps',
    'highstock'
];

/* *
 *
 *  Functions
 *
 * */

function createUMDConfig(...pathMembers) {
    const commonjs = ['highcharts', ...pathMembers];
    return {
        amd: ['highcharts/highcharts', ...pathMembers],
        commonjs,
        commonjs2: commonjs,
        root: [namespace, ...pathMembers]
    };
}

/* *
 *
 *  Distribution
 *
 * */

const externals = [async function (info) {
    const path = Path.posix
        .relative(sourceFolder, Path.join(info.context, info.request))
        .replace(/\.js$/u, '');
    const name = Path.posix.basename(path);
    const issuer = Path.posix.basename(info.issuer || '', '.src.js');

    switch (path) {
        case 'Core/Animation/Fx':
        case 'Core/Axis/Axis':
        case 'Core/Axis/PlotLineOrBand/PlotLineOrBand':
        case 'Core/Axis/Tick':
        case 'Core/Chart/Chart':
        case 'Core/Color/Color':
        case 'Core/Legend/Legend':
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
        case 'Core/Tooltip':
        case 'Core/Time':
            return createUMDConfig(name);
        case 'Core/Animation/AnimationUtilities':
        case 'Core/Defaults':
        case 'Core/Globals':
        case 'Core/Renderer/RendererUtilities':
        case 'Core/Utilities':
            return createUMDConfig();
        case 'Series/Column/ColumnSeries':
            return createUMDConfig('Series', 'types', 'column');
        case 'Series/Line/LineSeries':
            return createUMDConfig('Series', 'types', 'line');
        case 'Series/Pie/PieSeries':
            return createUMDConfig('Series', 'types', 'pie');
        case 'Series/Scatter/ScatterSeries':
            return createUMDConfig('Series', 'types', 'line');
        default:
            return void 0;
    }

}];

const webpacks = FSLib
    .getFilePaths(mastersFolder, true)
    .filter(masterFile => masterFile.endsWith('.js'))
    .map(masterFile => {
        const masterName = Path.basename(masterFile, '.src.js');
        const masterPath = Path.relative(mastersFolder, masterFile);
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
                filename: `./${masterPath}`,
                globalObject: 'window',
                library: {
                    export: 'default',
                    name: {
                        amd: `highcharts/${masterName}`,
                        commonjs: `highcharts/${masterName}`,
                        root: namespace
                    },
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
            // plugins: [new BundleDeclarationsWebpackPlugin.BundleDeclarationsWebpackPlugin({
            //     entry: {
            //         filePath: `./${masterFile}`.replace(/\.js$/u, '.d.ts'),
            //         output: {
            //             sortNodes: false,
            //             // dts-bundle-generator comments in output
            //             noBanner: false,
            //         }
            //     },
            //     outFile: Path
            //         .join(targetFolder, masterPath)
            //         .replace(/(?:\.src)?\.js$/, '.d.ts'),
            //     compilationOptions: {
            //         followSymlinks: false,
            //         preferredConfigPath: './ts/tsconfig.json'
            //     }
            // })],
            resolve: {
                extensions: ['.js', '.ts']
            }
        };
        if (!productMasters.includes(masterName)) {
            webpackConfig.externalsType = 'umd';
            webpackConfig.externals = externals;
        }
        return webpackConfig;
    });

/* *
 *
 *  Default Export
 *
 * */

export default webpacks;
