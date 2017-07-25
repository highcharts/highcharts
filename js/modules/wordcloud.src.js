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
	merge = H.merge,
	Series = H.Series,
	maxFontSize = 100;


/**
 * isRectanglesIntersecting - Detects if there is a collision between two
 *     rectangles.
 *
 * @param  {object} r1 First rectangle.
 * @param  {object} r2 Second rectangle.
 * @return {boolean} Returns true if the rectangles overlap.
 */
var isRectanglesIntersecting = function isRectanglesIntersecting(r1, r2) {
	return !(
		r2.left > r1.right ||
		r2.right < r1.left ||
		r2.top > r1.bottom ||
		r2.bottom < r1.top
	);
};

/**
 * intersectsAnyWord - Detects if a word collides with any previously placed
 *     words.
 *
 * @param  {Point} point Point which the word is connected to.
 * @return {boolean} Returns true if there is collision.
 */
var intersectsAnyWord = function intersectsAnyWord(point, points) {
	var intersects = false,
		rect1 = point.graphic.element.getBoundingClientRect(),
		rect2;
	if (point.lastCollidedWith) {
		rect2 = point.lastCollidedWith.graphic.element.getBoundingClientRect();
		intersects = isRectanglesIntersecting(rect1, rect2);
		// If they no longer intersects, remove the cache from the point.
		if (!intersects) {
			delete point.lastCollidedWith;
		}
	}
	if (!intersects) {
		intersects = !!H.find(points, function (p) {
			var result;
			rect2 = p.graphic.element.getBoundingClientRect();
			result = isRectanglesIntersecting(rect1, rect2);
			if (result) {
				point.lastCollidedWith = p;
			}
			return result;
		});
	}
	return intersects;
};


/**
 * archimedeanSpiral - Gives a set of cordinates for an Archimedian Spiral.
 *
 * @param  {type} t
 * @return {object} Resulting coordinates, x and y.
 */
var archimedeanSpiral = function archimedeanSpiral(t) {
	t *= 0.1;
	return {
		x: t * Math.cos(t),
		y: t * Math.sin(t)
	};
};

/**
 * getRandomPosition
 *
 * @param  {number} size
 * @return {number}
 */
var getRandomPosition = function getRandomPosition(size) {
	return Math.round((size * (Math.random() + 0.5)) / 2);
};

var WordCloudOptions = {
	borderWidth: 0,
	clip: false, // Something goes wrong with clip. // TODO fix this
	colorByPoint: true,
	showInLegend: false,
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
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			chart = series.chart,
			placed = [],
			yValues = series.points.map(function (p) {
				return p.y;
			}),
			maxY = Math.max.apply(null, yValues),
			maxDelta = (xAxis.len * xAxis.len) + (yAxis.len * yAxis.len),
			data = series.points
			.map(function (p) {
				var weight = 1 / maxY * p.y;
				return merge(p, {
					fontFamily: 'Impact',
					fontSize: Math.floor(maxFontSize * p.weight),
					rotation: Math.floor(Math.random() * 2) * 90,
					weight: weight
				});
			})
			.sort(function (a, b) {
				return b.y - a.y; // Sort descending
			});
		each(data, function (point) {
			var attempt = 0,
				delta,
				outOfRange = false,
				x = getRandomPosition(xAxis.len) - (xAxis.len / 2),
				y = getRandomPosition(yAxis.len) - (yAxis.len / 2);
			if (!point.graphic) {
				point.graphic = chart.renderer.text(point.name).css({
					fontSize: point.fontSize,
					fill: point.color,
					fontFamily: point.fontFamily
				}).attr({
					x: x,
					y: y,
					'text-anchor': 'middle',
					rotation: point.rotation
				}).add(series.group);
			}
			/**
			 * while word intersects any previously placed words:
			 *     move word a little bit along a spiral path
			 */
			while (intersectsAnyWord(point, placed) && !outOfRange) {
				delta = archimedeanSpiral(attempt);
				point.graphic.attr({
					x: x + delta.x,
					y: y + delta.y
				});
				outOfRange = Math.min(Math.abs(delta.x), Math.abs(delta.y)) >= maxDelta;
				attempt++;
			}
			if (outOfRange) {
				point.graphic = point.graphic.destroy();
			} else {
				placed.push(point);
			}
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
