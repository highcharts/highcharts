/**
 *      Script building JSDocs for interfaces.
 *      The JSDoclets are buildt from two sources:
 *          - an object-tree representing interfaces generated with the 'hc-gen'-repo
 *          - properties in '*Defaults' files which correspond to a given interface
 *              For instance:
 *                  object-props from "ScatterSeriesDefaults" -> JSDocs in "ScatterSeriesOptions" interfaces
 *
 *      TODO:
 *          - Succesfully change the name of this file
 *          - Get this file into a pipeline
 *          - Read the '*Defaults'-files here
 *          - Put our new docs into those interfaces
 *
 */
const gulp = require('gulp');
const { exec } = require('child_process');
const log = require('./lib/log');
const fs = require('node:fs');

function declarationPropegation() {
    const treeName = 'meta.json';
    const treeFolder = '../hc-integration-gen/dist/meta/';
    const treePath = treeFolder + treeName;
    const files = [
        {
            defaults: 'BellcurveSeriesDefaults.js',
            options: 'BellcurveSeriesOptions.d.ts'
        },
        {
            defaults: 'BoxPlotSeriesDefaults.js',
            options: 'BoxPlotSeriesOptions.d.ts'
        },
        {
            defaults: 'BubbleLegendDefaults.js',
            options: 'BubbleSeriesOptions.d.ts'
        },
        {
            defaults: 'BulletSeriesDefaults.js',
            options: 'BulletTargetOptions.d.ts'
        },
        {
            defaults: 'CandlestickSeriesDefaults.js',
            options: 'CandlestickSeriesOptions.d.ts'
        },
        {
            defaults: 'ColumnSeriesDefaults.js',
            options: 'ColumnSeriesOptions.d.ts'
        },
        {
            defaults: 'ColumnPyramidSeriesDefaults.js',
            options: 'ColumnPyramidSeriesOptions.d.ts'
        },
        {
            defaults: 'CylinderSeriesDefaults.js',
            options: 'CylinderSeriesOptions.d.ts'
        },
        {
            defaults: 'DependencyWheelSeriesDefaults.js',
            options: 'DependencyWheelSeriesOptions.d.ts'
        },
        {
            defaults: 'DotPlotSeriesDefaults.js',
            options: 'DotPlotSeriesOptions.d.ts'
        },
        {
            defaults: 'DumbbellSeriesDefaults.js',
            options: 'DumbbellSeriesOptions.d.ts'
        },
        {
            defaults: 'ErrorBarSeriesDefaults.js',
            options: 'ErrorBarSeriesOptions.d.ts'
        },
        {
            defaults: 'FlagsSeriesDefaults.js',
            options: 'FlagsSeriesOptions.d.ts'
        },
        {
            defaults: 'FunnelSeriesDefaults.js',
            options: 'FunnelSeriesOptions.d.ts'
        },
        {
            defaults: 'Funnel3DSeriesDefaults.js',
            options: 'Funnel3DSeriesOptions.d.ts'
        },
        {
            defaults: 'GanttSeriesDefaults.js',
            options: 'GanttSeriesOptions.d.ts'
        },
        {
            defaults: 'HLCSeriesDefaults.js',
            options: 'HLCSeriesOptions.d.ts'
        },
        {
            defaults: 'HeatmapSeriesDefaults.js',
            options: 'HeatmapSeriesOptions.d.ts'
        },
        {
            defaults: 'HeikinAshiSeriesDefaults.js',
            options: 'HeikinAshiSeriesOptions.d.ts'
        },
        {
            defaults: 'HistogramSeriesDefaults.js',
            options: 'HistogramSeriesOptions.d.ts'
        },
        {
            defaults: 'ItemSeriesDefaults.js',
            options: 'ItemSeriesOptions.d.ts'
        },
        {
            defaults: 'MapSeriesDefaults.js',
            options: 'MapSeriesOptions.d.ts'
        },
        {
            defaults: 'MapPointSeriesDefaults.js',
            options: 'MapPointSeriesOptions.d.ts'
        },
        {
            defaults: 'OHLCSeriesDefaults.js',
            options: 'OHLCSeriesOptions.d.ts'
        },
        {
            defaults: 'MapLineSeriesDefaults.js',
            options: 'MapLineSeriesOptions.d.ts'
        },
        {
            defaults: 'OrganizationSeriesDefaults.js',
            options: 'OrganizationSeriesOptions.d.ts'
        },
        {
            defaults: 'NetworkgraphSeriesDefaults.js',
            options: 'NetworkgraphSeriesOptions.d.ts'
        },
        {
            defaults: 'ParetoSeriesDefaults.js',
            options: 'ParetoSeriesOptions.d.ts'
        },
        {
            defaults: 'PackedBubbleSeriesDefaults.js',
            options: 'PackedBubbleSeriesOptions.d.ts'
        },
        {
            defaults: 'PieSeriesDefaults.js',
            options: 'PieSeriesOptions.d.ts'
        },
        {
            defaults: 'PolygonSeriesDefaults.js',
            options: 'PolygonSeriesOptions.d.ts'
        },
        {
            defaults: 'PyramidSeriesDefaults.js',
            options: 'PyramidSeriesOptions.d.ts'
        },
        {
            defaults: 'Pyramid3DSeriesDefaults.js',
            options: 'Pyramid3DSeriesOptions.d.ts'
        },
        {
            defaults: 'SankeySeriesDefaults.js',
            options: 'SankeySeriesOptions.d.ts'
        },
        {
            defaults: 'SolidGaugeSeriesDefaults.js',
            options: 'SolidGaugeSeriesOptions.d.ts'
        },
        {
            defaults: 'Scatter3DSeriesDefaults.js',
            options: 'Scatter3DSeriesOptions.d.ts'
        },
        {
            defaults: 'ScatterSeriesDefaults.js',
            options: 'ScatterSeriesOptions.d.ts'
        },
        {
            defaults: 'StreamgraphSeriesDefaults.js',
            options: 'StreamgraphSeriesOptions.d.ts'
        },
        {
            defaults: 'TiledWebMapSeriesDefaults.js',
            options: 'TiledWebMapSeriesOptions.d.ts'
        },
        {
            defaults: 'TilemapSeriesDefaults.js',
            options: 'TilemapSeriesOptions.d.ts'
        },
        {
            defaults: 'SunburstSeriesDefaults.js',
            options: 'SunburstSeriesOptions.d.ts'
        },
        {
            defaults: 'TimelineSeriesDefaults.js',
            options: 'TimelineSeriesOptions.d.ts'
        },
        {
            defaults: 'VariablePieSeriesDefaults.js',
            options: 'VariablePieSeriesOptions.d.ts'
        },
        {
            defaults: 'TreemapSeriesDefaults.js',
            options: 'TreemapSeriesOptions.d.ts'
        },
        {
            defaults: 'TreegraphSeriesDefaults.js',
            options: 'TreegraphSeriesOptions.d.ts'
        },
        {
            defaults: 'VariwideSeriesDefaults.js',
            options: 'VariwideSeriesOptions.d.ts'
        },
        {
            defaults: 'VectorSeriesDefaults.js',
            options: 'VectorSeriesOptions.d.ts'
        },
        {
            defaults: 'VennSeriesDefaults.js',
            options: 'VennSeriesOptions.d.ts'
        },
        {
            defaults: 'WaterfallSeriesDefaults.js',
            options: 'WaterfallSeriesOptions.d.ts'
        },
        {
            defaults: 'WindbarbSeriesDefaults.js',
            options: 'WindbarbSeriesOptions.d.ts'
        },
        {
            defaults: 'XRangeSeriesDefaults.js',
            options: 'XRangeSeriesOptions.d.ts'
        },
        {
            defaults: 'WordcloudSeriesDefaults.js',
            options: 'WordcloudSeriesOptions.d.ts'
        }
    ];

    log.starting('Interface decleration propegation');

    return new Promise(resolve => {
        exec(
            'yarn generate --targets=meta',
            { cwd: treeFolder },
            generationError => {
                if (generationError) {
                    log.failure('Failed to generate ' + treeName);
                    return;
                }

                log.success('Succesfully generated ' + treeName);

                fs.readFile(treePath, 'utf8', (readingError, tree) => {
                    if (readingError) {
                        log.failure('Failed to read ' + treeName);
                        return;
                    }

                    const parsedTree = JSON.parse(tree);

                    for (const { defaults, options } of files) {
                        const interfaceName = defaults.split('.js')[0];
                        const seriesName = defaults.split('Series')[0];

                        fs.readFile(
                            './code/es-modules/Series/' +
                            seriesName + '/' +
                            defaults,
                            (err, content) => {
                                if (err) {
                                    log.failure('Failed to read ' + defaults);
                                    return;
                                }

                                // Start from the defaults-object, chop comments
                                const top = content
                                    .toString()
                                    .split(interfaceName)[1]
                                    .replace(/\/\*.*?\*\//smg, '');

                                log.message(top);
                            }
                        );

                        const treeLookup = 'plotOptions.' + seriesName.toLowerCase();
                        const optionsObjDocs = parsedTree[treeLookup];
                        const samples = (
                            optionsObjDocs &&
                            optionsObjDocs.samples
                        );

                        if (samples) {
                            let jsdocStr = (
                                '/**\n' +
                                    optionsObjDocs.description
                                        .split('\n')
                                        .map(line => ('* ' + line + '\n'))
                                        .join('')
                            );

                            for (const sample of samples) {
                                const products = sample.products;
                                jsdocStr += (
                                    `* @sample ${
                                        (
                                            products &&
                                                `{${products.join('|')}} ` ||
                                                ''
                                        ) + sample.value
                                    }\n*         ${sample.name}\n*` +

                                    // Unsure about this, @product is probably
                                    // future field of optionsObjDocs
                                    `${
                                        products && (
                                            '* @product' + products.join(' ')
                                        ) ||
                                        ''
                                    }\n`
                                );
                            }

                            jsdocStr += '**/';
                            // log.message('\n' + jsdocStr);
                        }
                    }


                    log.success('Interface declarations propegated with jsDocs');
                });
            }
        );
        resolve();
    });
}

gulp.task('jsdoc-hack', declarationPropegation);
