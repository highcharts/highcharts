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
	Series = H.Series,
	defaultOptions;

var WordCloudOptions = {
	borderWidth: 0,
	tooltip: {
		followPointer: true
	}
};
var WordCloudSeries = {
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
			chart = this.chart;
		each(this.points, function (point) {
			if (!point.graphic) {
				point.graphic = chart.renderer.text(point.name).css({
					fontSize: point.y * 10
				})
				.add(series.group);
			}
			/*point.graphic.attr({
			x: 10,
			y: 30 + 30 * i,
			rotation: (i % 2) * 90
			});
			/*
			point.graphic

			console.log('bBox', point.graphic.getBBox());

			point.graphic.attr(series.pointAttribs(point, point.selected && 'select'))*/
		});
	}
};

H.seriesType('wordcloud', 'column', WordCloudOptions, WordCloudSeries);
