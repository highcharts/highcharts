/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Highcharts feature to make the Y axis stay fixed when scrolling the chart
 *  horizontally on mobile devices. Supports left and right side axes.
 */
/*
WIP on vertical scrollable plot area (#9378). To do:
- Bottom axis positioning
- Test with Gantt
- Look for size optimizing the code
- API and demos
 */
'use strict';
import A from '../Core/Animation/AnimationUtilities.js';
var stop = A.stop;
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, createElement = U.createElement, pick = U.pick;
/**
 * Options for a scrollable plot area. This feature provides a minimum size for
 * the plot area of the chart. If the size gets smaller than this, typically
 * on mobile devices, a native browser scrollbar is presented. This scrollbar
 * provides smooth scrolling for the contents of the plot area, whereas the
 * title, legend and unaffected axes are fixed.
 *
 * Since v7.1.2, a scrollable plot area can be defined for either horizontal or
 * vertical scrolling, depending on whether the `minWidth` or `minHeight`
 * option is set.
 *
 * @sample highcharts/chart/scrollable-plotarea
 *         Scrollable plot area
 * @sample highcharts/chart/scrollable-plotarea-vertical
 *         Vertically scrollable plot area
 * @sample {gantt} highcharts/chart/scrollable-plotarea-vertical
 *         Gantt chart with vertically scrollable plot area
 *
 * @since     6.1.0
 * @product   highcharts gantt
 * @apioption chart.scrollablePlotArea
 */
/**
 * The minimum height for the plot area. If it gets smaller than this, the plot
 * area will become scrollable.
 *
 * @type      {number}
 * @apioption chart.scrollablePlotArea.minHeight
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
/**
 * The initial scrolling position of the scrollable plot area. Ranges from 0 to
 * 1, where 0 aligns the plot area to the top and 1 aligns it to the bottom.
 *
 * @type      {number}
 * @apioption chart.scrollablePlotArea.scrollPositionY
 */
/**
 * The opacity of mask applied on one of the sides of the plot
 * area.
 *
 * @sample {highcharts} highcharts/chart/scrollable-plotarea-opacity
 *         Disabled opacity for the mask
 *
 * @type        {number}
 * @default     0.85
 * @since       7.1.1
 * @apioption   chart.scrollablePlotArea.opacity
 */
''; // detach API doclets
/* eslint-disable no-invalid-this, valid-jsdoc */
addEvent(Chart, 'afterSetChartSize', function (e) {
    var scrollablePlotArea = this.options.chart.scrollablePlotArea, scrollableMinWidth = scrollablePlotArea && scrollablePlotArea.minWidth, scrollableMinHeight = scrollablePlotArea && scrollablePlotArea.minHeight, scrollablePixelsX, scrollablePixelsY, corrections;
    if (!this.renderer.forExport) {
        // The amount of pixels to scroll, the difference between chart
        // width and scrollable width
        if (scrollableMinWidth) {
            this.scrollablePixelsX = scrollablePixelsX = Math.max(0, scrollableMinWidth - this.chartWidth);
            if (scrollablePixelsX) {
                this.plotWidth += scrollablePixelsX;
                if (this.inverted) {
                    this.clipBox.height += scrollablePixelsX;
                    this.plotBox.height += scrollablePixelsX;
                }
                else {
                    this.clipBox.width += scrollablePixelsX;
                    this.plotBox.width += scrollablePixelsX;
                }
                corrections = {
                    // Corrections for right side
                    1: { name: 'right', value: scrollablePixelsX }
                };
            }
            // Currently we can only do either X or Y
        }
        else if (scrollableMinHeight) {
            this.scrollablePixelsY = scrollablePixelsY = Math.max(0, scrollableMinHeight - this.chartHeight);
            if (scrollablePixelsY) {
                this.plotHeight += scrollablePixelsY;
                if (this.inverted) {
                    this.clipBox.width += scrollablePixelsY;
                    this.plotBox.width += scrollablePixelsY;
                }
                else {
                    this.clipBox.height += scrollablePixelsY;
                    this.plotBox.height += scrollablePixelsY;
                }
                corrections = {
                    2: { name: 'bottom', value: scrollablePixelsY }
                };
            }
        }
        if (corrections && !e.skipAxes) {
            this.axes.forEach(function (axis) {
                // For right and bottom axes, only fix the plot line length
                if (corrections[axis.side]) {
                    // Get the plot lines right in getPlotLinePath,
                    // temporarily set it to the adjusted plot width.
                    axis.getPlotLinePath = function () {
                        var marginName = corrections[axis.side].name, correctionValue = corrections[axis.side].value, 
                        // axis.right or axis.bottom
                        margin = this[marginName], path;
                        // Temporarily adjust
                        this[marginName] = margin - correctionValue;
                        path = H.Axis.prototype.getPlotLinePath.apply(this, arguments);
                        // Reset
                        this[marginName] = margin;
                        return path;
                    };
                }
                else {
                    // Apply the corrected plotWidth
                    axis.setAxisSize();
                    axis.setAxisTranslation();
                }
            });
        }
    }
});
addEvent(Chart, 'render', function () {
    if (this.scrollablePixelsX || this.scrollablePixelsY) {
        if (this.setUpScrolling) {
            this.setUpScrolling();
        }
        this.applyFixed();
    }
    else if (this.fixedDiv) { // Has been in scrollable mode
        this.applyFixed();
    }
});
/**
 * @private
 * @function Highcharts.Chart#setUpScrolling
 * @return {void}
 */
Chart.prototype.setUpScrolling = function () {
    var _this = this;
    var attribs = {
        WebkitOverflowScrolling: 'touch',
        overflowX: 'hidden',
        overflowY: 'hidden'
    };
    if (this.scrollablePixelsX) {
        attribs.overflowX = 'auto';
    }
    if (this.scrollablePixelsY) {
        attribs.overflowY = 'auto';
    }
    // Insert a container with position relative
    // that scrolling and fixed container renders to (#10555)
    this.scrollingParent = createElement('div', {
        className: 'highcharts-scrolling-parent'
    }, {
        position: 'relative'
    }, this.renderTo);
    // Add the necessary divs to provide scrolling
    this.scrollingContainer = createElement('div', {
        'className': 'highcharts-scrolling'
    }, attribs, this.scrollingParent);
    // On scroll, reset the chart position because it applies to the scrolled
    // container
    addEvent(this.scrollingContainer, 'scroll', function () {
        if (_this.pointer) {
            delete _this.pointer.chartPosition;
        }
    });
    this.innerContainer = createElement('div', {
        'className': 'highcharts-inner-container'
    }, null, this.scrollingContainer);
    // Now move the container inside
    this.innerContainer.appendChild(this.container);
    // Don't run again
    this.setUpScrolling = null;
};
/**
 * These elements are moved over to the fixed renderer and stay fixed when the
 * user scrolls the chart
 * @private
 */
Chart.prototype.moveFixedElements = function () {
    var container = this.container, fixedRenderer = this.fixedRenderer, fixedSelectors = [
        '.highcharts-contextbutton',
        '.highcharts-credits',
        '.highcharts-legend',
        '.highcharts-legend-checkbox',
        '.highcharts-navigator-series',
        '.highcharts-navigator-xaxis',
        '.highcharts-navigator-yaxis',
        '.highcharts-navigator',
        '.highcharts-reset-zoom',
        '.highcharts-scrollbar',
        '.highcharts-subtitle',
        '.highcharts-title'
    ], axisClass;
    if (this.scrollablePixelsX && !this.inverted) {
        axisClass = '.highcharts-yaxis';
    }
    else if (this.scrollablePixelsX && this.inverted) {
        axisClass = '.highcharts-xaxis';
    }
    else if (this.scrollablePixelsY && !this.inverted) {
        axisClass = '.highcharts-xaxis';
    }
    else if (this.scrollablePixelsY && this.inverted) {
        axisClass = '.highcharts-yaxis';
    }
    fixedSelectors.push(axisClass, axisClass + '-labels');
    fixedSelectors.forEach(function (className) {
        [].forEach.call(container.querySelectorAll(className), function (elem) {
            (elem.namespaceURI === fixedRenderer.SVG_NS ?
                fixedRenderer.box :
                fixedRenderer.box.parentNode).appendChild(elem);
            elem.style.pointerEvents = 'auto';
        });
    });
};
/**
 * @private
 * @function Highcharts.Chart#applyFixed
 * @return {void}
 */
Chart.prototype.applyFixed = function () {
    var _a, _b;
    var fixedRenderer, scrollableWidth, scrollableHeight, firstTime = !this.fixedDiv, scrollableOptions = this.options.chart.scrollablePlotArea;
    // First render
    if (firstTime) {
        this.fixedDiv = createElement('div', {
            className: 'highcharts-fixed'
        }, {
            position: 'absolute',
            overflow: 'hidden',
            pointerEvents: 'none',
            zIndex: 2,
            top: 0
        }, null, true);
        (_a = this.scrollingContainer) === null || _a === void 0 ? void 0 : _a.parentNode.insertBefore(this.fixedDiv, this.scrollingContainer);
        this.renderTo.style.overflow = 'visible';
        this.fixedRenderer = fixedRenderer = new H.Renderer(this.fixedDiv, this.chartWidth, this.chartHeight, (_b = this.options.chart) === null || _b === void 0 ? void 0 : _b.style);
        // Mask
        this.scrollableMask = fixedRenderer
            .path()
            .attr({
            fill: this.options.chart.backgroundColor || '#fff',
            'fill-opacity': pick(scrollableOptions.opacity, 0.85),
            zIndex: -1
        })
            .addClass('highcharts-scrollable-mask')
            .add();
        this.moveFixedElements();
        addEvent(this, 'afterShowResetZoom', this.moveFixedElements);
        addEvent(this, 'afterLayOutTitles', this.moveFixedElements);
    }
    else {
        // Set the size of the fixed renderer to the visible width
        this.fixedRenderer.setSize(this.chartWidth, this.chartHeight);
    }
    // Increase the size of the scrollable renderer and background
    scrollableWidth = this.chartWidth + (this.scrollablePixelsX || 0);
    scrollableHeight = this.chartHeight + (this.scrollablePixelsY || 0);
    stop(this.container);
    this.container.style.width = scrollableWidth + 'px';
    this.container.style.height = scrollableHeight + 'px';
    this.renderer.boxWrapper.attr({
        width: scrollableWidth,
        height: scrollableHeight,
        viewBox: [0, 0, scrollableWidth, scrollableHeight].join(' ')
    });
    this.chartBackground.attr({
        width: scrollableWidth,
        height: scrollableHeight
    });
    this.scrollingContainer.style.height = this.chartHeight + 'px';
    // Set scroll position
    if (firstTime) {
        if (scrollableOptions.scrollPositionX) {
            this.scrollingContainer.scrollLeft =
                this.scrollablePixelsX *
                    scrollableOptions.scrollPositionX;
        }
        if (scrollableOptions.scrollPositionY) {
            this.scrollingContainer.scrollTop =
                this.scrollablePixelsY *
                    scrollableOptions.scrollPositionY;
        }
    }
    // Mask behind the left and right side
    var axisOffset = this.axisOffset, maskTop = this.plotTop - axisOffset[0] - 1, maskLeft = this.plotLeft - axisOffset[3] - 1, maskBottom = this.plotTop + this.plotHeight + axisOffset[2] + 1, maskRight = this.plotLeft + this.plotWidth + axisOffset[1] + 1, maskPlotRight = this.plotLeft + this.plotWidth -
        (this.scrollablePixelsX || 0), maskPlotBottom = this.plotTop + this.plotHeight -
        (this.scrollablePixelsY || 0), d;
    if (this.scrollablePixelsX) {
        d = [
            // Left side
            ['M', 0, maskTop],
            ['L', this.plotLeft - 1, maskTop],
            ['L', this.plotLeft - 1, maskBottom],
            ['L', 0, maskBottom],
            ['Z'],
            // Right side
            ['M', maskPlotRight, maskTop],
            ['L', this.chartWidth, maskTop],
            ['L', this.chartWidth, maskBottom],
            ['L', maskPlotRight, maskBottom],
            ['Z']
        ];
    }
    else if (this.scrollablePixelsY) {
        d = [
            // Top side
            ['M', maskLeft, 0],
            ['L', maskLeft, this.plotTop - 1],
            ['L', maskRight, this.plotTop - 1],
            ['L', maskRight, 0],
            ['Z'],
            // Bottom side
            ['M', maskLeft, maskPlotBottom],
            ['L', maskLeft, this.chartHeight],
            ['L', maskRight, this.chartHeight],
            ['L', maskRight, maskPlotBottom],
            ['Z']
        ];
    }
    else {
        d = [['M', 0, 0]];
    }
    if (this.redrawTrigger !== 'adjustHeight') {
        this.scrollableMask.attr({ d: d });
    }
};
