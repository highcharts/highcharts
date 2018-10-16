/**
 * Plugin for displaying a message when there is no data visible in chart.
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Series.js';
import '../parts/Options.js';

var seriesTypes = H.seriesTypes,
    chartPrototype = H.Chart.prototype,
    defaultOptions = H.getOptions(),
    extend = H.extend,
    each = H.each;

// Add language option
extend(defaultOptions.lang, {
    /**
     * The text to display when the chart contains no data. Requires the
     * no-data module, see [noData](#noData).
     *
     * @type {String}
     * @default No data to display
     * @since 3.0.8
     * @product highcharts highstock
     * @sample highcharts/no-data-to-display/no-data-line
     *         No-data text
     * @apioption lang.noData
     */
    noData: 'No data to display'
});

// Add default display options for message
/**
 * Options for displaying a message like "No data to display".
 * This feature requires the file no-data-to-display.js to be loaded in the
 * page. The actual text to display is set in the lang.noData option.
 * @type {Object}
 *
 * @sample highcharts/no-data-to-display/no-data-line
 *         Line chart with no-data module
 * @sample highcharts/no-data-to-display/no-data-pie
 *         Pie chart with no-data module
 * @optionparent noData
 */
defaultOptions.noData = {

    /**
     * An object of additional SVG attributes for the no-data label.
     *
     * @type {Object}
     * @since 3.0.8
     * @product highcharts highstock gantt
     * @apioption noData.attr
     */

    /**
     * Whether to insert the label as HTML, or as pseudo-HTML rendered with
     * SVG.
     *
     * @type {Boolean}
     * @default false
     * @since 4.1.10
     * @product highcharts highstock gantt
     * @apioption noData.useHTML
     */

    /**
     * The position of the no-data label, relative to the plot area.
     *
     * @type {Object}
     * @default { "x": 0, "y": 0, "align": "center", "verticalAlign": "middle" }
     * @since 3.0.8
     */
    position: {

        /**
         * Horizontal offset of the label, in pixels.
         *
         * @type {Number}
         * @default 0
         * @product highcharts highstock gantt
         */
        x: 0,

        /**
         * Vertical offset of the label, in pixels.
         *
         * @type {Number}
         * @default 0
         * @product highcharts highstock gantt
         */
        y: 0,

        /**
         * Horizontal alignment of the label.
         *
         * @validvalue ["left", "center", "right"]
         * @type {String}
         * @default center
         */
        align: 'center',

        /**
         * Vertical alignment of the label.
         *
         * @validvalue ["top", "middle", "bottom"]
         * @type {String}
         * @default middle
         * @product highcharts highstock gantt
         */
        verticalAlign: 'middle'
    }
};

/*= if (build.classic) { =*/
// Presentational
/**
 * CSS styles for the no-data label.
 *
 * @sample highcharts/no-data-to-display/no-data-line
 *         Styled no-data text
 * @optionparent noData.style
 */
defaultOptions.noData.style = {
    fontWeight: 'bold',
    fontSize: '12px',
    color: '${palette.neutralColor60}'
};
/*= } =*/


// Define hasData function for non-cartesian seris. Returns true if the series
// has points at all.
each([
    'bubble',
    'gauge',
    'heatmap',
    'pie',
    'sankey',
    'treemap',
    'waterfall'
], function (type) {
    if (seriesTypes[type]) {
        seriesTypes[type].prototype.hasData = function () {
            return !!this.points.length; // != 0
        };
    }
});

/**
 * Define hasData functions for series. These return true if there are data
 * points on this series within the plot area.
 */
H.Series.prototype.hasData = function () {
    return (
        this.visible &&
        this.dataMax !== undefined &&
        this.dataMin !== undefined // #3703
    );
};

/**
 * Display a no-data message.
 *
 * @param {String} str An optional message to show in place of the default one
 */
chartPrototype.showNoData = function (str) {
    var chart = this,
        options = chart.options,
        text = str || (options && options.lang.noData),
        noDataOptions = options && options.noData;

    if (!chart.noDataLabel && chart.renderer) {
        chart.noDataLabel = chart.renderer
            .label(
                text,
                0,
                0,
                null,
                null,
                null,
                noDataOptions.useHTML,
                null,
                'no-data'
            );

        /*= if (build.classic) { =*/
        chart.noDataLabel
            .attr(noDataOptions.attr)
            .css(noDataOptions.style);
        /*= } =*/

        chart.noDataLabel.add();

        chart.noDataLabel.align(
            extend(chart.noDataLabel.getBBox(), noDataOptions.position),
            false,
            'plotBox'
        );
    }
};

/**
 * Hide no-data message
 */
chartPrototype.hideNoData = function () {
    var chart = this;
    if (chart.noDataLabel) {
        chart.noDataLabel = chart.noDataLabel.destroy();
    }
};

/**
 * Returns true if there are data points within the plot area now
 */
chartPrototype.hasData = function () {
    var chart = this,
        series = chart.series || [],
        i = series.length;

    while (i--) {
        if (series[i].hasData() && !series[i].options.isInternal) {
            return true;
        }
    }

    return chart.loadingShown; // #4588
};

/**
 * Add event listener to handle automatic show or hide no-data message
 */
H.addEvent(H.Chart, 'render', function handleNoData() {
    if (this.hasData()) {
        this.hideNoData();
    } else {
        this.showNoData();
    }
});
