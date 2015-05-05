/* ****************************************************************************
 * Start error bar series code                                                *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.errorbar = Highcharts.merge(defaultPlotOptions.boxplot, {
	color: '#000000',
	grouping: false,
	linkedTo: ':previous',
	tooltip: {
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>' // docs
	},
	whiskerWidth: null
});

// 2 - Create the series object
Highcharts.seriesTypes.errorbar = Highcharts.extendClass(Highcharts.seriesTypes.boxplot, {
	type: 'errorbar',
	pointArrayMap: ['low', 'high'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.low, point.high];
	},
	pointValKey: 'high', // defines the top of the tracker
	doQuartiles: false,
	drawDataLabels: Highcharts.seriesTypes.arearange ? Highcharts.seriesTypes.arearange.prototype.drawDataLabels : Highcharts.noop,

	/**
	 * Get the width and X offset, either on top of the linked series column
	 * or standalone
	 */
	getColumnMetrics: function () {
		return (this.linkedParent && this.linkedParent.columnMetrics) || 
			Highcharts.seriesTypes.column.prototype.getColumnMetrics.call(this);
	}
});

/* ****************************************************************************
 * End error bar series code                                                  *
 *****************************************************************************/
