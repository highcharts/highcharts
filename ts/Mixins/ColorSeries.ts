/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from '../Core/Series/Point';
import H from '../Core/Globals.js';

declare global {
    namespace Highcharts {
        interface ColorPoint extends Point {
            series: ColorSeries;
            value?: (number|null);
            setVisible(vis?: boolean): void;
        }
        interface ColorPointMixin {
            setVisible: ColorPoint['setVisible'];
        }
        interface ColorSeries extends Series {
            colorAxis: ColorAxis;
            data: Array<ColorPoint>;
            points: Array<ColorPoint>;
            options: ColorSeriesOptions;
            optionalAxis?: string;
            translateColors(): void;
        }
        interface ColorSeriesMixin {
            colorAxis: number;
            optionalAxis: ColorSeries['optionalAxis'];
            translateColors: ColorSeries['translateColors'];
        }
        interface ColorSeriesOptions extends SeriesOptions {
            nullColor?: (ColorString|GradientColorObject|PatternObject);
        }
        let colorPointMixin: ColorPointMixin;
        let colorSeriesMixin: ColorSeriesMixin;
    }
}

/**
 * Mixin for maps and heatmaps
 *
 * @private
 * @mixin Highcharts.colorPointMixin
 */
H.colorPointMixin = {

    /* eslint-disable valid-jsdoc */

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

        point.visible = point.options.visible = Boolean(vis);

        // Show and hide associated elements
        ['graphic', 'dataLabel'].forEach(function (key: string): void {
            if ((point as any)[key]) {
                (point as any)[key][method]();
            }
        });
        this.series.buildKDTree(); // rebuild kdtree #13195
    }

    /* eslint-enable valid-jsdoc */
};

/**
 * @private
 * @mixin Highcharts.colorSeriesMixin
 */
H.colorSeriesMixin = {
    optionalAxis: 'colorAxis',
    colorAxis: 0,

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
            points = this.data.length ? this.data : this.points,
            nullColor = this.options.nullColor,
            colorAxis = this.colorAxis,
            colorKey = this.colorKey;

        points.forEach(function (point: Highcharts.ColorPoint): void {
            var value = point.getNestedProperty(colorKey) as number,
                color;

            color = point.options.color ||
                (
                    point.isNull || point.value === null ?
                        nullColor :
                        (colorAxis && typeof value !== 'undefined') ?
                            colorAxis.toColor(value, point) :
                            point.color || series.color
                );

            if (color && point.color !== color) {
                point.color = color;

                if (series.options.legendType === 'point' && point.legendItem) {
                    series.chart.legend.colorizeItem(point, point.visible);
                }
            }
        });
    }

    /* eslint-enable valid-jsdoc */

};
