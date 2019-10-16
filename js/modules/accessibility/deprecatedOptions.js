/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Default options for accessibility.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../parts/Globals.js';
import U from '../../parts/Utilities.js';
var pick = U.pick;

var error = H.error;

// Warn user that a deprecated option was used
function warn(chart, oldOption, newOption) {
    error(
        'Highcharts: Deprecated option ' + oldOption +
        ' used. Use ' + newOption + ' instead.', false, chart
    );
}

// Set a new option on a root prop, where the option is defined as
// an array of suboptions.
function traverseSetOption(root, optionAsArray, val) {
    var opt = root,
        prop,
        i = 0;
    for (;i < optionAsArray.length - 1; ++i) {
        prop = optionAsArray[i];
        opt = opt[prop] = pick(opt[prop], {});
    }
    opt[optionAsArray[optionAsArray.length - 1]] = val;
}

function copyDeprecatedChartOptions(chart) {
    var chartOptions = chart.options.chart || {},
        a11yOptions = chart.options.accessibility || {};
    ['description', 'typeDescription'].forEach(function (prop) {
        if (chartOptions[prop]) {
            a11yOptions[prop] = chartOptions[prop];
            warn(chart, 'chart.' + prop, 'accessibility.' + prop);
        }
    });
}

function copyDeprecatedAxisOptions(chart) {
    chart.axes.forEach(function (axis) {
        var opts = axis.options;
        if (opts && opts.description) {
            opts.accessibility = opts.accessibility || {};
            opts.accessibility.description = opts.description;
            warn(chart, 'axis.description', 'axis.accessibility.description');
        }
    });
}

function copyDeprecatedSeriesOptions(chart) {
    // Map of deprecated series options. New options are defined as
    // arrays of paths under series.options.
    var oldToNewSeriesOptions = {
        description: ['accessibility', 'description'],
        exposeElementToA11y: ['accessibility', 'exposeAsGroupOnly'],
        pointDescriptionFormatter: [
            'accessibility', 'pointDescriptionFormatter'
        ],
        skipKeyboardNavigation: [
            'accessibility', 'keyboardNavigation', 'enabled'
        ]
    };
    chart.series.forEach(function (series) {
        // Handle series wide options
        Object.keys(oldToNewSeriesOptions).forEach(function (oldOption) {
            var optionVal = series.options[oldOption];
            if (optionVal !== undefined) {
                // Set the new option
                traverseSetOption(
                    series.options,
                    oldToNewSeriesOptions[oldOption],
                    // Note that skipKeyboardNavigation has inverted option
                    // value, since we set enabled rather than disabled
                    oldOption === 'skipKeyboardNavigation' ?
                        !optionVal : optionVal
                );
                warn(
                    chart,
                    'series.' + oldOption, 'series.' +
                    oldToNewSeriesOptions[oldOption].join('.')
                );
            }
        });

        // Loop through the points and handle point.description
        if (series.points) {
            series.points.forEach(function (point) {
                if (point.options && point.options.description) {
                    point.options.accessibility =
                        point.options.accessibility || {};
                    point.options.accessibility.description =
                        point.options.description;
                    warn(chart, 'point.description',
                        'point.accessibility.description');
                }
            });
        }
    });
}

/**
 * Copy options that are deprecated over to new options. Logs warnings to
 * console for deprecated options used. The following options are
 * deprecated:
 *
 *  chart.description -> accessibility.description
 *  chart.typeDescription -> accessibility.typeDescription
 *  series.description -> series.accessibility.description
 *  series.exposeElementToA11y -> series.accessibility.exposeAsGroupOnly
 *  series.pointDescriptionFormatter ->
 *      series.accessibility.pointDescriptionFormatter
 *  series.skipKeyboardNavigation ->
 *      series.accessibility.keyboardNavigation.enabled
 *  point.description -> point.accessibility.description
 *  axis.description -> axis.accessibility.description
 *
 * @private
 */
function copyDeprecatedOptions(chart) {
    copyDeprecatedChartOptions(chart);
    copyDeprecatedAxisOptions(chart);
    if (chart.series) {
        copyDeprecatedSeriesOptions(chart);
    }
}

export default copyDeprecatedOptions;
