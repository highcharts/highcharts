/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type AreaRangePoint from '../../Series/AreaRange/AreaRangePoint';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type ColumnSeries from './ColumnSeries';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { series: Series } = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    merge,
    pick
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace ColumnDataLabel {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Override the basic data label alignment by adjusting for the position of
     * the column.
     * @private
     */
    function alignDataLabel(
        this: ColumnSeries,
        point: Point,
        dataLabel: SVGElement,
        options: DataLabelOptions,
        alignTo: BBoxObject,
        isNew?: boolean
    ): void {
        let inverted = this.chart.inverted,
            series = point.series,
            // data label box for alignment
            dlBox = point.dlBox || point.shapeArgs,
            below = pick(
                (point as AreaRangePoint).below, // range series
                (point.plotY as any) >
                    pick(this.translatedThreshold, series.yAxis.len)
            ),
            // draw it inside the box?
            inside = pick(options.inside, !!this.options.stacking),
            overshoot;

        // Align to the column itself, or the top of it
        if (dlBox) { // Area range uses this method but not alignTo
            alignTo = merge(dlBox) as any;
            if (alignTo.y < 0) {
                alignTo.height += alignTo.y;
                alignTo.y = 0;
            }

            // If parts of the box overshoots outside the plot area, modify the
            // box to center the label inside
            overshoot = alignTo.y + alignTo.height - series.yAxis.len;
            if (overshoot > 0 && overshoot < alignTo.height) {
                alignTo.height -= overshoot;
            }

            if (inverted) {
                alignTo = {
                    x: series.yAxis.len - alignTo.y - alignTo.height,
                    y: series.xAxis.len - alignTo.x - alignTo.width,
                    width: alignTo.height,
                    height: alignTo.width
                };
            }

            // Compute the alignment box
            if (!inside) {
                if (inverted) {
                    alignTo.x += below ? 0 : alignTo.width;
                    alignTo.width = 0;
                } else {
                    alignTo.y += below ? alignTo.height : 0;
                    alignTo.height = 0;
                }
            }
        }


        // When alignment is undefined (typically columns and bars), display the
        // individual point below or above the point depending on the threshold
        options.align = pick(
            options.align,
            !inverted || inside ? 'center' : below ? 'right' : 'left'
        );
        options.verticalAlign = pick(
            options.verticalAlign,
            inverted || inside ? 'middle' : below ? 'top' : 'bottom'
        );

        // Call the parent method
        Series.prototype.alignDataLabel.call(
            this,
            point,
            dataLabel,
            options,
            alignTo,
            isNew
        );

        // If label was justified and we have contrast, set it:
        if (options.inside && point.contrastColor) {
            dataLabel.css({
                color: point.contrastColor
            });
        }
    }

    /** @private */
    export function compose(ColumnSeriesClass: typeof ColumnSeries): void {
        ColumnSeriesClass.prototype.alignDataLabel = alignDataLabel;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnDataLabel;
