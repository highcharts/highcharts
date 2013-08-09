<?php
function getFramework($framework) {
	if ($framework === 'nolib') {
		return '
			<script src="http://code.highcharts.local/adapters/nolib-adapter.src.js"></script>
			<script src="http://code.jquery.com/jquery-1.10.1.js"></script>
			<script>
			/**
			 * Register Highcharts as a plugin in the respective framework
			 */
			$.fn.highcharts = function () {
				var constr = "Chart", // default constructor
					args = arguments,
					options,
					ret,
					chart;

				if (typeof args[0] === "string") {
					constr = args[0];
					args = Array.prototype.slice.call(args, 1); 
				}
				options = args[0];

				// Create the chart
				if (options !== undefined) {
					options.chart = options.chart || {};
					options.chart.renderTo = this[0];
					chart = new Highcharts[constr](options, args[1]);
					ret = this;
				}

				// When called without parameters or with the return argument, get a predefined chart
				if (options === undefined) {
					ret = Highcharts.charts[attr(this[0], "data-highcharts-chart")];
				}	

				return ret;
			};


			</script>
		';

	} else {
		return '
			<script src="http://code.jquery.com/jquery-1.10.1.js"></script>
		';
	}
}
?>