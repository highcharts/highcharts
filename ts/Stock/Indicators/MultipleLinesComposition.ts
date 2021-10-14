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

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        sma: SMAIndicator
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
import AreaRangeSeries from '../../Series/AreaRange/AreaRangeSeries.js';
import AreaSeries from '../../Series/Area/AreaSeries.js';
import SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import SVGPath from '../../Core/Renderer/SVG/SVGPath';
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
        areaElement: SVGElement;
        options: Options;
        pointArrayMap: Array<string>;
        pointValKey: string;
        drawGraph(): void;
        getTranslatedLinesNames(excludedValue?: string): Array<string>;
        translate(): void;
        toYData(point: Point): Array<number>;
    }

    export interface Options {
        areaOptions?: AreaBackgroundOptions;
        gapSize?: number;
    }
    interface AreaBackgroundOptions {
        lineNames: Array<string>;
        styles: SVGAttributes;
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

            proto.drawGraph = drawGraph;
            proto.toYData = toYData;
            proto.translate = translate;
            proto.getTranslatedLinesNames = getTranslatedLinesNames;
        }

        return IndicatorClass as (T&typeof Composition);
    }

    /**
     * Draw main and additional lines.
     *
     * @private
     * @function multipleLinesMixin.drawGraph
     * @return {void}
     */
    function drawGraph(this: MultipleLinesComposition.Composition): void {
        const indicator = this,
            pointValKey = indicator.pointValKey,
            linesApiNames = indicator.linesApiNames,
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
        drawArea(indicator);

    }

    /**
     * Function, that draws and updates the area between lines in the indicator.
     * @param indicator multiline indicator
     */
    function drawArea(indicator: MultipleLinesComposition.Composition): void {
        const options = indicator.options.areaOptions;

        if (options && indicator.graph) {
            const lineNames = options.lineNames;
            const firstLine = (indicator as any)[`graph${lineNames[0]}`];
            const secondLine = (indicator as any)[`graph${lineNames[1]}`];
            const firstPath = firstLine ? firstLine.pathArray : indicator.graph.pathArray;
            const secondPath = (secondLine ? secondLine.pathArray.reverse() : indicator.graph.pathArray);
            secondPath[0][0] = 'L';
            const path = firstPath.concat(secondPath);

            // animation doesn't work :(
            if (indicator.areaElement) {
                indicator.areaElement.attr({ d: path });
            } else {
                indicator.areaElement = indicator.chart.renderer
                    .path({ d: path })
                    .attr(options.styles)
                    .add(indicator.group);
            }
        }
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
                    translatedLines.push(
                        'plot' +
                        propertyName.charAt(0).toUpperCase() +
                        propertyName.slice(1)
                    );
                }
            }
        );

        return translatedLines;
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
     * @return {void}
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
