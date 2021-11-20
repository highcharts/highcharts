/**
 *
 *  (c) 2010-2021 Wojciech Chmiel
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

import type Point from '../../Core/Series/Point';
import type SMAPoint from './SMA/SMAPoint';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type LinePoint from '../../Series/Line/LinePoint';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    defined,
    error,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        toYData?(point: Point): Array<number>;
    }
}

/* *
 *
 *  Composition
 *
 * */

/**
 * Composition useful for all indicators that have more than one line. Compose
 * it with your implementation where you will provide the `getValues` method
 * appropriate to your indicator and `pointArrayMap`, `pointValKey`,
 * `linesApiNames` properties. Notice that `pointArrayMap` should be consistent
 * with the amount of lines calculated in the `getValues` method.
 *
 * @private
 * @mixin multipleLinesMixin
 */
namespace MultipleLinesComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class Composition extends SMAIndicator {
        linesApiNames: Array<string>;
        options: Options;
        pointArrayMap: Array<string>;
        areaLinesNames: Array<string>;
        pointValKey: string;
        nextPoints: Array<SMAPoint>;
        drawGraph(): void;
        getTranslatedLinesNames(excludedValue?: string): Array<string>;
        translate(): void;
        toYData(point: Point): Array<number>;
    }

    export interface Options {
        fillColor?: SVGAttributes['fill'];
        gapSize?: number;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /**
     * Additional lines DOCS names. Elements of linesApiNames array should
     * be consistent with DOCS line names defined in your implementation.
     * Notice that linesApiNames should have decreased amount of elements
     * relative to pointArrayMap (without pointValKey).
     *
     * @private
     * @name multipleLinesMixin.linesApiNames
     * @type {Array<string>}
     */
    const linesApiNames = ['bottomLine'];

    /**
     * Lines ids. Required to plot appropriate amount of lines.
     * Notice that pointArrayMap should have more elements than
     * linesApiNames, because it contains main line and additional lines ids.
     * Also it should be consistent with amount of lines calculated in
     * getValues method from your implementation.
     *
     * @private
     * @name multipleLinesMixin.pointArrayMap
     * @type {Array<string>}
     */
    const pointArrayMap = ['top', 'bottom'];

    /**
     * Names of the lines, bewteen which the area should be plotted.
     * If the drawing of the area should
     * be disabled for some indicators, leave this option as an empty array.
     * Names should be the same as the names in the pointArrayMap.
     * @private
     * @name multipleLinesMixin.areaLinesNames
     * @type {Array<string>}
     */
    const areaLinesNames: Array<string> = ['top'];
    /**
     * Main line id.
     *
     * @private
     * @name multipleLinesMixin.pointValKey
     * @type {string}
     */
    const pointValKey = 'top';

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    export function compose<T extends typeof SMAIndicator>(
        IndicatorClass: T
    ): (T&typeof Composition) {

        if (composedClasses.indexOf(IndicatorClass) === -1) {
            composedClasses.push(IndicatorClass);

            const proto = IndicatorClass.prototype as Composition;

            proto.linesApiNames = (
                proto.linesApiNames ||
                linesApiNames.slice()
            );
            proto.pointArrayMap = (
                proto.pointArrayMap ||
                pointArrayMap.slice()
            );
            proto.pointValKey = (
                proto.pointValKey ||
                pointValKey
            );

            proto.areaLinesNames = (
                proto.areaLinesNames ||
                areaLinesNames.slice()
            );

            proto.drawGraph = drawGraph;
            proto.getGraphPath = getGraphPath;
            proto.toYData = toYData;
            proto.translate = translate;
            proto.getTranslatedLinesNames = getTranslatedLinesNames;
        }

        return IndicatorClass as (T&typeof Composition);
    }


    /**
     * Create the path based on points provided as argument.
     * If indicator.nextPoints option is defined, create the areaFill.
     *
     * @param points Points on which the path should be created
     */
    function getGraphPath(this: Composition, points: Array<LinePoint>): SVGPath {
        const indicator = this;
        let areaPath: SVGPath,
            path: SVGPath = [],
            higherAreaPath: SVGPath = [];

        points = points || this.points;

        // Render Span
        if (indicator.fillGraph && indicator.nextPoints) {
            areaPath = SMAIndicator.prototype.getGraphPath.call(
                indicator,
                indicator.nextPoints
            );

            if (areaPath && areaPath.length) {
                areaPath[0][0] = 'L';

                path = SMAIndicator.prototype.getGraphPath.call(
                    indicator,
                    points
                );

                higherAreaPath = areaPath.slice(0, path.length);

                // Reverse points, so that the areaFill will start from the end:
                for (let i = higherAreaPath.length - 1; i >= 0; i--) {
                    path.push(higherAreaPath[i]);
                }
            }
        } else {
            path = SMAIndicator.prototype.getGraphPath.apply(
                indicator,
                arguments
            );
        }
        return path;
    }

    /**
     * Draw main and additional lines.
     *
     * @private
     * @function multipleLinesMixin.drawGraph
     */
    function drawGraph(this: MultipleLinesComposition.Composition): void {
        const indicator = this,
            pointValKey = indicator.pointValKey,
            linesApiNames = indicator.linesApiNames,
            areaLinesNames = indicator.areaLinesNames,
            mainLinePoints = indicator.points,
            mainLineOptions = indicator.options,
            mainLinePath = indicator.graph,
            gappedExtend = {
                options: {
                    gapSize: mainLineOptions.gapSize
                }
            },
            // additional lines point place holders:
            secondaryLines = [] as Array<Array<SMAPoint>>,
            secondaryLinesNames = indicator.getTranslatedLinesNames(
                pointValKey
            );

        let pointsLength = mainLinePoints.length,
            point;


        // Generate points for additional lines:
        secondaryLinesNames.forEach(function (
            plotLine: string,
            index: number
        ): void {

            // create additional lines point place holders
            secondaryLines[index] = [];

            while (pointsLength--) {
                point = mainLinePoints[pointsLength];
                secondaryLines[index].push({
                    x: point.x,
                    plotX: point.plotX,
                    plotY: (point as any)[plotLine],
                    isNull: !defined((point as any)[plotLine])
                } as any);
            }

            pointsLength = mainLinePoints.length;
        });

        // Modify options and generate area fill:
        if (this.userOptions.fillColor && areaLinesNames.length) {
            const index = secondaryLinesNames.indexOf(
                    getLineName(areaLinesNames[0])
                ),
                secondLinePoints = secondaryLines[index],
                firstLinePoints =
                    areaLinesNames.length === 1 ?
                        mainLinePoints :
                        secondaryLines[
                            secondaryLinesNames.indexOf(
                                getLineName(areaLinesNames[1])
                            )
                        ],
                originalColor = indicator.color;
            indicator.points = firstLinePoints;
            indicator.nextPoints = secondLinePoints;
            indicator.color = this.userOptions.fillColor as SVGAttributes['fill'];
            indicator.options = merge(
                mainLinePoints,
                gappedExtend
            ) as any;
            indicator.graph = indicator.area;
            indicator.fillGraph = true;
            SeriesRegistry.seriesTypes.sma.prototype.drawGraph.call(indicator);

            indicator.area = indicator.graph;
            // Clean temporary properties:
            delete indicator.nextPoints;
            delete indicator.fillGraph;
            indicator.color = originalColor;
        }

        // Modify options and generate additional lines:
        linesApiNames.forEach(function (lineName: string, i: number): void {
            if (secondaryLines[i]) {
                indicator.points = secondaryLines[i];
                if ((mainLineOptions as any)[lineName]) {
                    indicator.options = merge(
                        (mainLineOptions as any)[lineName].styles,
                        gappedExtend
                    );
                } else {
                    error(
                        'Error: "There is no ' + lineName +
                        ' in DOCS options declared. Check if linesApiNames' +
                        ' are consistent with your DOCS line names."' +
                        ' at mixin/multiple-line.js:34'
                    );
                }
                indicator.graph = (indicator as any)['graph' + lineName];
                SMAIndicator.prototype.drawGraph.call(indicator);

                // Now save lines:
                (indicator as any)['graph' + lineName] = indicator.graph;
            } else {
                error(
                    'Error: "' + lineName + ' doesn\'t have equivalent ' +
                    'in pointArrayMap. To many elements in linesApiNames ' +
                    'relative to pointArrayMap."'
                );
            }
        });

        // Restore options and draw a main line:
        indicator.points = mainLinePoints;
        indicator.options = mainLineOptions;
        indicator.graph = mainLinePath;
        SMAIndicator.prototype.drawGraph.call(indicator);
    }

    /**
     * Create translatedLines Collection based on pointArrayMap.
     *
     * @private
     * @function multipleLinesMixin.getTranslatedLinesNames
     * @param {string} [excludedValue]
     *        Main line id
     * @return {Array<string>}
     *         Returns translated lines names without excluded value.
     */
    function getTranslatedLinesNames(
        this: MultipleLinesComposition.Composition,
        excludedValue?: string
    ): Array<string> {
        const translatedLines: Array<string> = [];

        (this.pointArrayMap || []).forEach(
            function (propertyName: string): void {
                if (propertyName !== excludedValue) {
                    translatedLines.push(getLineName(propertyName));
                }
            }
        );

        return translatedLines;
    }

    /**
     * Generate the API name of the line
     * @param propertyName name of the line
     */
    function getLineName(propertyName: string): string {
        return (
            'plot' +
            propertyName.charAt(0).toUpperCase() +
            propertyName.slice(1)
        );
    }

    /**
     * @private
     * @function multipleLinesMixin.toYData
     * @param {Highcharts.Point} point
     *        Indicator point
     * @return {Array<number>}
     *         Returns point Y value for all lines
     */
    function toYData(
        this: MultipleLinesComposition.Composition,
        point: Point
    ): Array<number> {
        const pointColl: Array<number> = [];

        (this.pointArrayMap || []).forEach(
            function (propertyName: string): void {
                pointColl.push((point as any)[propertyName]);
            }
        );
        return pointColl;
    }

    /**
     * Add lines plot pixel values.
     *
     * @private
     * @function multipleLinesMixin.translate
     */
    function translate(this: Composition): void {
        const indicator = this,
            pointArrayMap: Array<string> = (indicator.pointArrayMap as any);
        let LinesNames = [] as Array<string>,
            value;

        LinesNames = indicator.getTranslatedLinesNames();

        SMAIndicator.prototype.translate.apply(indicator, arguments as any);

        indicator.points.forEach(function (point: Point): void {
            pointArrayMap.forEach(function (
                propertyName: string,
                i: number
            ): void {
                value = (point as any)[propertyName];

                // If the modifier, like for example compare exists,
                // modified the original value by that method, #15867.
                if (indicator.dataModify) {
                    value = indicator.dataModify.modifyValue(value);
                }

                if (value !== null) {
                    (point as any)[LinesNames[i]] = indicator.yAxis.toPixels(
                        value,
                        true
                    );
                }
            });
        });
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default MultipleLinesComposition;
