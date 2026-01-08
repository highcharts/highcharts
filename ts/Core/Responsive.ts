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

import type Chart from './Chart/Chart.js';
import type GlobalOptions from './Options';

import U from './Utilities.js';
const {
    diffObjects,
    extend,
    find,
    merge,
    pick,
    uniqueKey
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module './Chart/ChartBase' {
    interface ChartBase {
        /** @requires Core/Responsive */
        setResponsive(redraw?: boolean, reset?: boolean): void;
    }
}

declare module './Options' {
    interface Options {
        /** @internal */
        isResponsiveOptions?: boolean;
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
         */
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

    /** @internal */
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
        /**
         * A flag to prevent responsive updates from running recursively.
         */
        updatingResponsive: boolean;
    }

    /** @internal */
    export interface CurrentObject {
        /**
         * The merged chart options from active rules.
         */
        mergedOptions: Partial<GlobalOptions>;
        /**
         * A stringified key of the rules that currently apply.
         */
        ruleIds: string;
        /**
         * The options to revert to when the rules are no longer active.
         */
        undoOptions: Partial<GlobalOptions>;
    }

    export interface Options {
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
         * @since     5.0.0
         */
        rules?: Array<RuleOptions>;
    }

    export interface RuleConditionOptions {
        /**
         * A callback function to gain complete control on when the responsive
         * rule applies. Return `true` if it applies. This opens for checking
         * against other metrics than the chart size, for example the document
         * size or other elements.
         *
         * @since     5.0.0
         * @context   Highcharts.Chart
         */
        callback?: CallbackFunction;
        /**
         * The responsive rule applies if the chart height is less than this.
         *
         * @since     5.0.0
         */
        maxHeight?: number;
        /**
         * The responsive rule applies if the chart width is less than this.
         *
         * @sample highcharts/responsive/axis/
         *         Max width is 500
         *
         * @since     5.0.0
         */
        maxWidth?: number;
        /**
         * The responsive rule applies if the chart height is greater than this.
         *
         * @default   0
         * @since     5.0.0
         */
        minHeight?: number;
        /**
         * The responsive rule applies if the chart width is greater than this.
         *
         * @default   0
         * @since     5.0.0
         */
        minWidth?: number;
    }

    export interface RuleOptions {
        /**
         * Unique rule id.
         * @internal
         */
        _id?: string;
        /**
         * A full set of chart options to apply as overrides to the general
         * chart options. The chart options are applied when the given rule
         * is active.
         *
         * A special case is configuration objects that take arrays, for example
         * [xAxis](#xAxis), [yAxis](#yAxis) or [series](#series). For these
         * collections, an `id` option is used to map the new option set to
         * an existing object. If an existing object of the same id is not
         * found, the item of the same index updated. So for example, setting
         * `chartOptions` with two series items without an `id`, will cause the
         * existing chart's two series to be updated with respective options.
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
         */
        chartOptions?: GlobalOptions;
        /**
         * Under which conditions the rule applies.
         *
         * @since     5.0.0
         */
        condition: RuleConditionOptions;
    }

    /* *
     *
     *  Functions
     *
     * */

    /** @internal */
    export function compose<T extends typeof Chart>(
        ChartClass: T
    ): (T&typeof Composition) {
        const chartProto = ChartClass.prototype as Composition;

        if (!chartProto.matchResponsiveRule) {
            extend(chartProto, {
                matchResponsiveRule,
                setResponsive
            });
        }

        return ChartClass as (T&typeof Composition);
    }

    /**
     * Handle a single responsiveness rule.
     *
     * @internal
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
     * @internal
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
                    options?.rules || [],
                    (rule): boolean => (rule._id === ruleId)
                ))
                .map((rule): (GlobalOptions|undefined) => rule?.chartOptions)
        );

        mergedOptions.isResponsiveOptions = true;

        // Stringified key for the rules that currently apply.
        ruleIds = ((ruleIds.toString() as any) || void 0);
        const currentRuleIds = currentResponsive?.ruleIds;

        // Changes in what rules apply
        if ((ruleIds as any) !== currentRuleIds) {

            // Undo previous rules. Before we apply a new set of rules, we
            // need to roll back completely to base options (#6291).
            if (currentResponsive) {
                this.currentResponsive = void 0;
                this.updatingResponsive = true;
                this.update(currentResponsive.undoOptions, redraw, true);
                this.updatingResponsive = false;
            }

            if (ruleIds) {
                // Get undo-options for matching rules. The `undoOptions``
                // hold the current values before they are changed by the
                // `mergedOptions`.
                undoOptions = diffObjects(
                    mergedOptions,
                    this.options,
                    true,
                    this.collectionsWithUpdate
                );
                undoOptions.isResponsiveOptions = true;
                this.currentResponsive = {
                    ruleIds: ruleIds as any,
                    mergedOptions: mergedOptions,
                    undoOptions: undoOptions
                };
                if (!this.updatingResponsive) {
                    this.update(mergedOptions, redraw, true);
                }
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

(''); // Keeps doclets above in JS file

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
 * the item of the same index updated. So for example, setting `chartOptions`
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

(''); // Keeps doclets above in JS file
