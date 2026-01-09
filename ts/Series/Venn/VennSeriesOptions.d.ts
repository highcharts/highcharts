/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorString from '../../Core/Color/ColorString';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type {
    LegendSymbolType,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type VennPointOptions from './VennPointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A Venn diagram displays all possible logical relations between a
 * collection of different sets. The sets are represented by circles, and
 * the relation between the sets are displayed by the overlap or lack of
 * overlap between them. The venn diagram is a special case of Euler
 * diagrams, which can also be displayed by this series type.
 *
 * A `venn` series. If the [type](#series.venn.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/venn-diagram/
 *         Venn diagram
 *
 * @sample {highcharts} highcharts/demo/euler-diagram/
 *         Euler diagram
 *
 * @sample {highcharts} highcharts/series-venn/point-legend/
 *         Venn diagram with a legend
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.venn
 *
 * @excluding connectEnds, connectNulls, cropThreshold, dragDrop,
 *            findNearestPointBy, getExtremesFromAll, jitter, label,
 *            linecap, lineWidth, linkedTo, marker, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement,
 *            pointStart, softThreshold, stacking, steps, threshold,
 *            xAxis, yAxis, zoneAxis, zones, dataSorting, boostThreshold,
 *            boostBlending
 *
 * @excluding connectEnds, connectNulls, cropThreshold, dataParser, dataURL,
 *            findNearestPointBy, getExtremesFromAll, label, linecap, lineWidth,
 *            linkedTo, marker, negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking, steps,
 *            threshold, xAxis, yAxis, zoneAxis, zones, dataSorting,
 *            boostThreshold, boostBlending
 *
 * @product highcharts
 *
 * @requires modules/venn
 */
export interface VennSeriesOptions extends ScatterSeriesOptions {

    borderColor?: ColorString;

    borderDashStyle?: DashStyleValue;

    borderWidth?: number;

    brighten?: number;

    brightness?: number;

    clip?: boolean;

    colorByPoint?: boolean;

    /**
     *
     * @type {Array<*>}
     *
     * @extends series.scatter.data
     *
     * @excluding marker, x, y
     *
     * @product highcharts
     */
    data?: Array<VennPointOptions>;

    dataLabels?: Partial<DataLabelOptions>;

    /**
     *
     * @default true
     *
     * @extends plotOptions.series.inactiveOtherPoints
     */
    inactiveOtherPoints?: boolean;

    legendSymbol?: LegendSymbolType;

    /**
     * @ignore-option
     */
    legendType?: ('point'|'series');

    /**
     * @ignore-option
     */
    marker?: PointMarkerOptions;

    opacity?: number;

    showInLegend?: boolean;

    states?: SeriesStatesOptions<VennSeriesOptions>;

    /**
     * @excluding halo
     *
     * @apioption series.venn.states.select
     */

    /**
     * @excluding halo
     *
     * @apioption series.venn.states.hover
     */

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default VennSeriesOptions;
