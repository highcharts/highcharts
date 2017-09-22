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
	isNumber = H.isNumber,
	isObject = H.isObject,
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
var getScale = function getScale(targetWidth, targetHeight, field) {
	var height = Math.max(Math.abs(field.top), Math.abs(field.bottom)) * 2,
		width = Math.max(Math.abs(field.left), Math.abs(field.right)) * 2,
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
var outsidePlayingField = function outsidePlayingField(wrapper, field) {
	var rect = wrapper.getBBox(),
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
 * intersectionTesting - Check if a point intersects with previously placed
 * words, or if it goes outside the field boundaries. If a collision, then try
 * to adjusts the position.
 *
 * @param  {object} point Point to test for intersections.
 * @param  {object} options Options object. 
 * @return {boolean|object} Returns an object with how much to correct the
 * positions. Returns false if the word should not be placed at all.
 */
var intersectionTesting = function intersectionTesting(point, options) {
	var placed = options.placed,
		element = options.element,
		field = options.field,
		clientRect = options.clientRect,
		spiral = options.spiral,
		maxDelta = options.maxDelta,
		spiralIsSmallish = true,
		attempt = 0,
		delta = {
			x: 0,
			y: 0
		},
		rect = point.rect = extend({}, clientRect);
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
			outsidePlayingField(element, field)
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
	if (!spiralIsSmallish) {
		delta = false;
	}
	return delta;
};

/**
 * updateFieldBoundaries - If a rectangle is outside a give field, then the
 * boundaries of the field is adjusted accordingly. Modifies the field object
 * which is passed as the first parameter.
 *
 * @param  {object} field The bounding box of a playing field.
 * @param  {object} placement The bounding box for a placed point.
 * @return {object} Returns a modified field object.
 */
var updateFieldBoundaries = function updateFieldBoundaries(field, rectangle) {
	// TODO improve type checking.
	if (!isNumber(field.left) || field.left > rectangle.left) {
		field.left = rectangle.left;
	}
	if (!isNumber(field.right) || field.right < rectangle.right) {
		field.right = rectangle.right;
	}
	if (!isNumber(field.top) || field.top > rectangle.top) {
		field.top = rectangle.top;
	}
	if (!isNumber(field.bottom) || field.bottom < rectangle.bottom) {
		field.bottom = rectangle.bottom;
	}
	return field;
};

/**
 * Wordcloud.
 *
 * @extends {plotOptions.column}
 * @excluding allAreas, clip, colorAxis, compare, compareBase, crisp, cropTreshold, dataGrouping, dataLabels, depth, edgeColor, findNearestPointBy, getExtremesFromAll, grouping, groupPadding, groupZPadding, joinBy, maxPointWidth, minPointLength, navigatorOptions, negativeColor, pointInterval, pointIntervalUnit, pointPadding, pointPlacement, pointRange, pointStart, pointWidth, pointStart, pointWidth, shadow, showCheckbox, showInNavigator, softThreshold, stacking, threshold, zoneAxis, zones
 * @product highcharts
 * @optionparent plotOptions.wordcloud
 */
var wordCloudOptions = {
	borderWidth: 0,
	clip: false, // Something goes wrong with clip. // TODO fix this
	/**
	 * When using automatic point colors pulled from the `options.colors`
	 * collection, this option determines whether the chart should receive
	 * one color per series or one color per point.
	 *
	 * @type {Boolean}
	 * @see [series colors](#plotOptions.column.colors)
	 * @default true
	 * @since 6.0.0
	 * @product highcharts
	 * @apioption plotOptions.wordcloud.colorByPoint
	 */
	colorByPoint: true,
	fontFamily: 'Impact',
	/**
	 * This option decides which algorithm is used for placement, and rotation
	 * of a word. The choice of algorith is therefore a crucial part of the
	 * resulting layout of the wordcloud.
	 *
	 * @since 6.0.0
	 * @apioption plotOptions.wordcloud.placementStrategy
	 */
	placementStrategy: 'random',
	/**
	 * Rotation options for the words in the wordcloud.
	 *
	 * @since 6.0.0
	 * @optionparent plotOptions.wordcloud.rotation
	 */
	rotation: {
		/**
		 * The smallest degree of rotation for a word.
		 *
		 * @since 6.0.0
		 * @apioption plotOptions.wordcloud.from
		 */
		from: -60,
		/**
		 * The number of possible orientations for a word, within the range of
		 * rotation.from and rotation.to.
		 *
		 * @since 6.0.0
		 * @apioption plotOptions.wordcloud.orientation
		 */
		orientations: 5,
		/**
		 * The largest degree of rotation for a word.
		 *
		 * @since 6.0.0
		 * @apioption plotOptions.wordcloud.to
		 */
		to: 60
	},
	showInLegend: false,
	/**
	 * Spiral used for placing a word after the inital position experienced a
	 * collision with either another word or the borders.
	 *
	 * @since 6.0.0
	 */
	spiral: 'archimedean',
	tooltip: {
		followPointer: true
	}
};

/**
 * Properties of the WordCloud series.
 */
var wordCloudSeries = {
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
			group = series.group,
			options = series.options,
			renderer = chart.renderer,
			testElement = renderer.text().add(group),
			placed = [],
			placementStrategy = series.placementStrategy[options.placementStrategy],
			spiral = series.spirals[options.spiral],
			rotation = options.rotation,
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
			var relativeWeight = 1 / maxWeight * point.weight,
				css = {
					fontSize: series.deriveFontSize(relativeWeight),
					fill: point.color,
					fontFamily: options.fontFamily
				},
				placement = placementStrategy(point, {
					data: data,
					field: field,
					placed: placed,
					rotation: rotation
				}),
				attr = {
					x: placement.x,
					y: placement.y,
					text: point.name,
					'text-anchor': 'middle',
					rotation: placement.rotation
				},
				delta,
				clientRect;
			testElement.css(css).attr(attr);
			// Cache the original DOMRect values for later calculations.
			point.clientRect = clientRect = extend(
				{},
				testElement.element.getBoundingClientRect()
			);
			delta = intersectionTesting(point, {
				clientRect: clientRect,
				element: testElement,
				field: field,
				maxDelta: maxDelta,
				placed: placed,
				spiral: spiral
			});
			/**
			 * Check if point was placed, if so delete it,
			 * otherwise place it on the correct positions.
			 */
			if (isObject(delta)) {
				attr.x += delta.x;
				attr.y += delta.y;
				extend(placement, {
					left: attr.x  - (clientRect.width / 2),
					right: attr.x + (clientRect.width / 2),
					top: attr.y - (clientRect.height / 2),
					bottom: attr.y + (clientRect.height / 2)
				});
				field = updateFieldBoundaries(field, placement);
				placed.push(point);
				point.isNull = false;
			} else {
				point.isNull = true;
			}
			point.draw({
				attr: attr,
				css: css,
				group: group,
				renderer: renderer,
				shapeArgs: undefined,
				shapeType: 'text'
			});
		});

		// Destroy the element after use.
		testElement = testElement.destroy();

		/**
		 * Scale the series group to fit within the plotArea.
		 */
		scale = getScale(xAxis.len, yAxis.len, field);
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
	pointArrayMap: ['weight'],
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
 * Properties of the Sunburst series.
 */
var wordCloudPoint = {
	draw: function draw(options) {
		var point = this,
			graphic = point.graphic,
			group = options.group,
			renderer = options.renderer,
			shape = options.shapeArgs,
			type = options.shapeType,
			css = options.css,
			attr = options.attr;
		if (point.shouldDraw()) {
			if (!graphic) {
				point.graphic = graphic = renderer[type](shape).add(group);
			}
			graphic.css(css).attr(attr).animate(shape);
		} else if (graphic) {
			point.graphic = graphic.destroy();
		}
	},
	shouldDraw: function shouldDraw() {
		var point = this;
		return !point.isNull;
	}
};

/**
 * A `wordcloud` series. If the [type](#series.wordcloud.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * wordcloud](#plotOptions.wordcloud).
 *
 * @type {Object}
 * @extends plotOptions.wordcloud
 * @product highcharts
 * @apioption series.wordcloud
 */

/**
* @type {Array<Object|Number>}
* @extends series.wordcloud.data
* @excluding x,y
* @product highcharts
* @apioption series.wordcloud.data
*/

/**
* The name decides the text for a word.
*
* @type {Number|undefined}
* @default undefined
* @since 6.0.0
* @product highcharts
* @apioption series.sunburst.data.name
*/

/**
* The weighting of a word. The weight decides the relative size of a word
* compared to the rest of the collection.
*
* @type {Number|undefined}
* @default undefined
* @since 6.0.0
* @product highcharts
* @apioption series.sunburst.data.weight
*/
H.seriesType('wordcloud', 'column', wordCloudOptions, wordCloudSeries, wordCloudPoint);
