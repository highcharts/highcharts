/**
 * (c) 2010-2016 Torstein Honsi
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
	isObject = H.isObject,
	pick = H.pick,
	splat = H.splat;

/**
 * Update the chart based on the current chart/document size and options for responsiveness
 */
Chart.prototype.setResponsive = function (redraw) {
	var options = this.options.responsive;

	if (options && options.rules) {
		each(options.rules, function (rule) {
			this.matchResponsiveRule(rule, redraw);
		}, this);
	}
};

/**
 * Handle a single responsiveness rule
 */
Chart.prototype.matchResponsiveRule = function (rule, redraw) {
	var respRules = this.respRules,
		condition = rule.condition,
		matches,
		fn = condition.callback || function () {
			return this.chartWidth <= pick(condition.maxWidth, Number.MAX_VALUE) &&
				this.chartHeight <= pick(condition.maxHeight, Number.MAX_VALUE) &&
				this.chartWidth >= pick(condition.minWidth, 0) &&
				this.chartHeight >= pick(condition.minHeight, 0);
		};
		

	if (rule._id === undefined) {
		rule._id = H.uniqueKey();
	}
	matches = fn.call(this);

	// Apply a rule
	if (!respRules[rule._id] && matches) {

		// Store the current state of the options
		if (rule.chartOptions) {
			respRules[rule._id] = this.currentOptions(rule.chartOptions);
			this.update(rule.chartOptions, redraw);
		}

	// Unapply a rule based on the previous options before the rule
	// was applied
	} else if (respRules[rule._id] && !matches) {
		this.update(respRules[rule._id], redraw);
		delete respRules[rule._id];
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
		var key, i;
		for (key in options) {
			if (!depth && inArray(key, ['series', 'xAxis', 'yAxis']) > -1) {
				options[key] = splat(options[key]);
			
				ret[key] = [];
				for (i = 0; i < options[key].length; i++) {
					ret[key][i] = {};
					getCurrent(
						options[key][i],
						curr[key][i],
						ret[key][i],
						depth + 1
					);
				}
			} else if (isObject(options[key])) {
				ret[key] = {};
				getCurrent(
					options[key],
					curr[key] || {},
					ret[key],
					depth + 1
				);
			} else {
				ret[key] = curr[key] || null;
			}
		}
	}

	getCurrent(options, this.options, ret, 0);
	return ret;
};
