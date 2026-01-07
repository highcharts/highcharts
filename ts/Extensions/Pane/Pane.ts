/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

        // Set options. Angular charts have a default background (#3318)
        this.options = options = merge(
            PaneDefaults.pane,
            { background: this.chart.angular ? {} : void 0 },
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
