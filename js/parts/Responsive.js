/**
 * (c) 2010-2019 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * A callback function to gain complete control on when the responsive rule
 * applies.
 *
 * @callback Highcharts.ResponsiveCallbackFunction
 *
 * @return {boolean}
 *         Return `true` if it applies.
 */

'use strict';

import H from './Globals.js';
import './Chart.js';
import './Utilities.js';

var Chart = H.Chart,
    isArray = H.isArray,
    isObject = H.isObject,
    pick = H.pick,
    splat = H.splat;

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
 * against other metrics than the chart size, or example the document
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

/**
 * Update the chart based on the current chart/document size and options for
 * responsiveness.
 *
 * @private
 * @function Highcharts.Chart#setResponsive
 *
 * @param  {boolean} [redraw=true]
 * @param  {Array} [reset=false]
 *         Reset by un-applying all rules. Chart.update resets all rules before
 *         applying updated options.
 */
Chart.prototype.setResponsive = function (redraw, reset) {
    var options = this.options.responsive,
        ruleIds = [],
        currentResponsive = this.currentResponsive,
        currentRuleIds,
        undoOptions;

    if (!reset && options && options.rules) {
        options.rules.forEach(function (rule) {
            if (rule._id === undefined) {
                rule._id = H.uniqueKey();
            }

            this.matchResponsiveRule(rule, ruleIds, redraw);
        }, this);
    }

    // Merge matching rules
    var mergedOptions = H.merge.apply(0, ruleIds.map(function (ruleId) {
        return H.find(options.rules, function (rule) {
            return rule._id === ruleId;
        }).chartOptions;
    }));

    mergedOptions.isResponsiveOptions = true;

    // Stringified key for the rules that currently apply.
    ruleIds = ruleIds.toString() || undefined;
    currentRuleIds = currentResponsive && currentResponsive.ruleIds;

    // Changes in what rules apply
    if (ruleIds !== currentRuleIds) {

        // Undo previous rules. Before we apply a new set of rules, we need to
        // roll back completely to base options (#6291).
        if (currentResponsive) {
            this.update(currentResponsive.undoOptions, redraw);
        }

        if (ruleIds) {
            // Get undo-options for matching rules
            undoOptions = this.currentOptions(mergedOptions);
            undoOptions.isResponsiveOptions = true;
            this.currentResponsive = {
                ruleIds: ruleIds,
                mergedOptions: mergedOptions,
                undoOptions: undoOptions
            };

            this.update(mergedOptions, redraw);

        } else {
            this.currentResponsive = undefined;
        }
    }
};

/**
 * Handle a single responsiveness rule.
 *
 * @private
 * @function Highcharts.Chart#matchResponsiveRule
 *
 * @param {Highcharts.ResponsiveRulesConditionOptions} rule
 *
 * @param {Array<number>} matches
 */
Chart.prototype.matchResponsiveRule = function (rule, matches) {

    var condition = rule.condition,
        fn = condition.callback || function () {
            return (
                this.chartWidth <= pick(condition.maxWidth, Number.MAX_VALUE) &&
                this.chartHeight <=
                    pick(condition.maxHeight, Number.MAX_VALUE) &&
                this.chartWidth >= pick(condition.minWidth, 0) &&
                this.chartHeight >= pick(condition.minHeight, 0)
            );
        };

    if (fn.call(this)) {
        matches.push(rule._id);
    }
};

/**
 * Get the current values for a given set of options. Used before we update
 * the chart with a new responsiveness rule.
 * TODO: Restore axis options (by id?)
 *
 * @private
 * @function Highcharts.Chart#currentOptions
 *
 * @param {Highcharts.Options} options
 *
 * @return {Highcharts.Options}
 */
Chart.prototype.currentOptions = function (options) {

    var ret = {};

    /**
     * Recurse over a set of options and its current values,
     * and store the current values in the ret object.
     */
    function getCurrent(options, curr, ret, depth) {
        var i;

        H.objectEach(options, function (val, key) {
            if (!depth && ['series', 'xAxis', 'yAxis'].indexOf(key) > -1) {
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
            } else {
                ret[key] = curr[key] || null;
            }
        });
    }

    getCurrent(options, this.options, ret, 0);
    return ret;
};
