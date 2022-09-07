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

import type Axis from '../../Core/Axis/Axis';
import type Series from '../../Core/Series/Series';
import type TimeTicksInfoObject from '../../Core/Axis/TimeTicksInfoObject';
import type Tooltip from '../../Core/Tooltip';

import DataGroupingAxisComposition from './DataGroupingAxisComposition.js';
import DataGroupingDefaults from './DataGroupingDefaults.js';
import F from '../../Core/FormatUtilities.js';
const { format } = F;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    extend,
    isNumber
} = U;

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function compose(
    AxisClass: typeof Axis,
    SeriesClass: typeof Series,
    TooltipClass: typeof Tooltip
): void {
    DataGroupingAxisComposition.compose(AxisClass);

    if (composedMembers.indexOf(TooltipClass) === -1) {
        composedMembers.push(TooltipClass);

        addEvent(TooltipClass, 'headerFormatter', onTooltipHeaderFormatter);
    }
}
/**
 * Extend the original method, make the tooltip's header reflect the grouped
 * range.
 * @private
 */
function onTooltipHeaderFormatter(
    this: Tooltip,
    e: AnyRecord
): void {
    const chart = this.chart,
        time = chart.time,
        labelConfig = e.labelConfig,
        series = labelConfig.series as Series,
        options = series.options,
        tooltipOptions = series.tooltipOptions,
        dataGroupingOptions = options.dataGrouping,
        xAxis = series.xAxis;

    let xDateFormat = tooltipOptions.xDateFormat,
        xDateFormatEnd,
        currentDataGrouping: (TimeTicksInfoObject|undefined),
        dateTimeLabelFormats,
        labelFormats,
        formattedKey,
        formatString = tooltipOptions[
            e.isFooter ? 'footerFormat' : 'headerFormat'
        ];

    // apply only to grouped series
    if (
        xAxis &&
        xAxis.options.type === 'datetime' &&
        dataGroupingOptions &&
        isNumber(labelConfig.key)
    ) {

        // set variables
        currentDataGrouping = series.currentDataGrouping;
        dateTimeLabelFormats = dataGroupingOptions.dateTimeLabelFormats ||
            // Fallback to commonOptions (#9693)
            DataGroupingDefaults.common.dateTimeLabelFormats;

        // if we have grouped data, use the grouping information to get the
        // right format
        if (currentDataGrouping) {
            labelFormats =
                dateTimeLabelFormats[(currentDataGrouping as any).unitName];
            if ((currentDataGrouping as any).count === 1) {
                xDateFormat = labelFormats[0];
            } else {
                xDateFormat = labelFormats[1];
                xDateFormatEnd = labelFormats[2];
            }
        // if not grouped, and we don't have set the xDateFormat option, get the
        // best fit, so if the least distance between points is one minute, show
        // it, but if the least distance is one day, skip hours and minutes etc.
        } else if (!xDateFormat && dateTimeLabelFormats && xAxis.dateTime) {
            xDateFormat = xAxis.dateTime.getXDateFormat(
                labelConfig.x,
                tooltipOptions.dateTimeLabelFormats

            );
        }

        // now format the key
        formattedKey = time.dateFormat(xDateFormat as any, labelConfig.key);
        if (xDateFormatEnd) {
            formattedKey += time.dateFormat(
                xDateFormatEnd,
                labelConfig.key + (currentDataGrouping as any).totalRange - 1
            );
        }

        // Replace default header style with class name
        if (series.chart.styledMode) {
            formatString = this.styledModeFormat(formatString);
        }

        // return the replaced format
        e.text = format(
            formatString, {
                point: extend(labelConfig.point, { key: formattedKey }),
                series: series
            },
            chart
        );

        e.preventDefault();

    }
}

/* *
 *
 *  Default Export
 *
 * */

const DataGroupingComposition = {
    compose
};

export default DataGroupingComposition;
