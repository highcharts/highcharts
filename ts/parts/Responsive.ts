/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import H from './Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Chart {
            currentResponsive?: ResponsiveCurrentObject;
            currentOptions(options: Options): Options;
            matchResponsiveRule(
                rule: ResponsiveRulesOptions,
                matches: Array<string>
            ): void;
            setResponsive(redraw?: boolean, reset?: boolean): void;
        }
        interface Options {
            isResponsiveOptions?: boolean;
            responsive?: ResponsiveOptions;
        }
        interface ResponsiveCallbackFunction {
            (this: Highcharts.Chart): boolean;
        }
        interface ResponsiveOptions {
            rules?: Array<ResponsiveRulesOptions>;
        }
        interface ResponsiveRulesConditionOptions {
            callback?: ResponsiveCallbackFunction;
            maxHeight?: number;
            maxWidth?: number;
            minHeight?: number;
            minWidth?: number;
        }
        interface ResponsiveRulesOptions {
            _id?: string;
            chartOptions?: Options;
            condition?: ResponsiveRulesConditionOptions;
        }
        interface ResponsiveCurrentObject {
            mergedOptions: Options;
            ruleIds: string;
            undoOptions: Options;
        }
    }
}

/**
 * A callback function to gain complete control on when the responsive rule
 * applies.
 *
 * @callback Highcharts.ResponsiveCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        Chart context.
 *
 * @return {boolean}
 *         Return `true` if it applies.
 */

import './Chart.js';

import U from './Utilities.js';
const {
    isArray,
    isObject,
    objectEach,
    pick,
    splat
} = U;

var Chart = H.Chart;

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

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Update the chart based on the current chart/document size and options for
 * responsiveness.
 *
 * @private
 * @function Highcharts.Chart#setResponsive
 * @param  {boolean} [redraw=true]
 * @param  {boolean} [reset=false]
 *         Reset by un-applying all rules. Chart.update resets all rules before
 *         applying updated options.
 * @return {void}
 */
Chart.prototype.setResponsive = function (
    this: Highcharts.Chart,
    redraw?: boolean,
    reset?: boolean
): void {
    var options = this.options.responsive,
        ruleIds = [] as Array<string>,
        currentResponsive = this.currentResponsive,
        currentRuleIds,
        undoOptions;

    if (!reset && options && options.rules) {
        options.rules.forEach(function (
            rule: Highcharts.ResponsiveRulesOptions
        ): void {
            if (typeof rule._id === 'undefined') {
                rule._id = H.uniqueKey();
            }

            this.matchResponsiveRule(rule, ruleIds/* , redraw */);
        }, this);
    }

    // Merge matching rules
    var mergedOptions = H.merge.apply(0, ruleIds.map(function (
        ruleId: string
    ): (Highcharts.Options|undefined) {
        return (H.find(
            (options as any).rules as Array<Highcharts.ResponsiveRulesOptions>,
            function (rule: Highcharts.ResponsiveRulesOptions): boolean {
                return rule._id === ruleId;
            }
        ) as any).chartOptions;
    }) as any) as Highcharts.Options;

    mergedOptions.isResponsiveOptions = true;

    // Stringified key for the rules that currently apply.
    ruleIds = ((ruleIds.toString() as any) || void 0);
    currentRuleIds = currentResponsive && currentResponsive.ruleIds;

    // Changes in what rules apply
    if ((ruleIds as any) !== currentRuleIds) {

        // Undo previous rules. Before we apply a new set of rules, we need to
        // roll back completely to base options (#6291).
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
};

/**
 * Handle a single responsiveness rule.
 *
 * @private
 * @function Highcharts.Chart#matchResponsiveRule
 * @param {Highcharts.ResponsiveRulesOptions} rule
 * @param {Array<string>} matches
 * @return {void}
 */
Chart.prototype.matchResponsiveRule = function (
    this: Highcharts.Chart,
    rule: Highcharts.ResponsiveRulesOptions,
    matches: Array<string>
): void {

    var condition =
            rule.condition as Highcharts.ResponsiveRulesConditionOptions,
        fn = condition.callback || function (this: Highcharts.Chart): boolean {
            return (
                this.chartWidth <= pick(condition.maxWidth, Number.MAX_VALUE) &&
                this.chartHeight <=
                    pick(condition.maxHeight, Number.MAX_VALUE) &&
                this.chartWidth >= pick(condition.minWidth, 0) &&
                this.chartHeight >= pick(condition.minHeight, 0)
            );
        };

    if (fn.call(this)) {
        matches.push(rule._id as any);
    }
};

/**
 * Get the current values for a given set of options. Used before we update
 * the chart with a new responsiveness rule.
 * TODO: Restore axis options (by id?)
 *
 * @private
 * @function Highcharts.Chart#currentOptions
 * @param {Highcharts.Options} options
 * @return {Highcharts.Options}
 */
Chart.prototype.currentOptions = function (
    this: Highcharts.Chart,
    options: Highcharts.Options
): Highcharts.Options {

    var chart = this,
        ret = {} as Highcharts.Dictionary<any>;

    /**
     * Recurse over a set of options and its current values,
     * and store the current values in the ret object.
     */
    function getCurrent(
        options: Highcharts.Options,
        curr: Highcharts.Dictionary<any>,
        ret: Highcharts.Dictionary<any>,
        depth: number
    ): void {
        var i;

        objectEach(options, function (
            val: Highcharts.Dictionary<any>,
            key: string
        ): void {
            if (
                !depth &&
                chart.collectionsWithUpdate.indexOf(key) > -1
            ) {
                val = splat(val);

                ret[key] = [];

                // Iterate over collections like series, xAxis or yAxis and map
                // the items by index.
                for (i = 0; i < val.length; i++) {
                    if (curr[key][i]) { // Item exists in current data (#6347)
                        ret[key][i] = {};
                        getCurrent(
                            val[i],
                            curr[key][i],
                            ret[key][i],
                            depth + 1
                        );
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
};
