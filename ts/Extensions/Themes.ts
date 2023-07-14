/* *
 *
 *  Themes module - switch between themes
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

import type Chart from '../Core/Chart/Chart';
import type Options from '../Core/Options';

import DO from '../Core/Defaults.js';
const {
    getOptions,
    setOptions
} = DO;
import U from '../Core/Utilities.js';
const {
    addEvent,
    isObject,
    merge
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Chart/ChartLike' {
    interface ChartLike {
        /** @requires Extensions/Themes */
        themes?: Themes;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedMembers: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */

/**
 * Adds a theme switch on each chart.
 * @private
 */
function onChartInit(
    this: Chart
): void {
    if (!this.themes) {
        /**
         * Additions to manage themes on chart level. This requires composition
         * with `Highcharts.Themes.compose`.
         *
         * @name Highcharts.Chart#themes
         * @type {Highcharts.Theme|undefined}
         * @requires modules/themes
         * @since next
         */
        this.themes = new Themes(this);
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * Manages switch between themes, either for all charts or individual ones.
 *
 * @class
 * @name Highcharts.Themes
 *
 * @param {Highcharts.Chart} [chart]
 *        Specify a chart. (optional)
 *
 * @requires modules/themes
 * @since next
 */
class Themes {

    /* *
     *
     *  Static Function
     *
     * */

    /**
     * Adds a theme switch on chart level.
     *
     * @function Highcharts.Themes.compose
     *
     * @param {typeof_Highchart.Chart} ChartClass
     *        Chart class to add a chart-wide theme switch on.
     */
    public static compose(
        ChartClass: typeof Chart
    ): void {

        if (composedMembers.indexOf(ChartClass) === -1) {
            composedMembers.push(ChartClass);

            addEvent(ChartClass, 'init', onChartInit);
        }
    }

    /* *
     *
     *  Constructor
     *
     * */

    constructor(
        chart?: Chart
    ) {
        this._recovery = {};
        this.chart = chart;
    }

    /* *
     *
     *  Properties
     *
     * */

    /**
     * Recovery tree with options modified by the theme.
     * @private
     */
    private _recovery: Partial<Options>;

    /**
     * Related chart when using a chart-wide theme switch.
     * @name Highcharts.Themes#chart
     * @type {Highcharts.Chart|undefined}
     */
    public readonly chart?: Chart;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Creates recovery tree to undo theme changes.
     * @private
     */
    private createRecovery(
        theme: Partial<Options>,
        reference: Partial<Options>
    ): void {
        const recovery = this._recovery = {},
            saveChildren = (
                themeNode: AnyRecord,
                referenceNode: AnyRecord,
                recoveryNode: AnyRecord
            ): void => {
                for (const key in themeNode) {
                    if (
                        referenceNode[key] === null ||
                        typeof referenceNode[key] === 'undefined'
                    ) {
                        recoveryNode[key] = null;
                    } else if (referenceNode[key] instanceof Array) {
                        recoveryNode[key] = referenceNode[key].slice();
                    } else if (typeof referenceNode[key] === 'object') {
                        if (isObject(themeNode[key], true)) {
                            recoveryNode[key] = {};
                            saveChildren(
                                themeNode[key],
                                referenceNode[key],
                                recoveryNode[key]
                            );
                        } else {
                            recoveryNode[key] = merge(referenceNode[key]);
                        }
                    }
                }
            };

        saveChildren(theme, reference, recovery);
    }

    /**
     * Switch to a new theme and undo changes from previous theme.
     *
     * @function Highcharts.Themes#switchTheme
     *
     * @param {Partial<Highcharts.Options>} newTheme
     *        New theme options to switch to.
     */
    public switchTheme(
        newTheme: Partial<Options>
    ): void {
        if (this.chart) {
            this.chart.update(this._recovery, false, false, false);
            this.createRecovery(newTheme, this.chart.userOptions);
            this.chart.update(newTheme);
        } else {
            setOptions(this._recovery);
            this.createRecovery(newTheme, getOptions());
            setOptions(newTheme);
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Themes;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * This function will manage the recovery of original options when switching to
 * a new theme.
 *
 * @function Highcharts.switchTheme
 * @param {Partial<Highcharts.Options>} newTheme
 *        New theme to switch to.
 */

(''); // use strict
