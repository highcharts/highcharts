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
	extend = H.extend,
	Series = H.Series,
	maxFontSize = 25,
	field = {
		width: 256,
		height: 256
	};


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
		rect1 = point.rect,
		rect2;
	if (point.lastCollidedWith) {
		rect2 = point.lastCollidedWith.rect;
		intersects = isRectanglesIntersecting(rect1, rect2);
		// If they no longer intersects, remove the cache from the point.
		if (!intersects) {
			delete point.lastCollidedWith;
		}
	}
	if (!intersects) {
		intersects = !!H.find(points, function (p) {
			var result;
			rect2 = p.rect;
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

var getScale = function getScale(xAxis, yAxis, series) {
	var bbox = series.group.element.getBoundingClientRect(),
		height = bbox.bottom - bbox.top,
		width = bbox.right - bbox.left,
		scaleX = 1 / width * xAxis.len,
		scaleY = 1 / height * yAxis.len;
	return Math.min(scaleX, scaleY);
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
		extend(this.yAxis.options, wordcloudAxis);
		extend(this.xAxis.options, wordcloudAxis);
	},
	// series prototype
	drawPoints: function () {
		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			chart = series.chart,
			placed = [],
			scale,
			yValues = series.points.map(function (p) {
				return p.y;
			}),
			maxY = Math.max.apply(null, yValues),
			maxDelta = (field.width * field.width) + (field.height * field.height),
			data = series.points
			.map(function (p) {
				var weight = 1 / maxY * p.y;
				return extend(p, {
					fontFamily: 'Impact',
					fontSize: Math.floor(maxFontSize * weight),
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
				x = getRandomPosition(field.width) - (field.width / 2),
				y = getRandomPosition(field.height) - (field.height / 2),
				clientRect,
				rect;
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
				// Cache the original DOMRect values for later calculations.
				point.clientRect = clientRect = extend(
					{},
					point.graphic.element.getBoundingClientRect()
				);
				point.rect = rect = extend({}, clientRect);
			}
			/**
			 * while word intersects any previously placed words:
			 *     move word a little bit along a spiral path
			 */
			while (intersectsAnyWord(point, placed) && !outOfRange) {
				delta = archimedeanSpiral(attempt);
				// Update the DOMRect with new positions.
				rect.left = clientRect.left + delta.x;
				rect.right = rect.left + rect.width;
				rect.top = clientRect.top + delta.y;
				rect.bottom = rect.top + rect.height;
				outOfRange = Math.min(Math.abs(delta.x), Math.abs(delta.y)) >= maxDelta;
				attempt++;
			}
			/**
			 * Check if point was placed, if so delete it,
			 * otherwise place it on the correct positions.
			 */
			if (outOfRange) {
				point.graphic = point.graphic.destroy();
			} else {
				point.graphic.attr({
					x: x + (delta ? delta.x : 0),
					y: y + (delta ? delta.y : 0)
				});
				placed.push(point);
			}
		});
		/**
		 * Scale the series group to fit within the plotArea.
		 */
		scale = getScale(xAxis, yAxis, series);
		series.group.attr({
			scaleX: scale,
			scaleY: scale
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
