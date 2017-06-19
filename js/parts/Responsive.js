/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Chart.js';
import './Utilities.js';
var Chart = H.Chart,
	each = H.each,
	inArray = H.inArray,
	isArray = H.isArray,
	isObject = H.isObject,
	pick = H.pick,
	splat = H.splat;

/**
 * Update the chart based on the current chart/document size and options for
 * responsiveness.
 */
Chart.prototype.setResponsive = function (redraw) {
	var options = this.options.responsive,
		ruleIds = [],
		currentResponsive = this.currentResponsive,
		currentRuleIds;

	if (options && options.rules) {
		each(options.rules, function (rule) {
			if (rule._id === undefined) {
				rule._id = H.uniqueKey();
			}
			
			this.matchResponsiveRule(rule, ruleIds, redraw);
		}, this);
	}

	// Merge matching rules
	var mergedOptions = H.merge.apply(0, H.map(ruleIds, function (ruleId) {
		return H.find(options.rules, function (rule) {
			return rule._id === ruleId;
		}).chartOptions;
	}));

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
			this.currentResponsive = {
				ruleIds: ruleIds,
				mergedOptions: mergedOptions,
				undoOptions: this.currentOptions(mergedOptions)
			};

			this.update(mergedOptions, redraw);
		
		} else {
			this.currentResponsive = undefined;	
		}
	}
};

/**
 * Handle a single responsiveness rule
 */
Chart.prototype.matchResponsiveRule = function (rule, matches) {
	var condition = rule.condition,
		fn = condition.callback || function () {
			return this.chartWidth <= pick(condition.maxWidth, Number.MAX_VALUE) &&
				this.chartHeight <= pick(condition.maxHeight, Number.MAX_VALUE) &&
				this.chartWidth >= pick(condition.minWidth, 0) &&
				this.chartHeight >= pick(condition.minHeight, 0);
		};		

	if (fn.call(this)) {
		matches.push(rule._id);
	}

};

/**
 * Get the current values for a given set of options. Used before we update
 * the chart with a new responsiveness rule.
 * TODO: Restore axis options (by id?)
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
			if (!depth && inArray(key, ['series', 'xAxis', 'yAxis']) > -1) {
				options[key] = splat(options[key]);
				
				ret[key] = [];
				
				// Iterate over collections like series, xAxis or yAxis and map
				// the items by index.
				for (i = 0; i < options[key].length; i++) {
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
