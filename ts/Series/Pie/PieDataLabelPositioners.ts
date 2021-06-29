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

import type PiePoint from './PiePoint';
import type PieSeries from './PieSeries';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

/* *
 *
 *  Namespace
 *
 * */

namespace PieDataLabelPositioners {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Based on the value computed in Highcharts' distribute algorithm.
     * @private
     */
    export function radialDistributionY(point: PiePoint): number {
        return point.top + (point.distributeBox as any).pos;
    }

    /**
     * get the x - use the natural x position for labels near the top and
     * bottom, to prevent the top and botton slice connectors from touching each
     * other on either side.
     *
     * Based on the value computed in Highcharts' distribute algorithm.
     * @private
     */
    export function radialDistributionX(
        series: PieSeries,
        point: PiePoint,
        y: number,
        naturalY: number
    ): number {
        return series.getX(
            y < (point.top as any) + 2 || y > (point.bottom as any) - 2 ?
                naturalY :
                y,
            point.half as any,
            point
        );
    }

    /**
     * dataLabels.distance determines the x position of the label.
     * @private
     */
    export function justify(
        point: PiePoint,
        radius: number,
        seriesCenter: Array<number>
    ): number {
        return seriesCenter[0] + (point.half ? -1 : 1) *
        (radius + (point.labelDistance as any));
    }

    /**
     * Left edges of the left-half labels touch the left edge of the plot area.
     * Right edges of the right-half labels touch the right edge of the plot
     * area.
     * @private
     */
    export function alignToPlotEdges(
        dataLabel: SVGElement,
        half: boolean,
        plotWidth: number,
        plotLeft: number
    ): number {
        const dataLabelWidth = dataLabel.getBBox().width;

        return half ? dataLabelWidth + plotLeft :
            plotWidth - dataLabelWidth - plotLeft;
    }

    /**
     * Connectors of each side end in the same x position. Labels are aligned to
     * them. Left edge of the widest left-half label touches the left edge of
     * the plot area. Right edge of the widest right-half label touches the
     * right edge of the plot area.
     * @private
     */
    export function alignToConnectors(
        points: Array<PiePoint>,
        half: boolean,
        plotWidth: number,
        plotLeft: number
    ): number {
        let maxDataLabelWidth = 0,
            dataLabelWidth;

        // find widest data label
        points.forEach(function (point): void {
            dataLabelWidth = (point.dataLabel as any).getBBox().width;
            if (dataLabelWidth > maxDataLabelWidth) {
                maxDataLabelWidth = dataLabelWidth;
            }
        });
        return half ? maxDataLabelWidth + plotLeft :
            plotWidth - maxDataLabelWidth - plotLeft;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default PieDataLabelPositioners;
