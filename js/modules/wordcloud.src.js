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
	Series = H.Series;

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
 * @param  {Array} points Previously placed points to check against.
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
 * @param  {type} t How far along the spiral we have traversed.
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

/**
 * getScale - Calculates the proper scale to fit the cloud inside the plotting
 *     area.
 *
 * @param  {number} targetWidth  Width of target area.
 * @param  {number} targetHeight Height of target area.
 * @param  {object} field The playing field.
 * @param  {Series} series Series object.
 * @return {number} Returns the value to scale the playing field up to the size
 *     of the target area.
 */
var getScale = function getScale(targetWidth, targetHeight, field, series) {
	var box = series.group.getBBox(),
		f = {
			left: box.x,
			right: box.x + box.width,
			top: box.y,
			bottom: box.y + box.height
		},
		height = Math.max(Math.abs(f.top), Math.abs(f.bottom)) * 2,
		width = Math.max(Math.abs(f.left), Math.abs(f.right)) * 2,
		scaleX = 1 / width * targetWidth,
		scaleY = 1 / height * targetHeight;
	return Math.min(scaleX, scaleY);
};

/**
 * getPlayingField - Calculates what is called the playing field.
 *    The field is the area which all the words are allowed to be positioned
 *    within. The area is proportioned to match the target aspect ratio.
 *
 * @param  {number} targetWidth Width of the target area.
 * @param  {number} targetHeight Height of the target area.
 * @return {object} The width and height of the playing field.
 */
var getPlayingField = function getPlayingField(targetWidth, targetHeight) {
	var ratio = targetWidth / targetHeight;
	return {
		width: 256 * ratio,
		height: 256
	};
};


/**
 * getRotation - Calculates a number of degrees to rotate, based upon a number
 *     of orientations within a range from-to.
 *
 * @param  {type} orientations Number of orientations.
 * @param  {type} from The smallest degree of rotation.
 * @param  {type} to The largest degree of rotation.
 * @return {type} Returns the resulting rotation for the word.
 */
var getRotation = function getRotation(orientations, from, to) {
	var range = to - from,
		intervals = range / (orientations - 1),
		orientation = Math.floor(Math.random() * orientations);
	return from + (orientation * intervals);
};

/**
 * outsidePlayingField - Detects if a word is placed outside the playing field.
 *
 * @param  {Point} point Point which the word is connected to.
 * @param  {object} field The width and height of the playing field.
 * @return {boolean} Returns true if the word is placed outside the field.
 */
var outsidePlayingField = function outsidePlayingField(point, field) {
	var rect = point.graphic.getBBox(),
		playingField = {
			left: -(field.width / 2),
			right: field.width / 2,
			top: -(field.height / 2),
			bottom: field.height / 2
		};
	return !(
		playingField.left < rect.x &&
		playingField.right > (rect.x + rect.width) &&
		playingField.top < rect.y &&
		playingField.bottom > (rect.y + rect.height)
	);
};

/**
 * Default options for the WordCloud series.
 */
var WordCloudOptions = {
	borderWidth: 0,
	clip: false, // Something goes wrong with clip. // TODO fix this
	colorByPoint: true,
	fontFamily: 'Impact',
	placementStrategy: 'random',
	rotation: {
		from: -60,
		orientations: 5,
		to: 60
	},
	showInLegend: false,
	spiral: 'archimedean',
	tooltip: {
		followPointer: true
	}
};

/**
 * Properties of the WordCloud series.
 */
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
	/**
	 * deriveFontSize - Calculates the fontSize of a word based on its weight.
	 *
	 * @param  {number} relativeWeight The weight of the word, on a scale 0-1.
	 * @return {number} Returns the resulting fontSize of a word.
	 */
	deriveFontSize: function deriveFontSize(relativeWeight) {
		var maxFontSize = 25;
		return Math.floor(maxFontSize * relativeWeight);
	},
	drawPoints: function () {
		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			chart = series.chart,
			placed = [],
			placementStrategy = series.placementStrategy[series.options.placementStrategy],
			spiral = series.spirals[series.options.spiral],
			rotation = series.options.rotation,
			scale,
			weights = series.points
				.map(function (p) {
					return p.weight;
				}),
			maxWeight = Math.max.apply(null, weights),
			field = getPlayingField(xAxis.len, yAxis.len),
			maxDelta = (field.width * field.width) + (field.height * field.height),
			data = series.points
				.sort(function (a, b) {
					return b.weight - a.weight; // Sort descending
				});
		each(data, function (point) {
			var attempt = 0,
				delta,
				spiralIsSmallish = true,
				placement,
				clientRect,
				rect;
			point.relativeWeight = 1 / maxWeight * point.weight;
			placement = placementStrategy(point, {
				data: data,
				field: field,
				placed: placed,
				rotation: rotation
			});
			if (!point.graphic) {
				point.graphic = chart.renderer.text(point.name).css({
					fontSize: series.deriveFontSize(point.relativeWeight),
					fill: point.color,
					fontFamily: series.options.fontFamily
				}).attr({
					x: placement.x,
					y: placement.y,
					'text-anchor': 'middle',
					rotation: placement.rotation
				}).add(series.group);
				// Cache the original DOMRect values for later calculations.
				point.clientRect = clientRect = extend(
					{},
					point.graphic.element.getBoundingClientRect()
				);
				point.rect = rect = extend({}, clientRect);
			}
			/**
			 * while w intersects any previously placed words:
			 *    do {
			 *      move w a little bit along a spiral path
			 *    } while any part of w is outside the playing field and
			 *        the spiral radius is still smallish
			 */
			while (
				(
					intersectsAnyWord(point, placed) ||
					outsidePlayingField(point, field)
				) && spiralIsSmallish
			) {
				delta = spiral(attempt);
				// Update the DOMRect with new positions.
				rect.left = clientRect.left + delta.x;
				rect.right = rect.left + rect.width;
				rect.top = clientRect.top + delta.y;
				rect.bottom = rect.top + rect.height;
				spiralIsSmallish = (
					Math.min(Math.abs(delta.x), Math.abs(delta.y)) < maxDelta
				);
				attempt++;
			}
			/**
			 * Check if point was placed, if so delete it,
			 * otherwise place it on the correct positions.
			 */
			if (spiralIsSmallish) {
				point.graphic.attr({
					x: placement.x + (delta ? delta.x : 0),
					y: placement.y + (delta ? delta.y : 0)
				});
				placed.push(point);
			} else {
				point.graphic = point.graphic.destroy();
			}
		});
		/**
		 * Scale the series group to fit within the plotArea.
		 */
		scale = getScale(xAxis.len, yAxis.len, field, series);
		series.group.attr({
			scaleX: scale,
			scaleY: scale
		});
	},
	/**
	 * Strategies used for deciding rotation and initial position of a word.
	 * To implement a custom strategy, have a look at the function
	 *     randomPlacement for example.
	 */
	placementStrategy: {
		random: function randomPlacement(point, options) {
			var field = options.field,
				r = options.rotation;
			return {
				x: getRandomPosition(field.width) - (field.width / 2),
				y: getRandomPosition(field.height) - (field.height / 2),
				rotation: getRotation(r.orientations, r.from, r.to)
			};
		}
	},
	/**
	 * Spirals used for placing a word after the inital position experienced a
	 *     collision with either another word or the borders.
	 * To implement a custom spiral, look at the function archimedeanSpiral for
	 *    example.
	 */
	spirals: {
		'archimedean': archimedeanSpiral
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

/**
 * Assemble the WordCloud series type.
 */
H.seriesType('wordcloud', 'column', WordCloudOptions, WordCloudSeries);
