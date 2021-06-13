/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AnnotationOptions } from './AnnotationOptions';
import type AST from '../../Core/Renderer/HTML/AST';
import type Chart from '../../Core/Chart/Chart';
import type NavigationBindings from './NavigationBindings';
import type Options from '../../Core/Options';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Annotation from './Annotation.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    erase,
    extend,
    find,
    fireEvent,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike' {
    interface ChartLike {
        /** @requires Extensions/Annotations/AnnotationChart */
        annotations?: Array<Annotation>;
        /** @requires Extensions/Annotations/AnnotationChart */
        controlPointsGroup?: SVGElement;
        /** @requires Extensions/Annotations/AnnotationChart */
        plotBoxClip: SVGElement;
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/* *
 *
 *  Class
 *
 * */

class AnnotationChart {

    /* *
     *
     *  Functions
     *
     * */

    private static chartCallback(
        this: Chart,
        chart: AnnotationChart
    ): void {
        chart.plotBoxClip = this.renderer.clipRect(this.plotBox);

        chart.controlPointsGroup = chart.renderer
            .g('control-points')
            .attr({ zIndex: 99 })
            .clip(chart.plotBoxClip)
            .add();

        chart.options.annotations.forEach(function (annotationOptions, i): void {
            if (
                // Verify that it has not been previously added in a responsive
                // rule
                !chart.annotations.some((annotation): boolean =>
                    annotation.options === annotationOptions
                )
            ) {
                const annotation = chart.initAnnotation(annotationOptions);

                chart.options.annotations[i] = annotation.options;
            }
        });

        chart.drawAnnotations();
        addEvent(chart, 'redraw', chart.drawAnnotations);
        addEvent(chart, 'destroy', function (): void {
            chart.plotBoxClip.destroy();
            chart.controlPointsGroup.destroy();
        });
        addEvent(chart, 'exportData', function (this, event: any): void {
            const annotations = chart.annotations,
                csvColumnHeaderFormatter = ((
                    this.options.exporting &&
                    this.options.exporting.csv) ||
                    {}).columnHeaderFormatter,
                // If second row doesn't have xValues
                // then it is a title row thus multiple level header is in use.
                multiLevelHeaders = !event.dataRows[1].xValues,
                annotationHeader = (
                    chart.options.lang &&
                    chart.options.lang.exportData &&
                    chart.options.lang.exportData.annotationHeader
                ),
                columnHeaderFormatter = function (index: any): any {
                    let s;
                    if (csvColumnHeaderFormatter) {
                        s = csvColumnHeaderFormatter(index);
                        if (s !== false) {
                            return s;
                        }
                    }

                    s = annotationHeader + ' ' + index;

                    if (multiLevelHeaders) {
                        return {
                            columnTitle: s,
                            topLevelColumnTitle: s
                        };
                    }

                    return s;
                },
                startRowLength = event.dataRows[0].length,
                annotationSeparator = (
                    chart.options.exporting &&
                    chart.options.exporting.csv &&
                    chart.options.exporting.csv.annotations &&
                    chart.options.exporting.csv.annotations.itemDelimiter
                ),
                joinAnnotations = (
                    chart.options.exporting &&
                    chart.options.exporting.csv &&
                    chart.options.exporting.csv.annotations &&
                    chart.options.exporting.csv.annotations.join
                );

            annotations.forEach((annotation): void => {

                if (annotation.options.labelOptions.includeInDataExport) {

                    annotation.labels.forEach((label): void => {
                        if (label.options.text) {
                            const annotationText = label.options.text;

                            label.points.forEach((points): void => {
                                const annotationX = points.x,
                                    xAxisIndex = points.series.xAxis ?
                                        points.series.xAxis.options.index :
                                        -1;
                                let wasAdded = false;

                                // Annotation not connected to any xAxis -
                                // add new row.
                                if (xAxisIndex === -1) {
                                    const n = event.dataRows[0].length,
                                        newRow: any = new Array(n);

                                    for (let i = 0; i < n; ++i) {
                                        newRow[i] = '';
                                    }
                                    newRow.push(annotationText);
                                    newRow.xValues = [];
                                    newRow.xValues[xAxisIndex] = annotationX;
                                    event.dataRows.push(newRow);
                                    wasAdded = true;
                                }

                                // Annotation placed on a exported data point
                                // - add new column
                                if (!wasAdded) {
                                    event.dataRows.forEach((row: any, rowIndex: number): void => {
                                        if (
                                            !wasAdded &&
                                            row.xValues &&
                                            xAxisIndex !== void 0 &&
                                            annotationX === row.xValues[xAxisIndex]
                                        ) {
                                            if (
                                                joinAnnotations &&
                                                row.length > startRowLength
                                            ) {
                                                row[row.length - 1] +=
                                                annotationSeparator + annotationText;
                                            } else {
                                                row.push(annotationText);
                                            }
                                            wasAdded = true;
                                        }
                                    });
                                }

                                // Annotation not placed on any exported data
                                // point, but connected to the xAxis - add new
                                // row
                                if (!wasAdded) {
                                    const n = event.dataRows[0].length,
                                        newRow: any = new Array(n);

                                    for (let i = 0; i < n; ++i) {
                                        newRow[i] = '';
                                    }
                                    newRow[0] = annotationX;
                                    newRow.push(annotationText);
                                    newRow.xValues = [];

                                    if (xAxisIndex !== void 0) {
                                        newRow.xValues[xAxisIndex] = annotationX;
                                    }
                                    event.dataRows.push(newRow);
                                }
                            });
                        }
                    });
                }
            });

            let maxRowLen = 0;

            event.dataRows.forEach((row: any): void => {
                maxRowLen = Math.max(maxRowLen, row.length);
            });

            const newRows = maxRowLen - event.dataRows[0].length;

            for (let i = 0; i < newRows; i++) {
                const header = columnHeaderFormatter(i + 1);

                if (multiLevelHeaders) {
                    event.dataRows[0].push(header.topLevelColumnTitle);
                    event.dataRows[1].push(header.columnTitle);
                } else {
                    event.dataRows[0].push(header);
                }
            }
        });
    }

    public static compose<T extends typeof Chart>(
        ChartClass: T
    ): (T&typeof AnnotationChart) {
        const chartProto = ChartClass.prototype as AnnotationChart;

        extend(chartProto, AnnotationChart.prototype);

        // Let chart.update() update annotations
        chartProto.collectionsWithUpdate.push('annotations');

        // Let chart.update() create annoations on demand
        chartProto.collectionsWithInit.annotations = [chartProto.addAnnotation];

        // Create lookups initially
        addEvent(
            ChartClass,
            'afterInit',
            function (): void {
                const chart = this as AnnotationChart;

                chart.annotations = [];

                if (!chart.options.annotations) {
                    chart.options.annotations = [];
                }
            }
        );

        chartProto.callbacks.push(AnnotationChart.chartCallback as any);

        return ChartClass as (T&typeof AnnotationChart);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor() {
        throw new Error('Missing class composition from AnnotationChart.compose.');
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Add an annotation to the chart after render time.
     *
     * @function Highcharts.Chart#addAnnotation
     *
     * @param  {Highcharts.AnnotationsOptions} options
     * The annotation options for the new, detailed annotation.
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw or not.
     *
     * @return {Highcharts.Annotation}
     * The newly generated annotation.
     */
    public addAnnotation(
        this: AnnotationChart,
        userOptions: AnnotationOptions,
        redraw?: boolean
    ): Annotation {
        const annotation = this.initAnnotation(userOptions);
        this.options.annotations.push(annotation.options);

        if (pick(redraw, true)) {
            annotation.redraw();
            annotation.graphic.attr({
                opacity: 1
            });
        }
        return annotation;
    }

    public drawAnnotations(
        this: AnnotationChart
    ): void {
        this.plotBoxClip.attr(this.plotBox);

        this.annotations.forEach(function (annotation): void {
            annotation.redraw();
            annotation.graphic.animate({
                opacity: 1
            }, annotation.animationConfig);
        });
    }

    public initAnnotation(
        this: AnnotationChart,
        userOptions: AnnotationOptions
    ): Annotation {
        const chart = this,
            types: AnyRecord = Annotation.types,
            Constructor = (types[userOptions.type || ''] || Annotation),
            annotation = new Constructor(chart, userOptions);

        chart.annotations.push(annotation);

        return annotation;
    }

    /**
     * Remove an annotation from the chart.
     *
     * @param {number|string|Highcharts.Annotation} idOrAnnotation
     * The annotation's id or direct annotation object.
     */
    public removeAnnotation(
        this: AnnotationChart,
        idOrAnnotation: (number|string|Annotation)
    ): void {
        const annotations = this.annotations,
            annotation: Annotation = (idOrAnnotation as any).coll === 'annotations' ?
                idOrAnnotation :
                find(
                    annotations,
                    function (annotation: Annotation): boolean {
                        return annotation.options.id === idOrAnnotation;
                    }
                ) as any;

        if (annotation) {
            fireEvent(annotation, 'remove');
            erase(this.options.annotations, annotation.options);
            erase(annotations, annotation);
            annotation.destroy();
        }
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface AnnotationChart extends Chart {
    annotations: Array<Annotation>;
    controlPointsGroup: SVGElement;
    navigationBindings: NavigationBindings;
    options: AnnotationChart.GlobalOptions;
    plotBoxClip: SVGElement;
    addAnnotation(userOptions: AnnotationOptions, redraw?: boolean): Annotation;
    drawAnnotations(): void;
    initAnnotation(userOptions: AnnotationOptions): Annotation;
    removeAnnotation(idOrAnnotation: (number|string|Annotation)): void;
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace AnnotationChart {
    export interface GlobalOptions extends Options {
        annotations: Array<AnnotationOptions>;
        defs: Record<string, AST.Node>;
        navigation: Highcharts.NavigationOptions;
    }
}

/* *
 *
 * Default Export
 *
 * */

export default AnnotationChart;
