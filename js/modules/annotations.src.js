/*
* TODO:
* - padding between a label, connector and point (should be handled by a specific symbol)
* - handle points types which have multiple values
*/

/**
* issues:
* - connectors after zooming/pointUpdating/chart-inversion are no longer placed correctly
*   looks like a bug in original data labels aligning logic)
**/

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Tooltip.js';

var merge = H.merge,
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


function MockPoint(chart, options) {
	this.mock = true;
	this.series = {
		visible: true,
		chart: chart,
		getPlotBox: seriesPrototype.getPlotBox
	};

	this.init(chart, options);
}

MockPoint.prototype = {
	init: function (chart, options) {
		var xAxisId = options.xAxis,
			xAxis = defined(xAxisId) ? chart.xAxis[xAxisId] || chart.get(xAxisId) : null,
			
			yAxisId = options.yAxis,
			yAxis = defined(yAxisId) ? chart.yAxis[yAxisId] || chart.get(yAxisId) : null;

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

	getLabelConfig: function () {
		return {
			x: this.x,
			y: this.y,
			point: this
		};
	}
};

function Annotation(chart, userOptions) {
	this.chart = chart;

	this.labels = [];
	this.shapes = [];

	this.options = merge(this.defaultOptions, userOptions);

	this.init(chart, userOptions);
}

Annotation.prototype = {
	shapesWithoutBackground: ['connector'],
	attrsMap: {
		backgroundColor: 'fill',
		borderColor: 'stroke',
		borderWidth: 'stroke-width',
		zIndex: 'zIndex',
		width: 'width',
		height: 'height',
		borderRadius: 'r',
		r: 'r',
		padding: 'padding'
	},
	/**
	 * Default options for an annotation
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
			rotation: 0,
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
			borderColor: 'black',
			borderWidth: 1,
			backgroundColor: 'none',
			// type: 'rect',
			borderRadius: 0
		},

		zIndex: 6
	},

	/**
	 * Annotation initialisation
	 *
	 * @param {Object} chart
	 * @param {Object} [userOptions]
	 * @returns {undefined}
	**/

	init: function (chart, userOptions) {
		each(this.options.labels || [], this.initLabel, this);
		each(this.options.shapes || [], this.initShape, this);
	},

	/**
	 * Main method for drawing an annotation, it is called everytime on chart redraw
	 * and once on chart's load
	 *
	 * @returns {undefined}
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
	 * @param {Array<Object>} items
	 * @returns {undefined}
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
	 * Creating svg groups for an annotation and labels
	 * it is called from redraw method
	 *
	 * @returns {undefined}
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
	 * @param {boolean} [visibility]
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
	 * @returns {undefined}
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

	hideOverlappingLabels: chartPrototype.hideOverlappingLabels,

	/**
	 * Destroying an annotation
	 *
	 * @returns {undefined}
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


	/* ******************************************************************************
	 * ITEM SECTION
	 * contains methods for handling a single item in an annotation
	******************************************************************************* */

	initShape: function (shapeOptions) {
		var renderer = this.chart.renderer,
			options = merge(this.options.shapeOptions, shapeOptions),
			attr = this.attrsFromOptions(options),

			type = renderer[options.type] ? options.type : 'rect',
			shape = renderer[type](0, -9e9, 0, 0);

		shape.type = type;
		shape.options = options;
		shape.itemType = 'shape';

		shape.attr(attr);

		this.shapes.push(shape);
	},

	/**
	 * Label initialisation
	 *
	 * @param {Object} labelOptions
	 * @returns {undefined}
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
				options.useHTML, // if true, events need to be attached to HTML and SVG elements
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

		label.options = options;
		label.itemType = 'label';

		// labelrank required for hideOverlappingLabels()
		label.labelrank = options.labelrank;
		label.annotation = this;

		label.attr(attr).css(style).shadow(options.shadow);

		this.labels.push(label);
	},

	redrawItem: function (item) {
		var point = this.linkPoint(item),
			itemOptions = item.options,
			text;

		if (!point) {
			this.destroyItem(item);

		} else {
			if (!item.parentGroup) {
				item.add(this.group);
			}

			if (item.itemType === 'label') {
				text = itemOptions.format || itemOptions.text;
				item.attr({
					text: text ? format(text, point.getLabelConfig()) : itemOptions.formatter.call(point)
				});
			}

			this.alignItem(item, !item.placed);
		}
	},

	destroyItem: function (item) {
		//erase from shapes or labels array
		erase(this[item.itemType + 's'], item);
		item.destroy();
	},

	/**
	 * Linking item with the point
	 *
	 * @param {Object} item
	 * @returns {Object | null} a point which a item is linked or a null if the point
	 * has not been found
	**/
	linkPoint: function (item) {
		var pointOptions = item.options.point,
			point = item.point;

		if (!point || point.series === null) {
		// check if the point does not exist or was destroyed/updated

			if (isObject(pointOptions)) {
			// if a point config is an object then it should require all information
			// needed to create a mock point
				point = this.mockPoint(pointOptions);
				item.point = point;

			
			} else if (isString(pointOptions)) {
				point = this.chart.get(pointOptions) || null;

				if (point) {
					item.point = point;
				}
			}
		}

		return point;
	},

	alignItem: function (item, isNew) {
		var anchor = this.itemAnchor(item, item.point),
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

	itemAnchor: function (item, point) {
		var plotBox = point.series.getPlotBox(),

			box = point.mock ? point.alignToBox(true) : tooltipPrototype.getAnchor.call({
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

	itemPosition: function (item, anchor) {
		var chart = this.chart,
			point = item.point,
			itemOptions = item.options,
			anchorAbsolutePosition = anchor.absolutePosition,
			anchorRelativePosition = anchor.relativePosition,
			itemPosition,
			isInsidePlot,
			alignTo,

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
				isInsidePlot = function (x, y) {
					return x >= chart.plotLeft &&
						x <= chart.plotLeft + chart.plotWidth &&
						y >= chart.plotTop &&
						y <= chart.plotTop + chart.plotHeight;
				};

				showItem = 
					isInsidePlot(itemPosition.x, itemPosition.y) &&
					isInsidePlot(itemPosition.x + item.width, itemPosition.y + item.height);
			}
		}

		return showItem ? itemPosition : null;
	},

	/**
	 * Returns new aligned position based alignment options and box to align to.
	 * It is almost a one-to-one copy from SVGElement.prototype.align except it does not use and mutate
	 * an element
	 *
	 * @param {Object} alignOptions
	 * @param {Object} box
	 * @returns {Object} aligned position
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
	 * It is almost a one-to-one copy from Series.prototype.justifyDataLabels except it does not mutate
	 * the label and it works with absolute instead of relative position
	 *
	 * @param {Object} label
	 * @param {Object} alignOptions
	 * @param {Object} alignAttr
	 * @returns {Object} justified options
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
	 * Creating a mock point for an item
	 *
	 * @param {Object} pointOptions
	 * @returns {MockPoint} a mock point
	**/
	mockPoint: function (pointOptions) {
		return new MockPoint(this.chart, pointOptions);
	},

	/**
	 * Utility function for mapping item's options to element's attribute
	 *
	 * @param {Object} options
	 * @returns {Object} mapped options
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

/* *******************************************************************************
*
* EXTENDING CHART PROTOTYPE
*
******************************************************************************* */

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
		chart.addAnnotation(annotationOptions);
	});

	chart.redrawAnnotations();
	addEvent(chart, 'redraw', chart.redrawAnnotations);
});


/* ****************************************************************************** */

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

H.defaultOptions.annotations = [];
H.Annotation = Annotation;
H.MockPoint = MockPoint;
