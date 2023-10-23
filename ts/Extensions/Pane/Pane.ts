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

import type {
    PaneBackgroundOptions,
    PaneOptions
} from './PaneOptions';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type Series from '../../Core/Series/Series';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import Chart from '../../Core/Chart/Chart.js';
import CU from '../../Series/CenteredUtilities.js';
import H from '../../Core/Globals.js';
import PaneDefaults from './PaneDefaults.js';
import Pointer from '../../Core/Pointer.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    extend,
    merge,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisLike' {
    interface AxisLike {
        pane?: Pane;
    }
}

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        hoverPane?: Pane;
        pane?: Array<Pane>;
        getHoverPane?(eventArgs: any): (Pane|undefined);
    }
}

export interface PaneChart extends Chart {
    hoverPane?: Pane;
    pane: Array<Pane>;
    getHoverPane(eventArgs: any): (Pane|undefined);
}

/**
 * @typedef {"arc"|"circle"|"solid"} Highcharts.PaneBackgroundShapeValue
 */

Chart.prototype.collectionsWithUpdate.push('pane');

/* *
 *
 *  Class
 *
 * */

/**
 * The Pane object allows options that are common to a set of X and Y axes.
 *
 * In the future, this can be extended to basic Highcharts and Highcharts Stock.
 *
 * @private
 * @class
 * @name Highcharts.Pane
 * @param {Highcharts.PaneOptions} options
 * @param {Highcharts.Chart} chart
 */
class Pane {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        options: PaneOptions,
        chart: PaneChart
    ) {
        this.init(options, chart);
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis?: RadialAxis.AxisComposition;

    public background: Array<SVGElement> = void 0 as any;

    public center: Array<number> = void 0 as any;

    public chart: PaneChart = void 0 as any;

    public group?: SVGElement;

    public options: PaneOptions = void 0 as any;

    public coll = 'pane'; // Member of chart.pane

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Initialize the Pane object
     *
     * @private
     * @function Highcharts.Pane#init
     *
     * @param {Highcharts.PaneOptions} options
     *
     * @param {Highcharts.Chart} chart
     */
    public init(
        options: PaneOptions,
        chart: PaneChart
    ): void {
        this.chart = chart;
        this.background = [];

        chart.pane.push(this as any);

        this.setOptions(options);
    }

    /**
     * @private
     * @function Highcharts.Pane#setOptions
     *
     * @param {Highcharts.PaneOptions} options
     */
    public setOptions(options: PaneOptions): void {

        // Set options. Angular charts have a default background (#3318)
        this.options = options = merge(
            PaneDefaults.pane,
            this.chart.angular ? { background: {} } : void 0,
            options
        );
    }

    /**
     * Render the pane with its backgrounds.
     *
     * @private
     * @function Highcharts.Pane#render
     */
    public render(): void {
        const options = this.options,
            renderer = this.chart.renderer;

        if (!this.group) {
            this.group = renderer.g('pane-group')
                .attr({ zIndex: options.zIndex || 0 })
                .add();
        }

        this.updateCenter();

        let backgroundOption = this.options.background;

        // Render the backgrounds
        if (backgroundOption) {
            backgroundOption = splat(backgroundOption);

            const len = Math.max(
                backgroundOption.length,
                this.background.length || 0
            );

            for (let i = 0; i < len; i++) {
                // #6641 - if axis exists, chart is circular and apply
                // background
                if (backgroundOption[i] && this.axis) {
                    this.renderBackground(
                        merge(
                            PaneDefaults.background,
                            backgroundOption[i]
                        ),
                        i
                    );
                } else if (this.background[i]) {
                    this.background[i] = this.background[i].destroy() as any;
                    this.background.splice(i, 1);
                }
            }
        }
    }

    /**
     * Render an individual pane background.
     *
     * @private
     * @function Highcharts.Pane#renderBackground
     *
     * @param {Highcharts.PaneBackgroundOptions} backgroundOptions
     *        Background options
     *
     * @param {number} i
     *        The index of the background in this.backgrounds
     */
    public renderBackground(
        backgroundOptions: PaneBackgroundOptions,
        i: number
    ): void {
        const attribs: SVGAttributes = {
            'class':
                'highcharts-pane ' + (backgroundOptions.className || '')
        };

        let method = 'animate';

        if (!this.chart.styledMode) {
            extend(attribs, {
                'fill': backgroundOptions.backgroundColor,
                'stroke': backgroundOptions.borderColor,
                'stroke-width': backgroundOptions.borderWidth
            });
        }

        if (!this.background[i]) {
            this.background[i] = this.chart.renderer
                .path()
                .add(this.group);
            method = 'attr';
        }

        this.background[i][method]({
            'd': (this.axis as any).getPlotBandPath(
                backgroundOptions.from,
                backgroundOptions.to,
                backgroundOptions
            )
        }).attr(attribs);

    }

    /**
     * Gets the center for the pane and its axis.
     *
     * @private
     * @function Highcharts.Pane#updateCenter
     * @param {Highcharts.Axis} [axis]
     */
    public updateCenter(axis?: RadialAxis.AxisComposition): void {
        this.center = (
            axis ||
            this.axis ||
            ({} as Record<string, Array<number>>)
        ).center = CU.getCenter.call(this as any);
    }

    /**
     * Destroy the pane item
     *
     * @ignore
     * @private
     * @function Highcharts.Pane#destroy
     * /
    destroy: function () {
        erase(this.chart.pane, this);
        this.background.forEach(function (background) {
            background.destroy();
        });
        this.background.length = 0;
        this.group = this.group.destroy();
    },
    */

    /**
     * Update the pane item with new options
     *
     * @private
     * @function Highcharts.Pane#update
     * @param {Highcharts.PaneOptions} options
     *        New pane options
     * @param {boolean} [redraw]
     */
    public update(
        options: PaneOptions,
        redraw?: boolean
    ): void {
        merge(true, this.options, options);

        this.setOptions(this.options);
        this.render();
        this.chart.axes.forEach(function (axis): void {
            if (axis.pane === this) {
                axis.pane = null as any;
                axis.update({}, redraw);
            }
        }, this);
    }

}

/**
 * Check whether element is inside or outside pane.
 * @private
 * @param  {number} x
 * Element's x coordinate
 * @param  {number} y
 * Element's y coordinate
 * @param  {Array<number>} center
 * Pane's center (x, y) and diameter
 * @param  {number} startAngle
 * Pane's normalized start angle in radians (<-PI, PI>)
 * @param  {number} endAngle
 * Pane's normalized end angle in radians (<-PI, PI>)
 */
function isInsidePane(
    x: number,
    y: number,
    center: Array<number>,
    startAngle?: number,
    endAngle?: number
): boolean {
    let insideSlice = true;

    const cx = center[0],
        cy = center[1];

    const distance = Math.sqrt(
        Math.pow(x - cx, 2) + Math.pow(y - cy, 2)
    );

    if (defined(startAngle) && defined(endAngle)) {
        // Round angle to N-decimals to avoid numeric errors
        const angle = Math.atan2(
            correctFloat(y - cy, 8),
            correctFloat(x - cx, 8)
        );

        // Ignore full circle panes:
        if (endAngle !== startAngle) {
            // If normalized start angle is bigger than normalized end,
            // it means angles have different signs. In such situation we
            // check the <-PI, startAngle> and <endAngle, PI> ranges.
            if (startAngle > endAngle) {
                insideSlice = (
                    angle >= startAngle &&
                    angle <= Math.PI
                ) || (
                    angle <= endAngle &&
                    angle >= -Math.PI
                );
            } else {
                // In this case, we simple check if angle is within the
                // <startAngle, endAngle> range
                insideSlice = angle >= startAngle &&
                    angle <= correctFloat(endAngle, 8);
            }
        }
    }
    // Round up radius because x and y values are rounded
    return distance <= Math.ceil(center[2] / 2) && insideSlice;
}

Chart.prototype.getHoverPane = function (
    this: PaneChart,
    eventArgs: {
        chartX: number;
        chartY: number;
        shared: boolean|undefined;
        filter?: Function;
    }
): (Pane|undefined) {
    const chart = this;
    let hoverPane;
    if (eventArgs) {
        chart.pane.forEach((pane): void => {
            const x = eventArgs.chartX - chart.plotLeft,
                y = eventArgs.chartY - chart.plotTop;

            if (isInsidePane(x, y, pane.center)) {
                hoverPane = pane;
            }
        });
    }
    return hoverPane;
};

// Check if (x, y) position is within pane for polar
addEvent(Chart, 'afterIsInsidePlot', function (
    e: {
        x: number;
        y: number;
        isInsidePlot: boolean;
        options: Chart.IsInsideOptionsObject;
    }
): void {
    const chart = this;

    if (chart.polar) {
        if (e.options.inverted) {
            [e.x, e.y] = [e.y, e.x];
        }

        e.isInsidePlot = (chart as PaneChart).pane.some(
            (pane): boolean => isInsidePane(
                e.x,
                e.y,
                pane.center,
                pane.axis && pane.axis.normalizedStartAngleRad,
                pane.axis && pane.axis.normalizedEndAngleRad
            )
        );
    }
});

addEvent(Pointer, 'beforeGetHoverData', function (
    eventArgs: {
        chartX: number;
        chartY: number;
        shared: boolean|undefined;
        filter?: Function;
    }
): void {
    const chart = (this.chart as PaneChart);
    if (chart.polar) {
        // Find pane we are currently hovering over.
        chart.hoverPane = chart.getHoverPane(eventArgs);

        // Edit filter method to handle polar
        eventArgs.filter = function (s: Series): boolean {
            return (
                s.visible &&
                !(!eventArgs.shared && s.directTouch) && // #3821
                pick(s.options.enableMouseTracking, true) &&
                (!chart.hoverPane || s.xAxis.pane === chart.hoverPane)
            );
        };
    } else {
        chart.hoverPane = void 0;
    }
});

addEvent(Pointer, 'afterGetHoverData', function (
    eventArgs: Pointer.EventArgsObject
): void {
    const chart = this.chart;
    if (
        eventArgs.hoverPoint &&
        eventArgs.hoverPoint.plotX &&
        eventArgs.hoverPoint.plotY &&
        chart.hoverPane &&
        !isInsidePane(
            eventArgs.hoverPoint.plotX,
            eventArgs.hoverPoint.plotY,
            chart.hoverPane.center
        )
    ) {
        eventArgs.hoverPoint = void 0;
    }
});

(H as any).Pane = Pane;
export default Pane;
