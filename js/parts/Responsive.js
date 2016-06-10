(function (H) {

	var Chart = H.Chart,
		each = H.each,
		isObject = H.isObject;

/**
 * Update the chart based on the current chart/document size and options for responsiveness
 */
Chart.prototype.setResponsive = function () {
	var options = this.options.responsive;

	each(options.rules, function (rule) {
		this.matchResponsiveRule(rule);
	}, this);
};

/**
 * Handle a single responsiveness rule
 */
Chart.prototype.matchResponsiveRule = function (rule) {
	var respRules = this.respRules,
		condition = rule.condition,
		matches,
		fn = rule.callback || new Function('return ' + condition.key + condition.operator + condition.value); // eslint-disable-line no-new-func
		

	if (rule._id === undefined) {
		rule._id = H.idCounter++;
	}
	matches = fn.call(this);

	// Apply a rule
	if (!respRules[rule._id] && matches) {

		// Store the current state of the options
		respRules[rule._id] = this.currentOptions(rule.chartOptions);
		this.update(rule.chartOptions);

	// Unapply a rule based on the previous options before the rule
	// was applied
	} else if (respRules[rule._id] && !matches) {
		this.update(respRules[rule._id]);
		delete respRules[rule._id];
	}
};

/**
 * Get the current values for a given set of options. Used before we update
 * the chart with a new responsiveness rule.
 */
Chart.prototype.currentOptions = function (options) {

	var ret = {};

	/**
	 * Recurse over a set of options and its current values,
	 * and store the current values in the ret object.
	 */
	function getCurrent(options, curr, ret) {
		var key;
		for (key in options) {
			if (isObject(options[key])) {
				ret[key] = {};
				getCurrent(options[key], curr[key], ret[key]);
			} else {
				ret[key] = curr[key];
			}
		}
	}
	getCurrent(options, this.options, ret);
	return ret;
};

}(Highcharts));
