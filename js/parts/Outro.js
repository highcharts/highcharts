
		return Highcharts;
	} // End of init function

	if (typeof define === 'function' && define.amd) {
		define('highcharts', ['jquery'], init);
	} else {
		window.Highcharts = window.Highcharts ? error(16, true) : init(window.jQuery);
	}
}());
