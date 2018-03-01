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
import drawPoint from '../mixins/draw-point.js';
import '../parts/Series.js';
var each = H.each,
	extend = H.extend,
	isArray = H.isArray,
	isNumber = H.isNumber,
	isObject = H.isObject,
	reduce = H.reduce,
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
 * @param {number} attempt How far along the spiral we have traversed.
 * @param {object} params Additional parameters.
 * @param {object} params.field Size of field.
 * @return {boolean|object} Resulting coordinates, x and y. False if the word
 * should be dropped from the visualization.
 */
var archimedeanSpiral = function archimedeanSpiral(attempt, params) {
	var field = params.field,
		result = false,
		maxDelta = (field.width * field.width) + (field.height * field.height),
		t = attempt * 0.2;
	// Emergency brake. TODO make spiralling logic more foolproof.
	if (attempt <= 10000) {
		result = {
			x: t * Math.cos(t),
			y: t * Math.sin(t)
		};
		if (!(Math.min(Math.abs(result.x), Math.abs(result.y)) < maxDelta)) {
			result = false;
		}
	}
	return result;
};

/**
 * squareSpiral - Gives a set of cordinates for an rectangular spiral.
 *
 * @param {number} attempt How far along the spiral we have traversed.
 * @param {object} params Additional parameters.
 * @return {boolean|object} Resulting coordinates, x and y. False if the word
 * should be dropped from the visualization.
 */
var squareSpiral = function squareSpiral(attempt) {
	var k = Math.ceil((Math.sqrt(attempt) - 1) / 2),
		t = 2 * k + 1,
		m = Math.pow(t, 2),
		isBoolean = function (x) {
			return typeof x === 'boolean';
		},
		result = false;
	t -= 1;
	if (attempt <= 10000) {
		if (isBoolean(result) && attempt >= m - t) {
			result = {
				x: k - (m - attempt),
				y: -k
			};
		}
		m -= t;
		if (isBoolean(result) && attempt >= m - t) {
			result = {
				x: -k,
				y: -k + (m - attempt)
			};
		}
		
		m -= t;
		if (isBoolean(result)) {
			if (attempt >= m - t) {
				result = {
					x: -k + (m - attempt),
					y: k
				};
			} else {
				result =  {
					x: k,
					y: k - (m - attempt - t)
				};
			}
		}
		result.x *= 5;
		result.y *= 5;
	}
	return result;
};

/**
 * rectangularSpiral - Gives a set of cordinates for an rectangular spiral.
 *
 * @param {number} attempt How far along the spiral we have traversed.
 * @param {object} params Additional parameters.
 * @return {boolean|object} Resulting coordinates, x and y. False if the word
 * should be dropped from the visualization.
 */
var rectangularSpiral = function rectangularSpiral(attempt, params) {
	var result = squareSpiral(attempt, params),
		field = params.field;
	if (result) {
		result.x *= field.ratio;
	}
	return result;
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
 * @param  {array} data Array of {@link Point} objects.
 * @param  {object} data.dimensions The height and width of the word.
 * @return {object} The width and height of the playing field.
 */
var getPlayingField = function getPlayingField(
	targetWidth,
	targetHeight,
	data
) {
	var ratio = targetWidth / targetHeight,
		info = reduce(data, function (obj, point) {
			var dimensions = point.dimensions;
			// Find largest height.
			obj.maxHeight = Math.max(obj.maxHeight, dimensions.height);
			// Find largest width.
			obj.maxWidth = Math.max(obj.maxWidth, dimensions.width);
			// Sum up the total area of all the words.
			obj.area += dimensions.width * dimensions.height;
			return obj;
		}, {
			maxHeight: 0,
			maxWidth: 0,
			area: 0
		}),
		/**
		 * Use largest width, largest height, or root of total area to give size
		 * to the playing field.
		 * Add extra 10 percentage to ensure enough space.
		 */
		x = 1.1 * Math.max(info.maxHeight, info.maxWidth, Math.sqrt(info.area));
	return {
		width: x * ratio,
		height: x,
		ratio: ratio
	};
};


/**
 * getRotation - Calculates a number of degrees to rotate, based upon a number
 *     of orientations within a range from-to.
 *
 * @param  {number} orientations Number of orientations.
 * @param  {number} index Index of point, used to decide orientation.
 * @param  {number} from The smallest degree of rotation.
 * @param  {number} to The largest degree of rotation.
 * @return {boolean|number} Returns the resulting rotation for the word. Returns
 * false if invalid input parameters.
 */
var getRotation = function getRotation(orientations, index, from, to) {
	var result = false, // Default to false
		range,
		intervals,
		orientation;

	// Check if we have valid input parameters.
	if (
		isNumber(orientations) &&
		isNumber(index) &&
		isNumber(from) &&
		isNumber(to) &&
		orientations > -1 &&
		index > -1 &&
		to > from
	) {
		range = to - from;
		intervals = range / (orientations - 1);
		orientation = index % orientations;
		result = from + (orientation * intervals);
	}
	return result;
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
		playingField.left < (rect.x - rect.width / 2) &&
		playingField.right > (rect.x + rect.width / 2) &&
		playingField.top < (rect.y - rect.height / 2) &&
		playingField.bottom > (rect.y + rect.height / 2)
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
		attempt = 1,
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
		) && delta !== false
	) {
		delta = spiral(attempt, {
			field: field
		});
		if (isObject(delta)) {
			// Update the DOMRect with new positions.
			rect.left = clientRect.left + delta.x;
			rect.right = rect.left + rect.width;
			rect.top = clientRect.top + delta.y;
			rect.bottom = rect.top + rect.height;
		}
		attempt++;
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
 * A word cloud is a visualization of a set of words, where the size and
 * placement of a word is determined by how it is weighted.
 *
 * @extends {plotOptions.column}
 * @sample highcharts/demo/wordcloud Word Cloud chart
 * @excluding allAreas, boostThreshold, clip, colorAxis, compare, compareBase,
 *            crisp, cropTreshold, dataGrouping, dataLabels, depth, edgeColor,
 *            findNearestPointBy, getExtremesFromAll, grouping, groupPadding,
 *            groupZPadding, joinBy, maxPointWidth, minPointLength,
 *            navigatorOptions, negativeColor, pointInterval, pointIntervalUnit,
 *            pointPadding, pointPlacement, pointRange, pointStart, pointWidth,
 *            pointStart, pointWidth, shadow, showCheckbox, showInNavigator,
 *            softThreshold, stacking, threshold, zoneAxis, zones
 * @product highcharts
 * @since  6.0.0
 * @optionparent plotOptions.wordcloud
 */
var wordCloudOptions = {
	animation: {
		duration: 500
	},
	borderWidth: 0,
	clip: false, // Something goes wrong with clip. // TODO fix this
	/**
	 * When using automatic point colors pulled from the `options.colors`
	 * collection, this option determines whether the chart should receive
	 * one color per series or one color per point.
	 *
	 * @see [series colors](#plotOptions.column.colors)
	 */
	colorByPoint: true,
	/**
	 * This option decides which algorithm is used for placement, and rotation
	 * of a word. The choice of algorith is therefore a crucial part of the
	 * resulting layout of the wordcloud.
	 * It is possible for users to add their own custom placement strategies
	 * for use in word cloud. Read more about it in our
	 * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-placement-strategies)
	 *
	 * @validvalue: ["center", "random"]
	 */
	placementStrategy: 'center',
	/**
	 * Rotation options for the words in the wordcloud.
	 * @sample highcharts/plotoptions/wordcloud-rotation
	 *         Word cloud with rotation
	 */
	rotation: {
		/**
		 * The smallest degree of rotation for a word.
		 */
		from: 0,
		/**
		 * The number of possible orientations for a word, within the range of
		 * `rotation.from` and `rotation.to`.
		 */
		orientations: 2,
		/**
		 * The largest degree of rotation for a word.
		 */
		to: 90
	},
	showInLegend: false,
	/**
	 * Spiral used for placing a word after the inital position experienced a
	 * collision with either another word or the borders.
	 * It is possible for users to add their own custom spiralling algorithms
	 * for use in word cloud. Read more about it in our
	 * [documentation](https://www.highcharts.com/docs/chart-and-series-types/word-cloud-series#custom-spiralling-algorithm)
	 *
	 * @validvalue: ["archimedean", "rectangular", "square"]
	 */
	spiral: 'rectangular',
	/**
	 * CSS styles for the words.
	 *
	 * @type {CSSObject}
	 * @default {"fontFamily":"sans-serif", "fontWeight": "900"}
	 */
	style: {
		fontFamily: 'sans-serif',
		fontWeight: '900'
	},
	tooltip: {
		followPointer: true,
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.weight}</b><br/>'
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
			hasRendered = series.hasRendered,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			chart = series.chart,
			group = series.group,
			options = series.options,
			animation = options.animation,
			renderer = chart.renderer,
			testElement = renderer.text().add(group),
			placed = [],
			placementStrategy = series.placementStrategy[
				options.placementStrategy
			],
			spiral = series.spirals[options.spiral],
			rotation = options.rotation,
			scale,
			weights = series.points
				.map(function (p) {
					return p.weight;
				}),
			maxWeight = Math.max.apply(null, weights),
			data = series.points
				.sort(function (a, b) {
					return b.weight - a.weight; // Sort descending
				}),
			field;

		// Get the dimensions for each word.
		// Used in calculating the playing field.
		each(data, function (point) {
			var relativeWeight = 1 / maxWeight * point.weight,
				css = extend({
					fontSize: series.deriveFontSize(relativeWeight) + 'px'
				}, options.style),
				bBox;

			testElement.css(css).attr({
				x: 0,
				y: 0,
				text: point.name
			});

			// TODO Replace all use of clientRect with bBox.
			bBox = testElement.getBBox(true);
			point.dimensions = {
				height: bBox.height,
				width: bBox.width
			};
		});

		// Calculate the playing field.
		field = getPlayingField(xAxis.len, yAxis.len, data);

		// Draw all the points.
		each(data, function (point) {
			var relativeWeight = 1 / maxWeight * point.weight,
				css = extend({
					fontSize: series.deriveFontSize(relativeWeight) + 'px',
					fill: point.color
				}, options.style),
				placement = placementStrategy(point, {
					data: data,
					field: field,
					placed: placed,
					rotation: rotation
				}),
				attr = {
					align: 'center',
					x: placement.x,
					y: placement.y,
					text: point.name,
					rotation: placement.rotation
				},
				animate,
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

			if (animation) {
				// Animate to new positions
				animate = {
					x: attr.x,
					y: attr.y
				};
				// Animate from center of chart
				if (!hasRendered) {
					attr.x = 0;
					attr.y = 0;
				// or animate from previous position
				} else {
					delete attr.x;
					delete attr.y;
				}
			}

			point.draw({
				animate: animate,
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
	hasData: function () {
		var series = this;
		return (
			isObject(series) &&
			series.visible === true &&
			isArray(series.points) &&
			series.points.length > 0
		);
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
				rotation: getRotation(r.orientations, point.index, r.from, r.to)
			};
		},
		center: function centerPlacement(point, options) {
			var r = options.rotation;
			return {
				x: 0,
				y: 0,
				rotation: getRotation(r.orientations, point.index, r.from, r.to)
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
		'archimedean': archimedeanSpiral,
		'rectangular': rectangularSpiral,
		'square': squareSpiral
	},
	utils: {
		getRotation: getRotation
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
	draw: drawPoint,
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
 * @extends series,plotOptions.wordcloud
 * @product highcharts
 * @apioption series.wordcloud
 */

/**
 * An array of data points for the series. For the `wordcloud` series
 * type, points can be given in the following ways:
 * 
 * 1.  An array of arrays with 2 values. In this case, the values
 * correspond to `name,weight`. 
 * 
 *  ```js
 *     data: [
 *         ['Lorem', 4],
 *         ['Ipsum', 1]
 *     ]
 *  ```
 * 
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series'
 * [turboThreshold](#series.arearange.turboThreshold), this option is not
 * available.
 * 
 *  ```js
 *     data: [{
 *         name: "Lorem",
 *         weight: 4
 *     }, {
 *         name: "Ipsum",
 *         weight: 1
 *     }]
 *  ```
 * 
 * @type {Array<Object|Array>}
 * @extends series.line.data
 * @excluding drilldown,marker,x,y
 * @product highcharts
 * @apioption series.wordcloud.data
 */

/**
* The name decides the text for a word.
*
* @type {String}
* @default undefined
* @since 6.0.0
* @product highcharts
* @apioption series.sunburst.data.name
*/

/**
* The weighting of a word. The weight decides the relative size of a word
* compared to the rest of the collection.
*
* @type {Number}
* @default undefined
* @since 6.0.0
* @product highcharts
* @apioption series.sunburst.data.weight
*/
H.seriesType(
	'wordcloud',
	'column',
	wordCloudOptions,
	wordCloudSeries,
	wordCloudPoint
);
