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

import type Chart from './Chart/Chart.js';
import type GlobalOptions from './Options';

import U from './Utilities.js';
const {
    extend,
    find,
    isArray,
    isObject,
    merge,
    objectEach,
    pick,
    splat,
    uniqueKey
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './Chart/ChartLike' {
    interface ChartLike {
        /** @requires Core/Responsive */
        setResponsive(redraw?: boolean, reset?: boolean): void;
    }
}

declare module './Options' {
    interface Options {
        isResponsiveOptions?: boolean;
        responsive?: Responsive.Options;
    }
}

/* *
 *
 *  Composition
 *
 * */

namespace Responsive {

    /* *
     *
     *  Declarations
     *
     * */

    export interface CallbackFunction {
        (this: Chart): boolean;
    }

    export declare class Composition extends Chart {
        /** @requires Core/Responsive */
        currentResponsive?: CurrentObject;
        /** @requires Core/Responsive */
        currentOptions(
            options: Partial<GlobalOptions>
        ): Partial<GlobalOptions>;
        /** @requires Core/Responsive */
        matchResponsiveRule(
            rule: RuleOptions,
            matches: Array<string>
        ): void;
        /** @requires Core/Responsive */
        setResponsive(redraw?: boolean, reset?: boolean): void;
    }

    export interface CurrentObject {
        mergedOptions: Partial<GlobalOptions>;
        ruleIds: string;
        undoOptions: Partial<GlobalOptions>;
    }

    export interface Options {
        rules?: Array<RuleOptions>;
    }

    export interface RuleConditionOptions {
        callback?: CallbackFunction;
        maxHeight?: number;
        maxWidth?: number;
        minHeight?: number;
        minWidth?: number;
    }

    export interface RuleOptions {
        _id?: string;
        chartOptions?: GlobalOptions;
        condition: RuleConditionOptions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose<T extends typeof Chart>(
        ChartClass: T
    ): (T&typeof Composition) {

        if (U.pushUnique(composedMembers, ChartClass)) {
            extend(
                ChartClass.prototype as Composition,
                {
                    currentOptions,
                    matchResponsiveRule,
                    setResponsive
                }
            );
        }

        return ChartClass as (T&typeof Composition);
    }

    /**
     * Get the current values for a given set of options. Used before we
     * update the chart with a new responsiveness rule.
     *
     * @todo Restore axis options (by id?). The matching of items in
     * collections bears resemblance to the oneToOne matching in
     * Chart.update. Probably we can refactor out that matching and reuse it
     * in both functions.
     *
     * @private
     * @function Highcharts.Chart#currentOptions
     */
    function currentOptions(
        this: Composition,
        options: GlobalOptions
    ): Partial<GlobalOptions> {

        const chart = this,
            ret = {};

        /**
         * Recurse over a set of options and its current values,
         * and store the current values in the ret object.
         */
        function getCurrent(
            options: AnyRecord,
            curr: AnyRecord,
            ret: AnyRecord,
            depth: number
        ): void {
            let i;

            objectEach(options, function (val, key): void {
                if (
                    !depth &&
                    chart.collectionsWithUpdate.indexOf(key) > -1 &&
                    curr[key]
                ) {
                    val = splat(val);

                    ret[key] = [];

                    // Iterate over collections like series, xAxis or yAxis
                    // and map the items by index.
                    for (
                        i = 0;
                        i < Math.max(val.length, curr[key].length);
                        i++
                    ) {

                        // Item exists in current data (#6347)
                        if (curr[key][i]) {
                            // If the item is missing from the new data, we
                            // need to save the whole config structure. Like
                            // when responsively updating from a dual axis
                            // layout to a single axis and back (#13544).
                            if (val[i] === void 0) {
                                ret[key][i] = curr[key][i];

                            // Otherwise, proceed
                            } else {
                                ret[key][i] = {};
                                getCurrent(
                                    val[i],
                                    curr[key][i],
                                    ret[key][i],
                                    depth + 1
                                );
                            }
                        }
                    }
                } else if (isObject(val)) {
                    ret[key] = isArray(val) ? [] : {};
                    getCurrent(val, curr[key] || {}, ret[key], depth + 1);
                } else if (typeof curr[key] === 'undefined') { // #10286
                    ret[key] = null;
                } else {
                    ret[key] = curr[key];
                }
            });
        }

        getCurrent(options, this.options, ret, 0);

        return ret;
    }

    /**
     * Handle a single responsiveness rule.
     *
     * @private
     * @function Highcharts.Chart#matchResponsiveRule
     * @param {Highcharts.ResponsiveRulesOptions} rule
     * @param {Array<string>} matches
     */
    function matchResponsiveRule(
        this: Composition,
        rule: RuleOptions,
        matches: Array<string>
    ): void {

        const condition = rule.condition,
            fn = condition.callback || function (this: Chart): boolean {
                return (
                    this.chartWidth <= pick(
                        condition.maxWidth,
                        Number.MAX_VALUE
                    ) &&
                    this.chartHeight <= pick(
                        condition.maxHeight,
                        Number.MAX_VALUE
                    ) &&
                    this.chartWidth >= pick(condition.minWidth, 0) &&
                    this.chartHeight >= pick(condition.minHeight, 0)
                );
            };

        if (fn.call(this)) {
            matches.push(rule._id as any);
        }
    }

    /**
     * Update the chart based on the current chart/document size and options
     * for responsiveness.
     *
     * @private
     * @function Highcharts.Chart#setResponsive
     * @param  {boolean} [redraw=true]
     * @param  {boolean} [reset=false]
     * Reset by un-applying all rules. Chart.update resets all rules before
     * applying updated options.
     */
    function setResponsive(
        this: Composition,
        redraw?: boolean,
        reset?: boolean
    ): void {
        const options = this.options.responsive,
            currentResponsive = this.currentResponsive;

        let ruleIds = [] as Array<string>,
            undoOptions;

        if (!reset && options && options.rules) {
            options.rules.forEach((rule): void => {
                if (typeof rule._id === 'undefined') {
                    rule._id = uniqueKey();
                }

                this.matchResponsiveRule(rule, ruleIds/* , redraw */);
            }, this);
        }

        // Merge matching rules
        const mergedOptions = merge(
            ...ruleIds
                .map((ruleId): (RuleOptions|undefined) => find(
                    (options || {}).rules || [],
                    (rule): boolean => (rule._id === ruleId)
                ))
                .map((rule): (GlobalOptions|undefined) => (
                    rule && rule.chartOptions
                ))
        );

        mergedOptions.isResponsiveOptions = true;

        // Stringified key for the rules that currently apply.
        ruleIds = ((ruleIds.toString() as any) || void 0);
        const currentRuleIds = (
            currentResponsive && currentResponsive.ruleIds
        );

        // Changes in what rules apply
        if ((ruleIds as any) !== currentRuleIds) {

            // Undo previous rules. Before we apply a new set of rules, we
            // need to roll back completely to base options (#6291).
            if (currentResponsive) {
                this.update(currentResponsive.undoOptions, redraw, true);
            }

            if (ruleIds) {
                // Get undo-options for matching rules
                undoOptions = this.currentOptions(mergedOptions);
                undoOptions.isResponsiveOptions = true;
                this.currentResponsive = {
                    ruleIds: ruleIds as any,
                    mergedOptions: mergedOptions,
                    undoOptions: undoOptions
                };

                this.update(mergedOptions, redraw, true);

            } else {
                this.currentResponsive = void 0;
            }
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default Responsive;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * A callback function to gain complete control on when the responsive rule
 * applies.
 *
 * @callback Highcharts.ResponsiveCallbackFunction
 *
 * @param {Highcharts.Chart} this
 * Chart context.
 *
 * @return {boolean}
 * Return `true` if it applies.
 */

(''); // keeps doclets above in JS file

/* *
 *
 *  API Options
 *
 * */

/**
 * Allows setting a set of rules to apply for different screen or chart
 * sizes. Each rule specifies additional chart options.
 *
 * @sample {highstock} stock/demo/responsive/
 *         Stock chart
 * @sample highcharts/responsive/axis/
 *         Axis
 * @sample highcharts/responsive/legend/
 *         Legend
 * @sample highcharts/responsive/classname/
 *         Class name
 *
 * @since     5.0.0
 * @apioption responsive
 */

/**
 * A set of rules for responsive settings. The rules are executed from
 * the top down.
 *
 * @sample {highcharts} highcharts/responsive/axis/
 *         Axis changes
 * @sample {highstock} highcharts/responsive/axis/
 *         Axis changes
 * @sample {highmaps} highcharts/responsive/axis/
 *         Axis changes
 *
 * @type      {Array<*>}
 * @since     5.0.0
 * @apioption responsive.rules
 */

/**
 * A full set of chart options to apply as overrides to the general
 * chart options. The chart options are applied when the given rule
 * is active.
 *
 * A special case is configuration objects that take arrays, for example
 * [xAxis](#xAxis), [yAxis](#yAxis) or [series](#series). For these
 * collections, an `id` option is used to map the new option set to
 * an existing object. If an existing object of the same id is not found,
 * the item of the same indexupdated. So for example, setting `chartOptions`
 * with two series items without an `id`, will cause the existing chart's
 * two series to be updated with respective options.
 *
 * @sample {highstock} stock/demo/responsive/
 *         Stock chart
 * @sample highcharts/responsive/axis/
 *         Axis
 * @sample highcharts/responsive/legend/
 *         Legend
 * @sample highcharts/responsive/classname/
 *         Class name
 *
 * @type      {Highcharts.Options}
 * @since     5.0.0
 * @apioption responsive.rules.chartOptions
 */

/**
 * Under which conditions the rule applies.
 *
 * @since     5.0.0
 * @apioption responsive.rules.condition
 */

/**
 * A callback function to gain complete control on when the responsive
 * rule applies. Return `true` if it applies. This opens for checking
 * against other metrics than the chart size, for example the document
 * size or other elements.
 *
 * @type      {Highcharts.ResponsiveCallbackFunction}
 * @since     5.0.0
 * @context   Highcharts.Chart
 * @apioption responsive.rules.condition.callback
 */

/**
 * The responsive rule applies if the chart height is less than this.
 *
 * @type      {number}
 * @since     5.0.0
 * @apioption responsive.rules.condition.maxHeight
 */

/**
 * The responsive rule applies if the chart width is less than this.
 *
 * @sample highcharts/responsive/axis/
 *         Max width is 500
 *
 * @type      {number}
 * @since     5.0.0
 * @apioption responsive.rules.condition.maxWidth
 */

/**
 * The responsive rule applies if the chart height is greater than this.
 *
 * @type      {number}
 * @default   0
 * @since     5.0.0
 * @apioption responsive.rules.condition.minHeight
 */

/**
 * The responsive rule applies if the chart width is greater than this.
 *
 * @type      {number}
 * @default   0
 * @since     5.0.0
 * @apioption responsive.rules.condition.minWidth
 */

(''); // keeps doclets above in JS file
