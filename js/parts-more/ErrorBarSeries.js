'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import './BoxPlotSeries.js';
	var noop = H.noop,
		seriesType = H.seriesType,
		seriesTypes = H.seriesTypes;


/* ****************************************************************************
 * Start error bar series code                                                *
 *****************************************************************************/
seriesType('errorbar', 'boxplot', {
	/*= if (build.classic) { =*/
	color: '${palette.errorBarColor}',
	/*= } =*/
	grouping: false,
	linkedTo: ':previous',
	tooltip: {
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
	},
	whiskerWidth: null

// Prototype members
}, {
	type: 'errorbar',
	pointArrayMap: ['low', 'high'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.low, point.high];
	},
	pointValKey: 'high', // defines the top of the tracker
	doQuartiles: false,
	drawDataLabels: seriesTypes.arearange ? seriesTypes.arearange.prototype.drawDataLabels : noop,

	/**
	 * Get the width and X offset, either on top of the linked series column
	 * or standalone
	 */
	getColumnMetrics: function () {
		return (this.linkedParent && this.linkedParent.columnMetrics) ||
			seriesTypes.column.prototype.getColumnMetrics.call(this);
	}
});

/* ****************************************************************************
 * End error bar series code                                                  *
 *****************************************************************************/
