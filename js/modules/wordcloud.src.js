/**
 * (c) 2016 Highsoft AS
 * Authors: Jon Arild Nygard
 *
 * License: www.highcharts.com/license
 *
 * This is an experimental Highcharts module which enables visualization
 * of a word cloud.
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Series.js';
var each = H.each,
	Series = H.Series;

var WordCloudOptions = {
	borderWidth: 0,
	tooltip: {
		followPointer: true
	}
};
var WordCloudSeries = {
	animate: Series.prototype.animate,
	bindAxes: function () {
		var wordcloudAxis = {
			endOnTick: false,
			gridLineWidth: 0,
			lineWidth: 0,
			maxPadding: 0,
			startOnTick: false,
			title: null,
			tickPositions: []
		};
		Series.prototype.bindAxes.call(this);
		H.extend(this.yAxis.options, wordcloudAxis);
		H.extend(this.xAxis.options, wordcloudAxis);
	},
	// series prototype
	drawPoints: function () {
		var series = this,
			chart = series.chart;
		each(this.points, function (point) {
			if (!point.graphic) {
				point.graphic = chart.renderer.text(point.name).css({
					fontSize: point.y * 10
				})
				.add(series.group);
			}
			point.graphic.attr({
				'text-anchor': 'middle'
			});
		});
	},
	getPlotBox: function () {
		var series = this,
			chart = series.chart,
			inverted = chart.inverted,
			// Swap axes for inverted (#2339)
			xAxis = series[(inverted ? 'yAxis' : 'xAxis')],
			yAxis = series[(inverted ? 'xAxis' : 'yAxis')],
			width = xAxis ? xAxis.len : chart.plotWidth,
			height = yAxis ? yAxis.len : chart.plotHeight,
			x = xAxis ? xAxis.left : chart.plotLeft,
			y = yAxis ? yAxis.top : chart.plotTop;
		return {
			translateX: x + (width / 2),
			translateY: y + (height / 2),
			scaleX: 1, // #1623
			scaleY: 1
		};
	}
};

H.seriesType('wordcloud', 'column', WordCloudOptions, WordCloudSeries);
