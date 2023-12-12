'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { NavigatorOptions } from './NavigatorOptions';
import type { SeriesOptions } from '../../Core/Series/SeriesOptions';
import Chart from '../../Core/Chart/Chart.js';
import Navigator from './Navigator.js';
import G from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
import Axis from '../../Core/Axis/Axis.js';
import StandaloneNavigatorDefaults from './StandaloneNavigatorDefaults.js';
const {
    merge,
    addEvent,
    fireEvent,
    pick
} = U;

declare module '../../Core/GlobalsLike.d.ts' {
    interface GlobalsLike {
        navigators: Array<StandaloneNavigator>;
    }
}

type StandaloneNavigatorOptions = {
    navigator: NavigatorOptions;
    width: number;
    height: number;
    min: number;
    max: number;
    colors: [];
};

/* *
 *
 *  Class
 *
 * */
class StandaloneNavigator {

    public eventsToUnbind: Array<Function> = [];
    public navigator: Navigator;
    public boundAxes: Array<Axis> = [];
    public options: StandaloneNavigatorOptions;
    public userOptions: DeepPartial<StandaloneNavigatorOptions>;

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * Factory function for standalone navigator.
     *
     * @function Highcharts.navigator
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     * @param {StandaloneNavigatorOptions} options
     * The standalone navigator options with chart-like structure.
     *
     * Returns the navigator object.
     */
    public static navigator(
        renderTo: (string|globalThis.HTMLElement),
        options: DeepPartial<StandaloneNavigatorOptions>
    ): StandaloneNavigator {
        const nav = new StandaloneNavigator(renderTo, options);

        if (!G.navigators) {
            G.navigators = [nav];
        } else {
            G.navigators.push(nav);
        }

        return nav;
    }


    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        element: (string | globalThis.HTMLElement),
        userOptions: DeepPartial<StandaloneNavigatorOptions>
    ) {
        this.userOptions = userOptions;
        this.options = merge(
            (G as any).getOptions(),
            StandaloneNavigatorDefaults,
            userOptions
        ) as StandaloneNavigatorOptions;

        const chart = new Chart(element, this.options);

        this.navigator = new Navigator(chart);
        chart.navigator = this.navigator;
        this.initNavigator();
    }

    /**
     * Binds an axis to the standalone navigator,
     * allowing the navigator to control the range.
     *
     * @param {Axis | Chart} axisOrChart
     *        The Axis or Chart to bind to the navigator.
     */
    public bind(axisOrChart: Axis | Chart): void {
        const nav = this;
        // If the chart is passed, bind the first xAxis
        const axis = (axisOrChart instanceof Chart) ?
            axisOrChart.xAxis[0] :
            axisOrChart;

        if (!(axis instanceof Axis)) {
            return;
        }

        const { min, max } = this.navigator.xAxis;

        this.boundAxes.push(axis);

        // Show axis' series in navigator based on showInNavigator property
        axis.series.forEach((series): void => {
            if (series.options.showInNavigator) {
                nav.addSeries(series.options);
            }
        });

        // Set extremes to match the navigator's extremes
        axis.setExtremes(min, max);
    }

    /**
     * Unbinds an axis from the standalone navigator.
     *
     * @param {Chart | Axis | undefined} axisOrChart
     *        The axis to unbind from the standalone navigator.
     */
    public unbind(axisOrChart?: Chart | Axis): void {
        // If no axis or chart is provided, unbind all bound axes
        if (!axisOrChart) {
            this.boundAxes.length = 0;
            return;
        }

        const axis = (axisOrChart instanceof Axis) ?
            axisOrChart :
            axisOrChart.xAxis[0];

        this.boundAxes = this.boundAxes.filter((a): boolean => a !== axis);
    }


    /**
     * Destroys allocated elements.
     *
     * @private
     * @function Highcharts.StandaloneNavigator#destroy
     */
    public destroy(): void {
        // Disconnect events
        this.eventsToUnbind.forEach((f): void => {
            f();
        });
        this.boundAxes.length = 0;
        this.eventsToUnbind.length = 0;
        this.navigator.destroy();
        this.navigator.chart.destroy();
    }

    /**
     * Update standalone navigator
     *
     * @private
     * @function Highcharts.StandaloneNavigator#update
     *
     * @param {StandaloneNavigatorOptions} newOptions
     *        Options to merge in when updating standalone navigator
     */
    public update(
        newOptions: Partial<StandaloneNavigatorOptions>,
        redraw?: boolean
    ):void {
        this.options = merge(this.options, newOptions);

        this.navigator.chart.update(this.options, redraw);
    }

    /**
     * Adds a series to the standalone navigator.
     *
     * @param {SeriesOptions} seriesOptions
     *        Options for the series to be added to the navigator.
     */
    public addSeries(seriesOptions: SeriesOptions): void {
        this.navigator.chart.addSeries(merge(
            seriesOptions,
            { showInNavigator: pick(seriesOptions.showInNavigator, true) }
        ));

        this.navigator.setBaseSeries();
    }

    /**
     * Initialize the standalone navigator.
     *
     * @private
     * @function Highcharts.RangeSelector#init
     */
    public initNavigator(): void {
        const nav = this.navigator;
        nav.top = 0;
        nav.xAxis.setScale();
        nav.yAxis.setScale();
        nav.xAxis.render();
        nav.yAxis.render();
        nav.series?.forEach((s): void => {
            s.translate();
            s.render();
            s.redraw();
        });

        const { min, max } = this.getInitialExtremes();
        nav.render(min, max);

        this.eventsToUnbind.push(
            addEvent(
                this.navigator.chart.xAxis[0],
                'setExtremes',
                (e): void => {
                    const { min, max } = e as { min: number, max: number };

                    this.boundAxes.forEach((axis): void => {
                        axis.setExtremes(min, max);
                    });
                }
            )
        );
    }

    /**
     * Get the current range of the standalone navigator.
     *
     * @return {Axis.ExtremesObject}
     *         The current range of the standalone navigator.
     */
    public getRange(): Axis.ExtremesObject {
        const { min, max } = this.navigator.chart.xAxis[0].getExtremes(),
            { userMin, userMax, min: dataMin, max: dataMax } =
                this.navigator.xAxis.getExtremes();

        return {
            min: pick(min, dataMin),
            max: pick(max, dataMax),
            dataMin,
            dataMax,
            userMin,
            userMax
        };
    }

    /**
     * Set the range of the standalone navigator.
     *
     * @param {number | undefined} min
     *        The new minimum value.
     * @param {number | undefined} max
     *        The new maximum value.
     */
    public setRange(min?: number, max?: number): void {
        fireEvent(
            this.navigator,
            'setRange',
            { min, max, trigger: 'navigator' }
        );
    }

    /**
     * Get the initial, options based extremes for the standalone navigator.
     *
     * @return {{ min: number, max: number }}
     *          The initial minimum and maximum extremes values.
     */
    public getInitialExtremes(): { min: number, max: number } {
        const { min, max } = this.options,
            { min: defaultMin, max: defaultMax } =
                this.navigator.xAxis.getExtremes();

        return {
            min: min || defaultMin,
            max: max || defaultMax
        };
    }
}

export default StandaloneNavigator;
