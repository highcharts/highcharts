/**
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 *
 * Highcharts feature to make the Y axis stay fixed when scrolling the chart
 * horizontally on mobile devices. Supports left and right side axes.
 */

'use strict';

import H from './Globals.js';

var addEvent = H.addEvent,
    Chart = H.Chart;

/**
 * Options for a scrollable plot area. This feature provides a minimum width for
 * the plot area of the chart. If the width gets smaller than this, typically
 * on mobile devices, a native browser scrollbar is presented below the chart.
 * This scrollbar provides smooth scrolling for the contents of the plot area,
 * whereas the title, legend and axes are fixed.
 *
 * @sample {highcharts} highcharts/chart/scrollable-plotarea
 *         Scrollable plot area
 *
 * @since     6.1.0
 * @product   highcharts gantt
 * @apioption chart.scrollablePlotArea
 */

/**
 * The minimum width for the plot area. If it gets smaller than this, the plot
 * area will become scrollable.
 *
 * @type      {number}
 * @apioption chart.scrollablePlotArea.minWidth
 */

/**
 * The initial scrolling position of the scrollable plot area. Ranges from 0 to
 * 1, where 0 aligns the plot area to the left and 1 aligns it to the right.
 * Typically we would use 1 if the chart has right aligned Y axes.
 *
 * @type      {number}
 * @apioption chart.scrollablePlotArea.scrollPositionX
 */

addEvent(Chart, 'afterSetChartSize', function (e) {

    var scrollablePlotArea = this.options.chart.scrollablePlotArea,
        scrollableMinWidth =
            scrollablePlotArea && scrollablePlotArea.minWidth,
        scrollablePixels;

    if (scrollableMinWidth && !this.renderer.forExport) {

        // The amount of pixels to scroll, the difference between chart
        // width and scrollable width
        this.scrollablePixels = scrollablePixels = Math.max(
            0,
            scrollableMinWidth - this.chartWidth
        );

        if (scrollablePixels) {
            this.plotWidth += scrollablePixels;
            this.clipBox.width += scrollablePixels;

            if (!e.skipAxes) {
                this.axes.forEach(function (axis) {
                    if (axis.side === 1) {
                        // Get the plot lines right in getPlotLinePath,
                        // temporarily set it to the adjusted plot width.
                        axis.getPlotLinePath = function () {
                            var right = this.right,
                                path;

                            this.right = right - axis.chart.scrollablePixels;
                            path = H.Axis.prototype.getPlotLinePath.apply(
                                this,
                                arguments
                            );
                            this.right = right;
                            return path;
                        };

                    } else {
                        // Apply the corrected plotWidth
                        axis.setAxisSize();
                        axis.setAxisTranslation();
                    }
                });
            }
        }
    }
});

addEvent(Chart, 'render', function () {
    if (this.scrollablePixels) {
        if (this.setUpScrolling) {
            this.setUpScrolling();
        }
        this.applyFixed();

    } else if (this.fixedDiv) { // Has been in scrollable mode
        this.applyFixed();
    }
});

/**
 * @private
 * @function Highcharts.Chart#setUpScrolling
 */
Chart.prototype.setUpScrolling = function () {

    // Add the necessary divs to provide scrolling
    this.scrollingContainer = H.createElement('div', {
        'className': 'highcharts-scrolling'
    }, {
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
    }, this.renderTo);

    this.innerContainer = H.createElement('div', {
        'className': 'highcharts-inner-container'
    }, null, this.scrollingContainer);

    // Now move the container inside
    this.innerContainer.appendChild(this.container);

    // Don't run again
    this.setUpScrolling = null;
};

/**
 * @private
 * @function Highcharts.Chart#applyFixed
 */
Chart.prototype.applyFixed = function () {
    var container = this.container,
        fixedRenderer,
        scrollableWidth,
        firstTime = !this.fixedDiv;

    // First render
    if (firstTime) {

        this.fixedDiv = H.createElement(
            'div',
            {
                className: 'highcharts-fixed'
            },
            {
                position: 'absolute',
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 2
            },
            null,
            true
        );
        this.renderTo.insertBefore(
            this.fixedDiv,
            this.renderTo.firstChild
        );
        this.renderTo.style.overflow = 'visible';

        this.fixedRenderer = fixedRenderer = new H.Renderer(
            this.fixedDiv,
            0,
            0
        );

        // Mask
        this.scrollableMask = fixedRenderer.path()
            .attr({
                fill: H.color(
                    this.options.chart.backgroundColor || '#fff'
                ).setOpacity(0.85).get(),
                zIndex: -1
            })
            .addClass('highcharts-scrollable-mask')
            .add();

        // These elements are moved over to the fixed renderer and stay fixed
        // when the user scrolls the chart.
        ([
            this.inverted ?
                '.highcharts-xaxis' :
                '.highcharts-yaxis',
            this.inverted ?
                '.highcharts-xaxis-labels' :
                '.highcharts-yaxis-labels',
            '.highcharts-contextbutton',
            '.highcharts-credits',
            '.highcharts-legend',
            '.highcharts-subtitle',
            '.highcharts-title',
            '.highcharts-legend-checkbox'
        ]).forEach(function (className) {
            [].forEach.call(
                container.querySelectorAll(className),
                function (elem) {
                    (
                        elem.namespaceURI === fixedRenderer.SVG_NS ?
                            fixedRenderer.box :
                            fixedRenderer.box.parentNode
                    ).appendChild(elem);
                    elem.style.pointerEvents = 'auto';
                }
            );
        });
    }

    // Set the size of the fixed renderer to the visible width
    this.fixedRenderer.setSize(
        this.chartWidth,
        this.chartHeight
    );

    // Increase the size of the scrollable renderer and background
    scrollableWidth = this.chartWidth + this.scrollablePixels;
    H.stop(this.container);
    this.container.style.width = scrollableWidth + 'px';
    this.renderer.boxWrapper.attr({
        width: scrollableWidth,
        height: this.chartHeight,
        viewBox: [0, 0, scrollableWidth, this.chartHeight].join(' ')
    });
    this.chartBackground.attr({ width: scrollableWidth });

    // Set scroll position
    if (firstTime) {
        var options = this.options.chart.scrollablePlotArea;

        if (options.scrollPositionX) {
            this.scrollingContainer.scrollLeft =
                this.scrollablePixels * options.scrollPositionX;
        }
    }

    // Mask behind the left and right side
    var axisOffset = this.axisOffset,
        maskTop = this.plotTop - axisOffset[0] - 1,
        maskBottom = this.plotTop + this.plotHeight + axisOffset[2],
        maskPlotRight = this.plotLeft + this.plotWidth -
            this.scrollablePixels;

    this.scrollableMask.attr({
        d: this.scrollablePixels ? [
            // Left side
            'M', 0, maskTop,
            'L', this.plotLeft - 1, maskTop,
            'L', this.plotLeft - 1, maskBottom,
            'L', 0, maskBottom,
            'Z',

            // Right side
            'M', maskPlotRight, maskTop,
            'L', this.chartWidth, maskTop,
            'L', this.chartWidth, maskBottom,
            'L', maskPlotRight, maskBottom,
            'Z'
        ] : ['M', 0, 0]
    });
};
