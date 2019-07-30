/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from '../parts/Globals.js';

declare global {
    namespace Highcharts {
        interface ColorPoint extends Point {
            dataLabelOnNull: boolean;
            series: ColorSeries;
            value: (number|null);
            isValid(): boolean;
            setState(state?: string): void;
            setVisible(vis?: boolean): void;
        }
        interface ColorPointMixin {
            dataLabelOnNull: ColorPoint['dataLabelOnNull'];
            isValid: ColorPoint['isValid'];
            setState: ColorPoint['setState'];
            setVisible: ColorPoint['setVisible'];
        }
        interface ColorSeries extends Series {
            axisTypes: Array<string>;
            colorAxis: ColorAxis;
            colorKey: string;
            colorProp?: string;
            data: Array<ColorPoint>;
            options: ColorSeriesOptions;
            optionalAxis: string;
            parallelArrays: Array<string>;
            pointArrayMap: Array<string>;
            pointAttribs: ColumnSeries['pointAttribs'];
            trackerGroups: Array<string>;
            colorAttribs(point: ColorPoint): SVGAttributes;
            translateColors(): void;
        }
        interface ColorSeriesMixin {
            axisTypes: ColorSeries['axisTypes'];
            colorAttribs: ColorSeries['colorAttribs'];
            colorKey: ColorSeries['colorKey'];
            getSymbol: Function;
            optionalAxis: ColorSeries['optionalAxis'];
            parallelArrays: ColorSeries['parallelArrays'];
            pointArrayMap: ColorSeries['pointArrayMap'];
            pointAttribs: ColorSeries['pointAttribs'];
            trackerGroups: ColorSeries['trackerGroups'];
            translateColors: ColorSeries['translateColors'];
        }
        interface ColorSeriesOptions extends SeriesOptions {
            nullColor?: (ColorString|GradientColorObject|PatternObject);
        }
        interface Point {
            dataLabelOnNull?: ColorPoint['dataLabelOnNull'];
        }
        let colorPointMixin: ColorPointMixin;
        let colorSeriesMixin: ColorSeriesMixin;
    }
}

import U from '../parts/Utilities.js';
var defined = U.defined;

var noop = H.noop,
    seriesTypes = H.seriesTypes;

/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorPointMixin
 */
H.colorPointMixin = {

    dataLabelOnNull: true,

    /* eslint-disable valid-jsdoc */

    /**
     * Color points have a value option that determines whether or not it is
     * a null point
     * @private
     * @function Highcharts.colorPointMixin.isValid
     * @return {boolean}
     */
    isValid: function (this: Highcharts.ColorPoint): boolean {
        // undefined is allowed
        return (
            this.value !== null &&
            this.value !== Infinity &&
            this.value !== -Infinity
        );
    },

    /**
     * Set the visibility of a single point
     * @private
     * @function Highcharts.colorPointMixin.setVisible
     * @param {boolean} visible
     * @return {void}
     */
    setVisible: function (this: Highcharts.ColorPoint, vis?: boolean): void {
        var point = this,
            method = vis ? 'show' : 'hide';

        point.visible = Boolean(vis);

        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key: string): void {
            if ((point as any)[key]) {
                (point as any)[key][method]();
            }
        });
    },
    /**
     * @private
     * @function Highcharts.colorPointMixin.setState
     * @param {string} [state]
     * @return {void}
     */
    setState: function (this: Highcharts.ColorPoint, state?: string): void {
        H.Point.prototype.setState.call(this, state);
        if (this.graphic) {
            this.graphic.attr({
                zIndex: state === 'hover' ? 1 : 0
            });
        }
    }

    /* eslint-enable valid-jsdoc */
};

/**
 * @private
 * @mixin Highcharts.colorSeriesMixin
 */
H.colorSeriesMixin = {
    pointArrayMap: ['value'],
    axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
    optionalAxis: 'colorAxis',
    trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
    getSymbol: noop,
    parallelArrays: ['x', 'y', 'value'],
    colorKey: 'value',

    pointAttribs: seriesTypes.column.prototype.pointAttribs,

    /* eslint-disable valid-jsdoc */

    /**
     * In choropleth maps, the color is a result of the value, so this needs
     * translation too
     * @private
     * @function Highcharts.colorSeriesMixin.translateColors
     * @return {void}
     */
    translateColors: function (this: Highcharts.ColorSeries): void {
        var series = this,
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;

        this.data.forEach(function (point: Highcharts.ColorPoint): void {
            var value = (point as any)[colorKey],
                color;

            color = point.options.color ||
                (
                    point.isNull ?
                        nullColor :
                        (colorAxis && value !== undefined) ?
                            colorAxis.toColor(value, point) :
                            point.color || series.color
                );

            if (color) {
                point.color = color;
            }
        });
    },

    /**
     * Get the color attibutes to apply on the graphic
     * @private
     * @function Highcharts.colorSeriesMixin.colorAttribs
     * @param {Highcharts.Point} point
     * @return {Highcharts.SVGAttributes}
     */
    colorAttribs: function (
        this: Highcharts.ColorSeries,
        point: Highcharts.ColorPoint
    ): Highcharts.SVGAttributes {
        var ret = {} as Highcharts.SVGAttributes;

        if (defined(point.color)) {
            ret[this.colorProp || 'fill'] = point.color;
        }
        return ret;
    }

    /* eslint-enable valid-jsdoc */

};
