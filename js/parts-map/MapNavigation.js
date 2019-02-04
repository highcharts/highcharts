/**
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';

var addEvent = H.addEvent,
    Chart = H.Chart,
    doc = H.doc,
    extend = H.extend,
    merge = H.merge,
    pick = H.pick;

function stopEvent(e) {
    if (e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        if (e.stopPropagation) {
            e.stopPropagation();
        }
        e.cancelBubble = true;
    }
}

/**
 * The MapNavigation handles buttons for navigation in addition to mousewheel
 * and doubleclick handlers for chart zooming.
 *
 * @private
 * @class
 * @name MapNavigation
 *
 * @param {Highcharts.Chart} chart
 *        The Chart instance.
 */
function MapNavigation(chart) {
    this.init(chart);
}

/**
 * Initialize function.
 *
 * @function MapNavigation#init
 *
 * @param {Highcharts.Chart} chart
 *        The Chart instance.
 */
MapNavigation.prototype.init = function (chart) {
    this.chart = chart;
    chart.mapNavButtons = [];
};

/**
 * Update the map navigation with new options. Calling this is the same as
 * calling `chart.update({ mapNavigation: {} })`.
 *
 * @function MapNavigation#update
 *
 * @param {Highcharts.MapNavigationOptions} options
 *        New options for the map navigation.
 */
MapNavigation.prototype.update = function (options) {
    var chart = this.chart,
        o = chart.options.mapNavigation,
        buttonOptions,
        attr,
        states,
        hoverStates,
        selectStates,
        outerHandler = function (e) {
            this.handler.call(chart, e);
            stopEvent(e); // Stop default click event (#4444)
        },
        mapNavButtons = chart.mapNavButtons;

    // Merge in new options in case of update, and register back to chart
    // options.
    if (options) {
        o = chart.options.mapNavigation =
            merge(chart.options.mapNavigation, options);
    }

    // Destroy buttons in case of dynamic update
    while (mapNavButtons.length) {
        mapNavButtons.pop().destroy();
    }

    if (pick(o.enableButtons, o.enabled) && !chart.renderer.forExport) {

        H.objectEach(o.buttons, function (button, n) {
            buttonOptions = merge(o.buttonOptions, button);

            // Presentational
            if (!chart.styledMode) {
                attr = buttonOptions.theme;
                attr.style = merge(
                    buttonOptions.theme.style,
                    buttonOptions.style // #3203
                );
                states = attr.states;
                hoverStates = states && states.hover;
                selectStates = states && states.select;
            }

            button = chart.renderer.button(
                buttonOptions.text,
                0,
                0,
                outerHandler,
                attr,
                hoverStates,
                selectStates,
                0,
                n === 'zoomIn' ? 'topbutton' : 'bottombutton'
            )
                .addClass('highcharts-map-navigation highcharts-' + {
                    zoomIn: 'zoom-in',
                    zoomOut: 'zoom-out'
                }[n])
                .attr({
                    width: buttonOptions.width,
                    height: buttonOptions.height,
                    title: chart.options.lang[n],
                    padding: buttonOptions.padding,
                    zIndex: 5
                })
                .add();
            button.handler = buttonOptions.onclick;
            button.align(
                extend(buttonOptions, {
                    width: button.width,
                    height: 2 * button.height
                }),
                null,
                buttonOptions.alignTo
            );
            // Stop double click event (#4444)
            addEvent(button.element, 'dblclick', stopEvent);

            mapNavButtons.push(button);

        });
    }

    this.updateEvents(o);
};

/**
 * Update events, called internally from the update function. Add new event
 * handlers, or unbinds events if disabled.
 *
 * @function MapNavigation#updateEvents
 *
 * @param {Highcharts.MapNavigationOptions} options
 *        Options for map navigation.
 */
MapNavigation.prototype.updateEvents = function (options) {
    var chart = this.chart;

    // Add the double click event
    if (
        pick(options.enableDoubleClickZoom, options.enabled) ||
        options.enableDoubleClickZoomTo
    ) {
        this.unbindDblClick = this.unbindDblClick || addEvent(
            chart.container,
            'dblclick',
            function (e) {
                chart.pointer.onContainerDblClick(e);
            }
        );
    } else if (this.unbindDblClick) {
        // Unbind and set unbinder to undefined
        this.unbindDblClick = this.unbindDblClick();
    }

    // Add the mousewheel event
    if (pick(options.enableMouseWheelZoom, options.enabled)) {
        this.unbindMouseWheel = this.unbindMouseWheel || addEvent(
            chart.container,
            doc.onmousewheel === undefined ? 'DOMMouseScroll' : 'mousewheel',
            function (e) {
                chart.pointer.onContainerMouseWheel(e);
                // Issue #5011, returning false from non-jQuery event does
                // not prevent default
                stopEvent(e);
                return false;
            }
        );
    } else if (this.unbindMouseWheel) {
        // Unbind and set unbinder to undefined
        this.unbindMouseWheel = this.unbindMouseWheel();
    }

};

// Add events to the Chart object itself
extend(Chart.prototype, /** @lends Chart.prototype */ {

    /**
     * Fit an inner box to an outer. If the inner box overflows left or right,
     * align it to the sides of the outer. If it overflows both sides, fit it
     * within the outer. This is a pattern that occurs more places in
     * Highcharts, perhaps it should be elevated to a common utility function.
     *
     * @ignore
     * @function Highcharts.Chart#fitToBox
     *
     * @param {Highcharts.BBoxObject} inner
     *
     * @param {Highcharts.BBoxObject} outer
     *
     * @return {Highcharts.BBoxObject}
     *         The inner box
     */
    fitToBox: function (inner, outer) {
        [['x', 'width'], ['y', 'height']].forEach(function (dim) {
            var pos = dim[0],
                size = dim[1];

            if (inner[pos] + inner[size] > outer[pos] + outer[size]) { // right
                // the general size is greater, fit fully to outer
                if (inner[size] > outer[size]) {
                    inner[size] = outer[size];
                    inner[pos] = outer[pos];
                } else { // align right
                    inner[pos] = outer[pos] + outer[size] - inner[size];
                }
            }
            if (inner[size] > outer[size]) {
                inner[size] = outer[size];
            }
            if (inner[pos] < outer[pos]) {
                inner[pos] = outer[pos];
            }
        });


        return inner;
    },

    /**
     * Highmaps only. Zoom in or out of the map. See also {@link Point#zoomTo}.
     * See {@link Chart#fromLatLonToPoint} for how to get the `centerX` and
     * `centerY` parameters for a geographic location.
     *
     * @function Highcharts.Chart#mapZoom
     *
     * @param {number} [howMuch]
     *        How much to zoom the map. Values less than 1 zooms in. 0.5 zooms
     *        in to half the current view. 2 zooms to twice the current view. If
     *        omitted, the zoom is reset.
     *
     * @param {number} [centerX]
     *        The X axis position to center around if available space.
     *
     * @param {number} [centerY]
     *        The Y axis position to center around if available space.
     *
     * @param {number} [mouseX]
     *        Fix the zoom to this position if possible. This is used for
     *        example in mousewheel events, where the area under the mouse
     *        should be fixed as we zoom in.
     *
     * @param {number} [mouseY]
     *        Fix the zoom to this position if possible.
     */
    mapZoom: function (howMuch, centerXArg, centerYArg, mouseX, mouseY) {
        var chart = this,
            xAxis = chart.xAxis[0],
            xRange = xAxis.max - xAxis.min,
            centerX = pick(centerXArg, xAxis.min + xRange / 2),
            newXRange = xRange * howMuch,
            yAxis = chart.yAxis[0],
            yRange = yAxis.max - yAxis.min,
            centerY = pick(centerYArg, yAxis.min + yRange / 2),
            newYRange = yRange * howMuch,
            fixToX = mouseX ? ((mouseX - xAxis.pos) / xAxis.len) : 0.5,
            fixToY = mouseY ? ((mouseY - yAxis.pos) / yAxis.len) : 0.5,
            newXMin = centerX - newXRange * fixToX,
            newYMin = centerY - newYRange * fixToY,
            newExt = chart.fitToBox({
                x: newXMin,
                y: newYMin,
                width: newXRange,
                height: newYRange
            }, {
                x: xAxis.dataMin,
                y: yAxis.dataMin,
                width: xAxis.dataMax - xAxis.dataMin,
                height: yAxis.dataMax - yAxis.dataMin
            }),
            zoomOut = newExt.x <= xAxis.dataMin &&
                newExt.width >= xAxis.dataMax - xAxis.dataMin &&
                newExt.y <= yAxis.dataMin &&
                newExt.height >= yAxis.dataMax - yAxis.dataMin;

        // When mousewheel zooming, fix the point under the mouse
        if (mouseX) {
            xAxis.fixTo = [mouseX - xAxis.pos, centerXArg];
        }
        if (mouseY) {
            yAxis.fixTo = [mouseY - yAxis.pos, centerYArg];
        }

        // Zoom
        if (howMuch !== undefined && !zoomOut) {
            xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
            yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);

        // Reset zoom
        } else {
            xAxis.setExtremes(undefined, undefined, false);
            yAxis.setExtremes(undefined, undefined, false);
        }

        // Prevent zooming until this one is finished animating
        /*
        chart.holdMapZoom = true;
        setTimeout(function () {
            chart.holdMapZoom = false;
        }, 200);
        */
        /*
        delay = animation ? animation.duration || 500 : 0;
        if (delay) {
            chart.isMapZooming = true;
            setTimeout(function () {
                chart.isMapZooming = false;
                if (chart.mapZoomQueue) {
                    chart.mapZoom.apply(chart, chart.mapZoomQueue);
                }
                chart.mapZoomQueue = null;
            }, delay);
        }
        */

        chart.redraw();
    }
});

// Extend the Chart.render method to add zooming and panning
addEvent(Chart, 'beforeRender', function () {
    // Render the plus and minus buttons. Doing this before the shapes makes
    // getBBox much quicker, at least in Chrome.
    this.mapNavigation = new MapNavigation(this);
    this.mapNavigation.update();
});

H.MapNavigation = MapNavigation;
