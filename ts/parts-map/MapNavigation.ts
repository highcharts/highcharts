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

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type ButtonRelativeToValue = ('plotBox'|'spacingBox');
        interface Axis {
            fixTo?: Array<number>;
        }
        interface Chart {
            mapNavButtons?: Array<SVGElement>;
            mapNavigation?: MapNavigation;
        }
        interface MapNavigationButtonOptions {
            align?: AlignValue;
            alignTo?: ButtonRelativeToValue;
            height?: number;
            onclick?: Function;
            padding?: number;
            style?: CSSObject;
            text?: string;
            theme?: SVGAttributes;
            verticalAlign?: VerticalAlignValue;
            width?: number;
            x?: number;
            y?: number;
        }
        interface MapNavigationChart extends Chart {
            mapNavButtons: Array<SVGElement>;
            mapNavigation: MapNavigation;
            fitToBox(inner: BBoxObject, outer: BBoxObject): BBoxObject;
            mapZoom(
                howMuch?: number,
                centerXArg?: number,
                centerYArg?: number,
                mouseX?: number,
                mouseY?: number
            ): void;
        }
        interface MapNavigationOptions {
            buttonOptions?: MapNavigationButtonOptions;
            buttons?: Dictionary<MapNavigationButtonOptions>;
            enableButtons?: boolean;
            enabled?: boolean;
            enableDoubleClickZoom?: boolean;
            enableDoubleClickZoomTo?: boolean;
            enableMouseWheelZoom?: boolean;
            enableTouchZoom?: boolean;
            mouseWheelSensitivity?: number;
        }
        interface Options {
            mapNavigation?: MapNavigationOptions;
        }
        class MapNavigation {
            public constructor(chart: Chart);
            public chart: MapNavigationChart;
            public unbindDblClick?: Function;
            public unbindMouseWheel?: Function;
            public init(chart: Chart): void;
            public update(options?: MapNavigationOptions): void;
            public updateEvents(options: MapNavigationOptions): void;
        }
    }
    interface Document {
        onmousewheel: unknown;
    }
}

import U from '../parts/Utilities.js';
const {
    extend,
    objectEach,
    pick
} = U;

import '../parts/Chart.js';

var addEvent = H.addEvent,
    Chart = H.Chart,
    doc = H.doc,
    merge = H.merge;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function stopEvent(e: Event): void {
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
function MapNavigation(
    this: Highcharts.MapNavigation,
    chart: Highcharts.Chart
): void {
    this.init(chart);
}

/**
 * Initialize function.
 *
 * @function MapNavigation#init
 *
 * @param {Highcharts.Chart} chart
 *        The Chart instance.
 *
 * @return {void}
 */
MapNavigation.prototype.init = function (
    this: Highcharts.MapNavigation,
    chart: Highcharts.Chart
): void {
    this.chart = chart as Highcharts.MapNavigationChart;
    chart.mapNavButtons = [];
};

/**
 * Update the map navigation with new options. Calling this is the same as
 * calling `chart.update({ mapNavigation: {} })`.
 *
 * @function MapNavigation#update
 *
 * @param {Highcharts.MapNavigationOptions} [options]
 *        New options for the map navigation.
 *
 * @return {void}
 */
MapNavigation.prototype.update = function (
    this: Highcharts.MapNavigation,
    options?: Highcharts.MapNavigationOptions
): void {
    var chart = this.chart,
        o: Highcharts.MapNavigationOptions = chart.options.mapNavigation as any,
        buttonOptions,
        attr: Highcharts.SVGAttributes,
        states: Highcharts.SVGAttributes,
        hoverStates: Highcharts.SVGAttributes,
        selectStates: Highcharts.SVGAttributes,
        outerHandler = function (
            this: Highcharts.SVGElement,
            e: (Event|Highcharts.Dictionary<any>)
        ): void {
            this.handler.call(chart, e);
            stopEvent(e as any); // Stop default click event (#4444)
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
        (mapNavButtons.pop() as any).destroy();
    }

    if (pick(o.enableButtons, o.enabled) && !chart.renderer.forExport) {

        objectEach(o.buttons, function (
            button: Highcharts.MapNavigationButtonOptions,
            n: string
        ): void {
            buttonOptions = merge(o.buttonOptions, button);

            // Presentational
            if (!chart.styledMode) {
                attr = buttonOptions.theme as any;
                attr.style = merge(
                    (buttonOptions.theme as any).style,
                    buttonOptions.style // #3203
                );
                states = attr.states;
                hoverStates = states && states.hover;
                selectStates = states && states.select;
            }

            button = chart.renderer
                .button(
                    buttonOptions.text as any,
                    0,
                    0,
                    outerHandler,
                    attr,
                    hoverStates,
                    selectStates,
                    0 as any,
                    n === 'zoomIn' ? 'topbutton' : 'bottombutton'
                )
                .addClass('highcharts-map-navigation highcharts-' + ({
                    zoomIn: 'zoom-in',
                    zoomOut: 'zoom-out'
                } as Highcharts.Dictionary<string>)[n])
                .attr({
                    width: buttonOptions.width,
                    height: buttonOptions.height,
                    title: (chart.options.lang as any)[n],
                    padding: buttonOptions.padding,
                    zIndex: 5
                })
                .add() as any;
            (button as any).handler = buttonOptions.onclick;
            (button as any).align(
                extend(buttonOptions, {
                    width: button.width,
                    height: 2 * (button.height as any)
                }),
                null,
                buttonOptions.alignTo
            );
            // Stop double click event (#4444)
            addEvent((button as any).element, 'dblclick', stopEvent);

            mapNavButtons.push(button as any);

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
 *
 * @return {void}
 */
MapNavigation.prototype.updateEvents = function (
    this: Highcharts.MapNavigation,
    options: Highcharts.MapNavigationOptions
): void {
    var chart = this.chart;

    // Add the double click event
    if (
        pick(options.enableDoubleClickZoom, options.enabled) ||
        options.enableDoubleClickZoomTo
    ) {
        this.unbindDblClick = this.unbindDblClick || addEvent(
            chart.container,
            'dblclick',
            function (e: Highcharts.PointerEventObject): void {
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
            typeof doc.onmousewheel === 'undefined' ?
                'DOMMouseScroll' : 'mousewheel',
            function (e: Highcharts.PointerEventObject): boolean {
                chart.pointer.onContainerMouseWheel(e);
                // Issue #5011, returning false from non-jQuery event does
                // not prevent default
                stopEvent(e as Event);
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
    fitToBox: function (
        this: Highcharts.MapNavigationChart,
        inner: Highcharts.BBoxObject,
        outer: Highcharts.BBoxObject
    ): Highcharts.BBoxObject {
        [['x', 'width'], ['y', 'height']].forEach(function (
            dim: Array<string>
        ): void {
            var pos = dim[0],
                size = dim[1];

            if ((inner as any)[pos] + (inner as any)[size] >
                (outer as any)[pos] + (outer as any)[size]
            ) { // right
                // the general size is greater, fit fully to outer
                if ((inner as any)[size] > (outer as any)[size]) {
                    (inner as any)[size] = (outer as any)[size];
                    (inner as any)[pos] = (outer as any)[pos];
                } else { // align right
                    (inner as any)[pos] = (outer as any)[pos] +
                        (outer as any)[size] - (inner as any)[size];
                }
            }
            if ((inner as any)[size] > (outer as any)[size]) {
                (inner as any)[size] = (outer as any)[size];
            }
            if ((inner as any)[pos] < (outer as any)[pos]) {
                (inner as any)[pos] = (outer as any)[pos];
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
     *
     * @return {void}
     */
    mapZoom: function (
        this: Highcharts.MapNavigationChart,
        howMuch?: number,
        centerXArg?: number,
        centerYArg?: number,
        mouseX?: number,
        mouseY?: number
    ): void {
        var chart = this,
            xAxis = chart.xAxis[0],
            xRange = (xAxis.max as any) - (xAxis.min as any),
            centerX = pick(centerXArg, (xAxis.min as any) + xRange / 2),
            newXRange = xRange * (howMuch as any),
            yAxis = chart.yAxis[0],
            yRange = (yAxis.max as any) - (yAxis.min as any),
            centerY = pick(centerYArg, (yAxis.min as any) + yRange / 2),
            newYRange = yRange * (howMuch as any),
            fixToX = mouseX ? ((mouseX - (xAxis.pos as any)) / xAxis.len) : 0.5,
            fixToY = mouseY ? ((mouseY - (yAxis.pos as any)) / yAxis.len) : 0.5,
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
                width: (xAxis.dataMax as any) - (xAxis.dataMin as any),
                height: (yAxis.dataMax as any) - (yAxis.dataMin as any)
            } as any),
            zoomOut = (
                newExt.x <= (xAxis.dataMin as any) &&
                newExt.width >=
                    (xAxis.dataMax as any) - (xAxis.dataMin as any) &&
                newExt.y <= (yAxis.dataMin as any) &&
                newExt.height >= (yAxis.dataMax as any) - (yAxis.dataMin as any)
            );

        // When mousewheel zooming, fix the point under the mouse
        if (mouseX) {
            xAxis.fixTo = [mouseX - (xAxis.pos as any), (centerXArg as any)];
        }
        if (mouseY) {
            yAxis.fixTo = [mouseY - (yAxis.pos as any), (centerYArg as any)];
        }

        // Zoom
        if (typeof howMuch !== 'undefined' && !zoomOut) {
            xAxis.setExtremes(newExt.x, newExt.x + newExt.width, false);
            yAxis.setExtremes(newExt.y, newExt.y + newExt.height, false);

        // Reset zoom
        } else {
            xAxis.setExtremes(void 0, void 0, false);
            yAxis.setExtremes(void 0, void 0, false);
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
addEvent(Chart as any, 'beforeRender', function (
    this: Highcharts.MapNavigationChart
): void {
    // Render the plus and minus buttons. Doing this before the shapes makes
    // getBBox much quicker, at least in Chrome.
    this.mapNavigation = new (MapNavigation as any)(this);
    this.mapNavigation.update();
});

H.MapNavigation = MapNavigation as any;
