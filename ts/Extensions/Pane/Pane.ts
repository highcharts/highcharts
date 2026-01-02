/* *
 *
 *  (c) 2010-2025 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
import type { PaneChart } from './PaneComposition';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import CU from '../../Series/CenteredUtilities.js';
import PaneComposition from './PaneComposition.js';
import PaneDefaults from './PaneDefaults.js';
import U from '../../Core/Utilities.js';
const {
    extend,
    getAlignFactor,
    isArray,
    isNumber,
    merge,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisBase' {
    interface AxisBase {
        pane?: Pane;
    }
}

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
     *  Static Properties
     *
     * */

    public static compose = PaneComposition.compose;

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

    public background!: Array<SVGElement>;

    public center!: Array<number>;

    public chart!: PaneChart;

    public group?: SVGElement;

    public options!: PaneOptions;

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

        const conditionalDefaults: PaneOptions = {};

        if (this.chart.angular) {
            conditionalDefaults.background = {};
            conditionalDefaults.innerSize = '60%';
        }

        // Set options. Angular charts have a default background (#3318)
        this.options = options = merge(
            PaneDefaults.pane,
            conditionalDefaults,
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
                            // Defaults inherited from the `pane` option
                            {
                                borderRadius: this.options.borderRadius,
                                innerRadius: this.center[3] / 2
                            },
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

        const { chart, options } = this,
            centerY = options.center?.[1],
            m = options.margin || 0,
            margin = isArray(m) ? m : [m, m, m, m];

        let size = options.size,
            sizeFromAngle: number|undefined,
            appliedCenterMargin = 0;

        // Get the required margin in order to display the data label in or
        // below the center
        const centerMargin = chart.series
            .filter((s): boolean => s.is('gauge') && s.yAxis?.pane === this)
            .reduce((max, s): number => {
                const dl = splat(s.options.dataLabels)[0];
                let margin = 0;
                if (dl) {
                    // 30 is an approximation of the default data label height.
                    // It is not yet rendered.
                    margin = (1 - getAlignFactor(dl.verticalAlign)) * 30 +
                        (dl.y || 0);
                }
                return Math.max(max, margin);
            }, 0) + margin[2];

        // Handle auto-positioning when size and center are undefined
        if (size === void 0 || centerY === void 0) {
            const { plotHeight, plotWidth } = chart,
                { startAngle = 0, endAngle = 360 } = options,
                deg2rad = Math.PI * 2 / 360,
                crossingBottom = (startAngle < 180 && endAngle > 180) ||
                    // Circle background should fill out the plot area
                    splat(options.background).some(
                        (b): boolean => b?.shape === 'circle'
                    ),
                angle = crossingBottom ? 180 : Math.max(
                    Math.abs(startAngle),
                    Math.abs(endAngle)
                ),
                sin = Math.sin(deg2rad * (angle - 90)),
                // The size doesn't increase further to angles below this
                // minimum. For linear gauges, this means that the pivot is kept
                // visible.
                minimumAngle = 90,
                sizeRatio = 0.5 + 0.5 * Math.max(
                    sin, Math.sin(deg2rad * (minimumAngle - 90))
                );

            sizeFromAngle = (plotHeight - margin[0] - margin[2]) /
                sizeRatio;
            if (size === void 0) {
                size = Math.min(
                    sizeFromAngle,
                    plotWidth - margin[1] - margin[3]
                );

                // Make sure there is space for the data label (centerMargin)
                const overflow = size + margin[0] + margin[2] +
                    2 * (centerMargin - plotHeight);
                if (overflow > 0) {
                    appliedCenterMargin = overflow;
                    size -= appliedCenterMargin;
                }
            }
        }

        // Run the standard centering
        this.center = (
            axis ||
            this.axis ||
            ({} as Record<string, Array<number>>)
        ).center = CU.getCenter.call(this as any);

        if (!options.size) {
            // Apply the auto-positioning
            if (isNumber(size) && size >= 0) {
                this.center[2] = size;
            }
            if (!isNumber(centerY) && isNumber(sizeFromAngle)) {
                this.center[1] = (
                    sizeFromAngle +
                    this.center[2] -
                    appliedCenterMargin
                ) / 4 + margin[0];
            }
        }
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

/* *
 *
 *  Default Export
 *
 * */

export default Pane;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * @typedef {"arc"|"circle"|"solid"} Highcharts.PaneBackgroundShapeValue
 */

''; // Keeps doclets above in JS file
