'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Tooltip.js';

var	merge = H.merge,
	addEvent = H.addEvent,
	extend = H.extend,
	each = H.each,
	isString = H.isString,
	isNumber = H.isNumber,
	defined = H.defined,
	isObject = H.isObject,
	inArray = H.inArray,
	erase = H.erase,
	find = H.find,
	format = H.format,
	pick = H.pick,
	destroyObjectProperties = H.destroyObjectProperties,

	tooltipPrototype = H.Tooltip.prototype,
	seriesPrototype = H.Series.prototype,
	chartPrototype = H.Chart.prototype;


/* ***************************************************************************
*
* MARKER SECTION
* Contains objects and functions for adding a marker element to a path element
*
**************************************************************************** */

/**
 * An object with predefined markers options
 *
 * @type {Object}
 */
var defaultMarkers = {
	arrow: {
		render: false,
		id: 'arrow',
		refY: 5,
		refX: 5,
		markerWidth: 10,
		markerHeight: 10,
		children: [{
			tagName: 'path',
			attrs: {
				d: 'M 0 0 L 10 5 L 0 10 Z', // triangle (used as an arrow)
				strokeWidth: 0
			}
		}]
	}
};

var MarkerMixin = {
	markerSetter: function (markerType) {
		return function (value) {
			this.attr(markerType, 'url(#' + value + ')');
		};
	}
};

extend(MarkerMixin, {
	markerEndSetter: MarkerMixin.markerSetter('marker-end'),
	markerStartSetter: MarkerMixin.markerSetter('marker-start')
});


H.SVGRenderer.prototype.addMarker = function (id, markerOptions) {
	var markerId = pick(id, H.uniqueKey()),
		marker = this.createElement('marker').attr({
			id: markerId,
			markerWidth: pick(markerOptions.markerWidth, 20),
			markerHeight: pick(markerOptions.markerHeight, 20),
			refX: markerOptions.refX || 0,
			refY: markerOptions.refY || 0,
			orient: markerOptions.orient || 'auto'
		}).add(this.defs),

		attrs = {
			stroke: markerOptions.color || 'none',
			fill: markerOptions.color || 'rgba(0, 0, 0, 0.75)'
		},
		children = markerOptions.children;

	marker.id = markerId;

	each(children, function (child) {
		this.createElement(child.tagName)
			.attr(merge(attrs, child.attrs))
			.add(marker);
	}, this);

	return marker;
};


/* ***************************************************************************
*
* MOCK POINT
*
**************************************************************************** */

/**
 * A mock point configuration.
 *
 * @typedef {Object} MockPointOptions
 * @property {Number} x - x value for the point in xAxis scale or pixels
 * @property {Number} y - y value for the point in yAxis scale or pixels
 * @property {String|Number} [xAxis] - xAxis index or id
 * @property {String|Number} [yAxis] - yAxis index or id
 */


/**
 * A trimmed point object which imitates {@link Highchart.Point} class.
 * It is created when there is a need of pointing to some chart's position
 * using axis values or pixel values
 * 
 * @class MockPoint
 * @memberOf Highcharts
 *
 * @param {Highcharts.Chart} - the chart object
 * @param {MockPointOptions} - the options object
 */
var MockPoint = H.MockPoint = function (chart, options) {
	this.mock = true;
	this.series = {
		visible: true,
		chart: chart,
		getPlotBox: seriesPrototype.getPlotBox
	};

	//this.plotX
	//this.plotY

	/* Those might not exist if a specific axis was not found/defined */
	//this.x? 
	//this.y?

	this.init(chart, options);
};

/**
 * A factory function for creating a mock point object
 * 
 * @function #mockPoint
 * @memberOf Highcharts
 *
 * @param {MockPointOptions} mockPointOptions
 * @return {MockPoint} a mock point
 */
var mockPoint = H.mockPoint = function (chart, mockPointOptions) {
	return new MockPoint(chart, mockPointOptions);
};

MockPoint.prototype = {
	/**
	 * Initialisation of the mock point
	 *
	 * @function #init
	 * @memberOf Highcharts.MockPoint#
	 *
	 * @param {Highcharts.Chart} chart - a chart object to which the mock point
	 * is attached
	 * @param {MockPointOptions} options - a config for the mock point
	 */
	init: function (chart, options) {
		var xAxisId = options.xAxis,
			xAxis = defined(xAxisId) ?
				chart.xAxis[xAxisId] || chart.get(xAxisId) :
				null,
			
			yAxisId = options.yAxis,
			yAxis = defined(yAxisId) ?
				chart.yAxis[yAxisId] || chart.get(yAxisId) :
				null;


		if (xAxis) {
			this.x = options.x;
			this.series.xAxis = xAxis;
		} else {
			this.plotX = options.x;
		}

		if (yAxis) {
			this.y = options.y;
			this.series.yAxis = yAxis;
		} else {
			this.plotY = options.y;
		}
	},

	/**
	 * Update of the point's coordinates (plotX/plotY)
	 * 
	 * @function #translate
	 * @memberOf Highcharts.MockPoint#
	 *
	 * @return {undefined}
	 */
	translate: function () {
		var series = this.series,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			plotX = this.plotX,
			plotY = this.plotY,
			isInside = true;

		if (xAxis) {
			this.plotX = plotX = xAxis.toPixels(this.x, true);

			isInside = plotX >= 0 && plotX <= xAxis.len;
		}

		if (yAxis) {
			this.plotY = plotY = yAxis.toPixels(this.y, true);

			isInside = isInside && plotY >= 0 && plotY <= yAxis.len;
		}

		this.isInside = isInside;
	},

	/**
	 * Returns a box to which an item can be aligned to
	 *
	 * @function #alignToBox
	 * @memberOf Highcharts.MockPoint#
	 *
	 * @param {Boolean} [forceTranslate=false] - whether to update the point's
	 * coordinates
	 * @return {Array.<Number>} A quadruple of numbers which denotes x, y,
	 * width and height of the box
	**/
	alignToBox: function (forceTranslate) {
		if (forceTranslate) {
			this.translate();
		}

		var x = this.plotX,
			y = this.plotY,
			temp;


		if (this.series.chart.inverted) {
			temp = x;
			x = y;
			y = temp;
		}

		return [x, y, 0, 0];
	},

	/**
	 * Returns a label config object - 
	 * the same as Highcharts.Point.prototype.getLabelConfig
	 *
	 * @function #getLabelConfig
	 * @memberOf Highcharts.MockPoint#
	 *
	 * @return {Object} labelConfig - label config object
	 * @return {Number|undefined} labelConfig.x - x value translated to x axis scale
	 * @return {Number|undefined} labelConfig.y - y value translated to y axis scale
	 * @return {MockPoint} labelConfig.point - the instance of the point
	 */
	getLabelConfig: function () {
		return {
			x: this.x,
			y: this.y,
			point: this
		};
	}
};


/* ***************************************************************************
*
* ANNOTATION
*
**************************************************************************** */

H.defaultOptions.annotations = [];

/**
 * An annotation class which serves as a container for items like labels or shapes.
 * Created items are positioned on the chart either by linking them to
 * existing points or created mock points 
 * 
 * @class Annotation
 * @memberOf Highcharts
 *
 * @param {Highcharts.Chart} - the chart object
 * @param {AnnotationOptions} - the options object
 */
var Annotation = H.Annotation = function (chart, userOptions) {
	this.chart = chart;

	this.labels = [];
	this.shapes = [];

	this.options = merge(this.defaultOptions, userOptions);

	this.init(chart, userOptions);
};

Annotation.prototype = {
	/**
	 * Shapes which do not have background - the object is used for proper
	 * setting of the contrast color
	 *
	 * @memberOf Highcharts.Annotation#
	 * @type {Array.<String>}
	 */
	shapesWithoutBackground: ['connector'],

	/**
	 * A map object which allows to map options attributes to element attributes
	 *
	 * @memberOf Highcharts.Annotation#
	 * @type {Object}
	 */
	attrsMap: {
		backgroundColor: 'fill',
		borderColor: 'stroke',
		borderWidth: 'stroke-width',
		strokeWidth: 'stroke-width',
		stroke: 'stroke',
		fill: 'fill',
		zIndex: 'zIndex',
		width: 'width',
		height: 'height',
		borderRadius: 'r',
		r: 'r',
		padding: 'padding'
	},

	/**
	 * Default options for an annotation
	 *
	 * @memberOf Highcharts.Annotation#
	 * @type {Object}
	**/
	defaultOptions: {
		visible: true,

		labelOptions: {
			align: 'center',
			allowOverlap: false,
			backgroundColor: 'rgba(0, 0, 0, 0.75)',
			borderColor: 'black',
			borderRadius: 1,
			borderWidth: 1,
			// className:
			// color: undefined,
			crop: false,
			// text: null,
			formatter: function () {
				return defined(this.y) ? this.y : 'Annotation label';
			},
			overflow: 'none',
			padding: 5,
			shadow: false,
			shape: 'callout',
			style: {
				fontSize: '11px',
				fontWeigth: 'bold',
				color: 'contrast'
			},
			useHTML: false,
			verticalAlign: 'bottom',
			x: 0,
			y: -16
			// distance: 16
			// zIndex: 6
		},

		shapeOptions: {
			stroke: 'rgba(0, 0, 0, 0.75)',
			strokeWidth: 1,
			fill: 'rgba(0, 0, 0, 0.75)',
			// type: 'rect',
			r: 0
		},

		zIndex: 6
	},

	/**
	 * Annotation initialisation
	 *
	 * @function #init
	 * @memberOf Highcharts.Annotation#
	 *
	 * @return {undefined}
	**/

	init: function () {
		each(this.options.labels || [], this.initLabel, this);
		each(this.options.shapes || [], this.initShape, this);
	},

	/**
	 * Main method for drawing an annotation, it is called everytime on chart redraw
	 * and once on chart's load
	 *
	 * @function #redraw
	 * @memberOf Highcharts.Annotation#
	 *
	 * @return {undefined}
	**/
	redraw: function () {
		if (!this.group) {
			this.render();
		}

		this.redrawItems(this.shapes);
		this.redrawItems(this.labels);

		this.collectAndHideLabels();
	},

	/**
	 * @function #redrawItems
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Array<Object>} items
	 * @return {undefined}
	**/
	redrawItems: function (items) {
		var i = items.length;

		// needs a backward loop
		// labels/shapes array might be modified due to destruction of the item
		while (i--) {
			this.redrawItem(items[i]);
		}
	},

	/**
	 * @function #render
	 * @memberOf Highcharts.Annotation#
	 *
	 * @return {undefined}
	**/
	render: function () {
		this.group = this.chart.renderer.g('annotation')
			.attr({
				zIndex: this.options.zIndex,

				// hideOverlappingLabels requires translation
				translateX: 0,
				translateY: 0,
				visibility: this.options.visible ? 'visible' : 'hidden'
			})
			.add();
	},

	/**
	 * @function #setVisible
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Boolean} [visibility] - whether to show or hide an annotation.
	 * If the param is omitted, the annotation's visibility is toggled
	 * @return {undefined}
	 **/
	setVisible(visibility) {
		var options = this.options,
			visible = pick(visibility, !options.visible);

		this.group.attr({
			visibility: visible ? 'visible' : 'hidden'
		});

		options.visible = visible;
	},


	/**
	 * Collecting labels and hide them if they overlap
	 *
	 * @function #collectAndHideLabels
	 * @memberOf Highcharts.Annotation#
	 *
	 * @return {undefined}
	**/
	collectAndHideLabels: function () {
		var labels = [];

		each(this.labels, function (label) {
			if (!label.options.allowOverlap) {
				labels.push(label);
			}
		});

		if (labels.length) {
			this.hideOverlappingLabels(labels);
		}
	},

	/**
	 * @function #hideOverlappingLabels
	 * @memberOf Highcharts.Annotation#
	 */
	hideOverlappingLabels: chartPrototype.hideOverlappingLabels,

	/**
	 * Destroying an annotation
	 *
	 * @function #destroy
	 * @memberOf Highcharts.Annotation#
	 *
	 * @return {undefined}
	**/
	destroy: function () {
		var chart = this.chart;

		each(this.labels, function (label) {
			label.destroy();
		});

		each(this.shapes, function (shape) {
			shape.destroy();
		});

		destroyObjectProperties(this, chart);
	},


	/* ***********************************************************************
	 * ITEM SECTION
	 * Contains methods for handling a single item in an annotation
	 *********************************************************************** */

	/**
	 * Initialisation of a single shape
	 *
	 * @function #initShape
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} shapeOptions - a confg object for a single shape
	 * @return {undefined}
	**/
	initShape: function (shapeOptions) {
		var renderer = this.chart.renderer,
			options = merge(this.options.shapeOptions, shapeOptions),
			attr = this.attrsFromOptions(options),

			type = renderer[options.type] ? options.type : 'rect',
			shape = renderer[type](0, -9e9, 0, 0);

		shape.points = [];
		shape.type = type;
		shape.options = options;
		shape.itemType = 'shape';

		if (type === 'path') {
			extend(shape, {
				markerStartSetter: MarkerMixin.markerStartSetter,
				markerEndSetter: MarkerMixin.markerEndSetter,
				markerStart: MarkerMixin.markerStart,
				markerEnd: MarkerMixin.markerEnd
			});
		}

		shape.attr(attr);

		this.shapes.push(shape);
	},

	/**
	 * Initialisation of a single label
	 *
	 * @function #initShape
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} labelOptions
	 * @return {undefined}
	**/
	initLabel: function (labelOptions) {
		var options = merge(this.options.labelOptions, labelOptions),
			style = options.style,
			attr = this.attrsFromOptions(options),

			label = this.chart.renderer.label(
				'',
				0, -9e9,
				options.shape,
				null,
				null,
				options.useHTML,
				null,
				'annotation-label'
			);

		if (style.color === 'contrast') {
			style.color = this.chart.renderer.getContrast(
				inArray(options.shape, this.shapesWithoutBackground) > -1 ? 
				'#FFFFFF' :
				options.backgroundColor
			);
		}

		label.points = [];
		label.options = options;
		label.itemType = 'label';

		// Labelrank required for hideOverlappingLabels()
		label.labelrank = options.labelrank;
		label.annotation = this;

		label.attr(attr).css(style).shadow(options.shadow);

		this.labels.push(label);
	},

	/**
	 * Redrawing a single item
	 *
	 * @function #redrawItem
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} item
	 * @return {undefined}
	 */
	redrawItem: function (item) {
		var points = this.linkPoints(item),
			itemOptions = item.options,
			text;

		if (!points.length) {
			this.destroyItem(item);

		} else {
			if (!item.parentGroup) {
				this.renderItem(item);
			}

			if (item.itemType === 'label') {
				text = itemOptions.format || itemOptions.text;
				item.attr({
					text: text ?
						format(text, points[0].getLabelConfig()) :
						itemOptions.formatter.call(points[0])
				});
			}


			if (item.type === 'path') {
				this.redrawPath(item);
		
			} else {
				this.alignItem(item, !item.placed);
			}
		}
	},

	/**
	 * Destroing a single item
	 *
	 * @function #destroyItem
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} item
	 * @return {undefined}
	 */
	destroyItem: function (item) {
		//erase from shapes or labels array
		erase(this[item.itemType + 's'], item);
		item.destroy();
	},

	/**
	 * Returns a point object
	 *
	 * @function #pointItem
	 * @memberOf Highcharts.Annotation#
	 * 
	 * @param {Object} pointOptions
	 * @param {Highcharts.MockPoint|Highcharts.Point} point
	 * @return {Highcharts.MockPoint|Highcharts.Point|null} if the point is
	 * found/exists returns this point, otherwise null
	 */
	pointItem: function (pointOptions, point) {
		if (!point || point.series === null) {
			if (isObject(pointOptions)) {
				point = mockPoint(this.chart, pointOptions);
			
			} else if (isString(pointOptions)) {
				point = this.chart.get(pointOptions) || null;
			}
		}

		return point;
	},

	/**
	 * Linking item with the point or points and returning an array of linked points
	 *
	 * @function #linkPoints
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} item
	 * @return {
	 * 	Highcharts.Point|
	 * 	Highcharts.MockPoint|
	 * 	Array<Highcharts.Point|Highcharts.MockPoint>
	 *	}
	 */
	linkPoints: function (item) {
		var pointsOptions = item.options.points || (item.options.point && H.splat(item.options.point)),
			points = item.points,
			len = pointsOptions && pointsOptions.length,
			i,
			point;

		for (i = 0; i < len; i++) {
			point = this.pointItem(pointsOptions[i], points[i]);

			if (!point) {
				return (item.points = []);
			}

			points[i] = point;
		}

		return points;
	},

	/**
	 * Aligning the item and setting its anchor
	 *
	 * @function #alignItem
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} item
	 * @param {Boolean} isNew - if the label is re-positioned (is not new) it is animated
	 * @return {undefined}
	 */
	alignItem: function (item, isNew) {
		var anchor = this.itemAnchor(item, item.points[0]),
			attrs = this.itemPosition(item, anchor);

		if (attrs) {
			item.alignAttr = attrs;
			item.placed = true;

			attrs.anchorX = anchor.absolutePosition.x;
			attrs.anchorY = anchor.absolutePosition.y;

			item[isNew ? 'attr' : 'animate'](attrs);

		} else {
			item.placed = false;

			item.attr({
				x: 0,
				y: -9e9
			});
		}
	},

	redrawPath: function (pathItem, isNew) {
		var points = pathItem.points,
			d = ['M'],
			pointIndex = 0,
			dIndex = 0,
			len = points && points.length,
			anchor,
			point,
			showPath;

		if (len) {
			do {
				point = points[pointIndex];

				anchor = this.itemAnchor(pathItem, point).absolutePosition;
				d[++dIndex] = anchor.x;
				d[++dIndex] = anchor.y;

				if (pointIndex < len - 1) {
					d[++dIndex] = 'L';
				}

				showPath = point.series.visible && point.isInside !== false;

			} while (++pointIndex < len && showPath);
		}


		if (showPath) {
			pathItem[isNew ? 'attr' : 'animate']({
				d: d
			});
		
		} else {
			pathItem.attr({
				d: 'M 0 ' + -9e9
			});
		}

		pathItem.placed = showPath;
	},

	renderItem: function (item) {
		item.add(this.group);

		this.setItemMarkers(item);
	},

	setItemMarkers: function (item) {
		var itemOptions = item.options,
			chart = this.chart,
			markers = chart.options.defs.markers,
			fill = itemOptions.fill,
			color = defined(fill) && fill !== 'none' ? fill : itemOptions.stroke,


			setMarker = function (markerType) {
				var markerId = itemOptions[markerType],
					marker,
					predefinedMarker,
					key;

				if (markerId) {
					for (key in markers) {
						marker = markers[key];
						if (markerId === marker.id) {
							predefinedMarker = marker;
							break;
						}
					}

					if (predefinedMarker) {
						marker = item[markerType] = chart.renderer.addMarker(
							null, 
							merge(predefinedMarker, { color: color })
						);

						item.attr(markerType, marker.id);
					}
				}
			};

		each(['markerStart', 'markerEnd'], setMarker);
	},

	/**
	 * An object which denotes an anchor position
	 *
	 * @typedef {Object} AnchorPosition
	 * @property {Number} AnchorPosition.x
	 * @property {Number} AnchorPosition.y
	 * @property {Number} AnchorPosition.height
	 * @property {Number} AnchorPosition.width
	 */

	/**
	 * Returns object which denotes anchor position - relative and absolute
	 *
	 * @function #itemAnchor
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} item
	 * @param {Highcharts.Point|Highcharts.MockPoint} point
	 * @return {Object} anchor
	 * @return {AnchorPosition} anchor.relativePosition - relative to the plot area position
	 * @return {AnchorPosition} anchor.absolutePosition - absolute position
	 */
	itemAnchor: function (item, point) {
		var plotBox = point.series.getPlotBox(),

			box = point.mock ?
				point.alignToBox(true) :
				tooltipPrototype.getAnchor.call({
					chart: this.chart
				}, point),

			anchor = {
				x: box[0],
				y: box[1],
				height: box[2] || 0,
				width: box[3] || 0
			};

		return {
			relativePosition: anchor,
			absolutePosition: merge(anchor, {
				x: anchor.x + plotBox.translateX,
				y: anchor.y + plotBox.translateY
			})
		};
	},

	/**
	 * Returns the item position
	 *
	 * @function #itemPosition
	 * @memberOf Highcharts.Annotation#
	 * 
	 * @param {Object} item
	 * @param {AnchorPosition} anchor
	 * @return {Object|null} position
	 * @return {Number} position.x
	 * @return {Number} position.y
	 */
	itemPosition: function (item, anchor) {
		var chart = this.chart,
			point = item.points[0],
			itemOptions = item.options,
			anchorAbsolutePosition = anchor.absolutePosition,
			anchorRelativePosition = anchor.relativePosition,
			itemPosition,
			alignTo,
			itemPosRelativeX,
			itemPosRelativeY,

			showItem = point.series.visible && point.isInside !== false;

		if (showItem) {

			if (defined(itemOptions.distance) || itemOptions.positioner) {
				itemPosition = (itemOptions.positioner || tooltipPrototype.getPosition).call(
					{
						chart: chart,
						distance: pick(itemOptions.distance, 16)
					},
					item.width,
					item.height,
					{
						plotX: anchorRelativePosition.x,
						plotY: anchorRelativePosition.y,
						negative: point.negative,
						ttBelow: point.ttBelow,
						h: anchorRelativePosition.height || anchorRelativePosition.width
					}
				);

			} else {
				alignTo = {
					x: anchorAbsolutePosition.x,
					y: anchorAbsolutePosition.y,
					width: 0,
					height: 0
				};

				itemPosition = this.alignedPosition(
					extend(itemOptions, {
						width: item.width,
						height: item.height
					}),
					alignTo
				);

				if (item.options.overflow === 'justify') {
					itemPosition = this.alignedPosition(
						this.justifiedOptions(item, itemOptions, itemPosition),
						alignTo
					);
				}
			}


			if (itemOptions.crop) {
				itemPosRelativeX = itemPosition.x - chart.plotLeft;
				itemPosRelativeY = itemPosition.y - chart.plotTop;

				showItem = 
					chart.isInsidePlot(itemPosRelativeX, itemPosRelativeY) &&
					chart.isInsidePlot(
						itemPosRelativeX + item.width,
						itemPosRelativeY + item.height
					);
			}
		}

		return showItem ? itemPosition : null;
	},

	/**
	 * Returns new aligned position based alignment options and box to align to.
	 * It is almost a one-to-one copy from SVGElement.prototype.align
	 * except it does not use and mutate an element
	 *
	 * @function #alignedPosition
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} alignOptions
	 * @param {Object} box
	 * @return {Object} aligned position
	**/
	alignedPosition: function (alignOptions, box) {
		var align = alignOptions.align,
			vAlign = alignOptions.verticalAlign,
			x = (box.x || 0) + (alignOptions.x || 0),
			y = (box.y || 0) + (alignOptions.y || 0),

			alignFactor,
			vAlignFactor;

		if (align === 'right') {
			alignFactor = 1;
		} else if (align === 'center') {
			alignFactor = 2;
		}
		if (alignFactor) {
			x += (box.width - (alignOptions.width || 0)) / alignFactor;
		}

		if (vAlign === 'bottom') {
			vAlignFactor = 1;
		} else if (vAlign === 'middle') {
			vAlignFactor = 2;
		}
		if (vAlignFactor) {
			y += (box.height - (alignOptions.height || 0)) / vAlignFactor;
		}
		
		return {
			x: Math.round(x),
			y: Math.round(y)
		};
	},

	/**
	 * Returns new alignment options for a label if the label is outside the plot area.
	 * It is almost a one-to-one copy from Series.prototype.justifyDataLabel 
	 * except it does not mutate the label and it works with absolute instead of relative position
	 *
	 * @function #justifiedOptions
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} label
	 * @param {Object} alignOptions
	 * @param {Object} alignAttr
	 * @return {Object} justified options
	**/
	justifiedOptions: function (label, alignOptions, alignAttr) {
		var chart = this.chart,
			align = alignOptions.align,
			verticalAlign = alignOptions.verticalAlign,
			padding = label.box ? 0 : (label.padding || 0),
			bBox = label.getBBox(),
			off,

			options = {
				align: align,
				verticalAlign: verticalAlign,
				x: alignOptions.x,
				y: alignOptions.y,
				width: label.width,
				height: label.height
			},

			x = alignAttr.x - chart.plotLeft,
			y = alignAttr.y - chart.plotTop;

		// Off left
		off = x + padding;
		if (off < 0) {
			if (align === 'right') {
				options.align = 'left';
			} else {
				options.x = -off;
			}
		}

		// Off right
		off = x + bBox.width - padding;
		if (off > chart.plotWidth) {
			if (align === 'left') {
				options.align = 'right';
			} else {
				options.x = chart.plotWidth - off;
			}
		}

		// Off top
		off = y + padding;
		if (off < 0) {
			if (verticalAlign === 'bottom') {
				options.verticalAlign = 'top';
			} else {
				options.y = -off;
			}
		}

		// Off bottom
		off = y + bBox.height - padding;
		if (off > chart.plotHeight) {
			if (verticalAlign === 'top') {
				options.verticalAlign = 'bottom';
			} else {
				options.y = chart.plotHeight - off;
			}
		}

		return options;
	},


	/**
	 * Utility function for mapping item's options to element's attribute
	 *
	 * @function #attrsFromOptions
	 * @memberOf Highcharts.Annotation#
	 *
	 * @param {Object} options
	 * @return {Object} mapped options
	**/
	attrsFromOptions: function (options) {
		var map = this.attrsMap,
			attrs = {},
			key,
			mappedKey;

		for (key in options) {
			mappedKey = map[key];
			if (mappedKey) {
				attrs[mappedKey] = options[key];
			}
		}

		return attrs;
	}
};

/* ***************************************************************************
*
* EXTENDING CHART PROTOTYPE
*
**************************************************************************** */

H.extend(chartPrototype, {
	addAnnotation: function (userOptions, redraw) {
		var annotation = new Annotation(this, userOptions);

		this.annotations.push(annotation);

		if (pick(redraw, true)) {
			annotation.redraw();
		}

		return annotation;
	},

	removeAnnotation: function (id) {
		var annotations = this.annotations,
			annotation = find(annotations, function (annotation) {
				return annotation.options.id === id;
			});

		if (annotation) {
			erase(annotations, annotation);
			annotation.destroy();
		}
	},

	redrawAnnotations: function () {
		each(this.annotations, function (annotation) {
			annotation.redraw();
		});
	}
});


chartPrototype.callbacks.push(function (chart) {
	chart.annotations = [];

	each(chart.options.annotations, function (annotationOptions) {
		chart.addAnnotation(annotationOptions, false);
	});

	chart.redrawAnnotations();
	addEvent(chart, 'redraw', chart.redrawAnnotations);
});


H.wrap(chartPrototype, 'getContainer', function (p) {
	p.call(this);

	var renderer = this.renderer,
		options = this.options,
		key,
		markers,
		marker;

	options.defs = merge(options.defs || {}, { markers: defaultMarkers });
	markers = options.defs.markers;

	for (key in markers) {
		marker = markers[key];
		
		if (pick(marker.render, true)) {
			renderer.addMarker(marker.id, marker);			
		}
	}
});


/* ************************************************************************* */

/**
 * General symbol definition for labels with connector
 */
H.SVGRenderer.prototype.symbols.connector = function (x, y, w, h, options) {
	var anchorX = options && options.anchorX,
		anchorY = options && options.anchorY,
		path,
		yOffset,
		lateral = w / 2;

	if (isNumber(anchorX) && isNumber(anchorY)) {

		path = ['M', anchorX, anchorY];
		
		// Prefer 45 deg connectors
		yOffset = y - anchorY;
		if (yOffset < 0) {
			yOffset = -h - yOffset;
		}
		if (yOffset < w) {
			lateral = anchorX < x + (w / 2) ? yOffset : w - yOffset;
		}
		
		// Anchor below label
		if (anchorY > y + h) {
			path.push('L', x + lateral, y + h);

		// Anchor above label
		} else if (anchorY < y) {
			path.push('L', x + lateral, y);

		// Anchor left of label
		} else if (anchorX < x) {
			path.push('L', x, y + h / 2);
		
		// Anchor right of label
		} else if (anchorX > x + w) {
			path.push('L', x + w, y + h / 2);
		}
	}
	return path || [];
};
