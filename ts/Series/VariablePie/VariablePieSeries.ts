/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2021 Grzegorz Blachliński
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
import type DataLabel from '../../Core/Series/DataLabel';
import type VariablePiePoint from './VariablePiePoint';
import type VariablePieSeriesOptions from './VariablePieSeriesOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    pie: PieSeries
} = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const {
    arrayMax,
    arrayMin,
    clamp,
    extend,
    fireEvent,
    merge,
    pick
} = U;
import VariablePieSeriesDefaults from './VariablePieSeriesDefaults.js';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        maxPxSize?: number;
        minPxSize?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * The variablepie series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.variablepie
 *
 * @augments Highcharts.Series
 */
class VariablePieSeries extends PieSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: VariablePieSeriesOptions = merge(
        PieSeries.defaultOptions,
        VariablePieSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<VariablePiePoint> = void 0 as any;

    public options: VariablePieSeriesOptions = void 0 as any;

    public points: Array<VariablePiePoint> = void 0 as any;

    public radii: Array<number> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Before standard translate method for pie chart it is needed to calculate
     * min/max radius of each pie slice based on its Z value.
     * @private
     */
    calculateExtremes(): void {
        const series = this,
            chart = series.chart,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            seriesOptions = series.options,
            slicingRoom = 2 * (seriesOptions.slicedOffset || 0),
            zData: Array<number> = series.zData as any,
            smallestSize = Math.min(plotWidth, plotHeight) - slicingRoom,
            // Min and max size of pie slice:
            extremes: Record<string, number> = {},
            // In pie charts size of a pie is changed to make space for
            // dataLabels, then series.center is changing.
            positions = series.center || series.getCenter();

        let zMin: (number|undefined),
            zMax: (number|undefined);

        for (const prop of ['minPointSize', 'maxPointSize']) {
            let length: (number|string) = (seriesOptions as any)[prop];

            const isPercent = /%$/.test(length as any);

            length = parseInt(length as any, 10);
            extremes[prop] = isPercent ?
                smallestSize * length / 100 :
                length * 2; // Because it should be radius, not diameter.
        }

        series.minPxSize = positions[3] + extremes.minPointSize;
        series.maxPxSize = clamp(
            positions[2],
            positions[3] + extremes.minPointSize,
            extremes.maxPointSize
        );

        if (zData.length) {
            zMin = pick(
                seriesOptions.zMin,
                arrayMin(zData.filter(series.zValEval))
            );
            zMax = pick(
                seriesOptions.zMax,
                arrayMax(zData.filter(series.zValEval))
            );
            this.getRadii(zMin, zMax, series.minPxSize, series.maxPxSize);
        }
    }

    /**
     * Finding radius of series points based on their Z value and min/max Z
     * value for all series.
     *
     * @private
     * @function Highcharts.Series#getRadii
     *
     * @param {number} zMin
     * Min threshold for Z value. If point's Z value is smaller that zMin, point
     * will have the smallest possible radius.
     *
     * @param {number} zMax
     * Max threshold for Z value. If point's Z value is bigger that zMax, point
     * will have the biggest possible radius.
     *
     * @param {number} minSize
     * Minimal pixel size possible for radius.
     *
     * @param {numbner} maxSize
     * Minimal pixel size possible for radius.
     */
    public getRadii(
        zMin: number,
        zMax: number,
        minSize: number,
        maxSize: number
    ): void {
        const zData: Array<number> = this.zData as any,
            radii: Array<number> = [],
            options = this.options,
            sizeByArea = options.sizeBy !== 'radius',
            zRange = zMax - zMin;

        let pos: (number|undefined),
            value: (number|null|undefined),
            radius: (number|undefined);


        // Calculate radius for all pie slice's based on their Z values
        for (let i = 0; i < zData.length; i++) {
            // if zData[i] is null/undefined/string we need to take zMin for
            // smallest radius.
            value = this.zValEval(zData[i]) ? zData[i] : zMin;

            if (value <= zMin) {
                radius = minSize / 2;
            } else if (value >= zMax) {
                radius = maxSize / 2;
            } else {
                // Relative size, a number between 0 and 1
                pos = zRange > 0 ? (value - zMin) / zRange : 0.5;

                if (sizeByArea) {
                    pos = Math.sqrt(pos);
                }

                radius = Math.ceil(minSize + pos * (maxSize - minSize)) / 2;
            }
            radii.push(radius);
        }
        this.radii = radii;
    }


    /**
     * It is needed to null series.center on chart redraw. Probably good idea
     * will be to add this option in directly in pie series.
     * @private
     */
    public redraw(): void {
        this.center = null as any;
        super.redraw();
    }

    /** @private */
    getDataLabelPosition(
        point: VariablePiePoint,
        distance: number
    ): DataLabel.LabelPositionObject {
        const { center, options } = this,
            angle = point.angle || 0,
            r = this.radii[point.index],
            x = center[0] + Math.cos(angle) * r,
            y = center[1] + Math.sin(angle) * r,
            connectorOffset = (options.slicedOffset || 0) +
                (options.borderWidth || 0),
            // Set the anchor point for data labels. Use point.labelDistance
            // instead of labelDistance // #1174
            // finalConnectorOffset - not override connectorOffset value.
            finalConnectorOffset = Math.min(
                connectorOffset,
                distance / 5
            ); // #1678

        return {
            distance,
            natural: {
                // Initial position of the data label - it's utilized for
                // finding the final position for the label
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance
            },
            computed: {
                // Used for generating connector path - initialized later in
                // drawDataLabels function x: undefined, y: undefined
            },
            // Left - pie on the left side of the data label
            // Right - pie on the right side of the data label
            alignment: point.half ? 'right' : 'left',
            connectorPosition: {
                breakAt: { // Used in connectorShapes.fixedOffset
                    x: x + Math.cos(angle) * finalConnectorOffset,
                    y: y + Math.sin(angle) * finalConnectorOffset
                },
                touchingSliceAt: { // Middle of the arc
                    x,
                    y
                }
            }
        };
    }

    /**
     * Extend translate by updating radius for each pie slice instead of using
     * one global radius.
     * @private
     */
    public translate(positions?: Array<number>): void {

        this.generatePoints();

        const series = this,
            precision = 1000, // issue #172
            options = series.options,
            slicedOffset: number = options.slicedOffset as any,
            startAngle = options.startAngle || 0,
            startAngleRad = Math.PI / 180 * (startAngle - 90),
            endAngleRad = Math.PI / 180 * (pick(
                options.endAngle,
                startAngle + 360
            ) - 90),
            circ = endAngleRad - startAngleRad, // 2 * Math.PI,
            points = series.points,
            ignoreHiddenPoint = options.ignoreHiddenPoint;

        let cumulative = 0,
            start,
            end,
            angle,
            // the x component of the radius vector for a given point
            radiusX: (number|undefined),
            radiusY: (number|undefined),
            point: (VariablePiePoint|undefined),
            pointRadii;

        series.startAngleRad = startAngleRad;
        series.endAngleRad = endAngleRad;
        // Use calculateExtremes to get series.radii array.
        series.calculateExtremes();

        // Get positions - either an integer or a percentage string must be
        // given. If positions are passed as a parameter, we're in a
        // recursive loop for adjusting space for data labels.
        if (!positions) {
            series.center = positions = series.getCenter();
        }

        // Calculate the geometry for each point
        for (let i = 0; i < points.length; i++) {

            point = points[i];
            pointRadii = series.radii[i];

            // Set start and end angle
            start = startAngleRad + (cumulative * circ);
            if (!ignoreHiddenPoint || point.visible) {
                cumulative += (point.percentage as any) / 100;
            }
            end = startAngleRad + (cumulative * circ);

            // Set the shape
            point.shapeType = 'arc';
            point.shapeArgs = {
                x: positions[0],
                y: positions[1],
                r: pointRadii,
                innerR: positions[3] / 2,
                start: Math.round(start * precision) / precision,
                end: Math.round(end * precision) / precision
            };

            // The angle must stay within -90 and 270 (#2645)
            angle = (end + start) / 2;
            if (angle > 1.5 * Math.PI) {
                angle -= 2 * Math.PI;
            } else if (angle < -Math.PI / 2) {
                angle += 2 * Math.PI;
            }

            // Center for the sliced out slice
            point.slicedTranslation = {
                translateX: Math.round(Math.cos(angle) * slicedOffset),
                translateY: Math.round(Math.sin(angle) * slicedOffset)
            };

            // Set the anchor point for tooltips
            radiusX = Math.cos(angle) * positions[2] / 2;
            radiusY = Math.sin(angle) * positions[2] / 2;
            point.tooltipPos = [
                positions[0] + radiusX * 0.7,
                positions[1] + radiusY * 0.7
            ];

            point.half = angle < -Math.PI / 2 || angle > Math.PI / 2 ?
                1 :
                0;
            point.angle = angle;

        }

        fireEvent(series, 'afterTranslate');
    }

    /**
     * For arrayMin and arrayMax calculations array shouldn't have
     * null/undefined/string values. In this case it is needed to check if
     * points Z value is a Number.
     * @private
     */
    public zValEval(zVal: (number|string|undefined)): (boolean|null) {
        if (typeof zVal === 'number' && !isNaN(zVal)) {
            return true;
        }
        return null;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface VariablePieSeries {
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof VariablePiePoint;
}

extend(VariablePieSeries.prototype, {
    pointArrayMap: ['y', 'z'],
    parallelArrays: ['x', 'y', 'z']
});


/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        variablepie: typeof VariablePieSeries;
    }
}

SeriesRegistry.registerSeriesType('variablepie', VariablePieSeries);

/* *
 *
 *  Default Export
 *
 * */

export default VariablePieSeries;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @typedef {"area"|"radius"} Highcharts.VariablePieSizeByValue
 */

''; // adds doclets above to transpiled file
