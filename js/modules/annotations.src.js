/*
* TODO:
* - padding between a label, connector and point (should be handled by a specific symbol)
* - handle points types which have multiple values
* - inverted chart - needs additional group for label which is attached to x, y (in axis scales)
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
	each = H.each,
	isString = H.isString,
	isNumber = H.isNumber,
	defined = H.defined,
	isObject = H.isObject,
	inArray = H.inArray,
	erase = H.erase,
	find = H.find,
	format = H.format,
	destroyObjectProperties = H.destroyObjectProperties,

	tooltipPrototype = H.Tooltip.prototype,
	seriesPrototype = H.Series.prototype,
	chartPrototype = H.Chart.prototype;

function Annotation(chart, options) {
	this.init(chart, options);
}

Annotation.prototype = {
	shapesWithAnchors: ['callout', 'connector'],
	/**
	 * Default options for an annotation
	**/
	defaultOptions: {
		labelOptions: {
			align: 'center',
			allowOverlap: false,
			backgroundColor: 'rgba(0, 0, 0, 0.75)',
			borderColor: 'black',
			borderRadius: 5,
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
				color: 'red'
			},
			useHTML: false,
			verticalAlign: 'bottom',
			x: 0,
			y: 0
			// distance: 16
			// zIndex: 6
		},

		zIndex: 6
	},

	/**
	 * Annotation initialisation
	 *
	 * @param {Object} chart
	 * @param {Object} userOptions
	 * @returns {undefined}
	**/

	init: function (chart, userOptions) {
		this.chart = chart;

		// keeps annotation's labels
		this.labels = [];

		// keeps groups for a series - if a label is linked to a real point
		// we create a group with the same translation as the point's group
		// it is needed for aligning label
		// key for series groups are series._i
		this.labelGroups = {};

		this.setOptions(userOptions);

		each(this.options.labels || [], this.initLabel, this);
	},

	/**
	 * Merging default options with the user options
	 *
	 * @param {Object} userOptions options specified by the user
	 * @returns {undefined}
	**/
	setOptions: function (userOptions) {
		this.options = merge(this.defaultOptions, userOptions);
	},


	/**
	 * Main method for drawing/redrawing an annotation, it is called everytime on chart redraw
	 * and once on chart's load
	 *
	 * @returns {undefined}
	**/
	redraw: function () {
		if (!this.group) {
			this.render();
		}

		this.redrawLabels();
	},

	/**
	 * Redrawing all labels and hiding on overlap
	 *
	 * @returns {undefined}
	**/
	redrawLabels: function () {
		var labels = this.labels,
			i = labels.length;

		// each(labels, this.redrawLabel, this) cannot be used - needs a backward loop
		// labels array might be modified due to destruction of some label
		while (i--) {
			this.redrawLabel(labels[i]);
		}

		this.collectAndHideLabels();
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
					translateY: 0
				})
				.add();
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

	/**
	 * Destroying an annotation
	 *
	 * @returns {undefined}
	**/
	destroy: function () {
		var chart = this.chart,
			labelGroups = this.labelGroups,
			key;

		each(this.labels, function (label) {
			label.destroy();
		});

		for (key in labelGroups) {
			if (labelGroups.hasOwnProperty(key)) {
				labelGroups[key].destroy();
			}
		}

		destroyObjectProperties(this, chart);
	},

	hideOverlappingLabels: chartPrototype.hideOverlappingLabels,

	/* ******************************************************************************
	 * LABEL SECTION
	 * contains methods for handling a single label in an annotation
	******************************************************************************* */

	/**
	 * Label initialisation
	 *
	 * @param {Object} labelOptions
	 * @returns {undefined}
	**/
	initLabel: function (labelOptions) {
		var options = merge(this.options.labelOptions, labelOptions),

		// options for label's background
			attr = {
				fill: options.backgroundColor,
				stroke: options.borderColor,
				'stroke-width': options.borderWidth,
				r: options.borderRadius,
				padding: options.padding,
				zIndex: options.zIndex
			},

			label = this.chart.renderer.label(
				'',
				0, -9e9,
				options.shape,
				null,
				null,
				options.useHTML, // call on Kacper in case of attaching events
				null,
				'annotation-label'
			);

		if (isNumber(options.distance) || options.positioner) {
		// if there are specified options for a tooltip-like positioning
		// label won't be aligned with data labels method
			label.noAlign = true;
		}

		label.options = options;

		// labelrank requires for hideOverlappingLabels()
		label.labelrank = options.labelrank;
		label.annotation = this;

		label.attr(attr).css(options.style).shadow(options.shadow);

		this.labels.push(label);
	},


	/**
	 * Redrawing a label
	 *
	 * @param {Object} label
	 * @returns {undefined}
	**/
	redrawLabel: function (label) {
		var point = this.getLinkedPoint(label),
			options = label.options,
			parentGroup = label.parentGroup,
			text,
			series,
			position,
			seriesPlotBox;

		if (!point) {
			this.destroyLabel(label);

		} else {
			series = point.series;

			if (!parentGroup) {
				this.renderLabel(label);
				parentGroup = label.parentGroup;
			}

			if (!point.mock) {
			// if it is a real point it might be needed to update its group translation
				seriesPlotBox = series.getPlotBox();

				if (
					parentGroup.translateX !== seriesPlotBox.translateX ||
					parentGroup.translateY !== seriesPlotBox.translateY
					) {
					parentGroup.attr(seriesPlotBox);
				}
			
			} else {
			// if it is a mock point point's plotX, plotY must be updated
				point.translate();
			}

			text = options.format || options.text;
			label.attr({
				text: text ? format(text, point.getLabelConfig()) : options.formatter.call(point)
			});

			if (label.noAlign) {
				position = this.getLabelPosition(label, point);

				label.attr(position);

				/* these are needed for hideOverlappingLabels() */
				label.alignAttr = {
					x: position.x,
					y: position.y
				};
				label.placed = true;
				/**/
			
			} else {
				this.alignLabel(label, point);
			}

		}
	},

	/**
	 * Creating svg groups for labels and a store in series object for labels groups
	 *
	 * @param {Object} label an intiailised label object
	 * @returns {undefined}
	**/
	renderLabel: function (label) {
		var group = this.group,
			point = label.point,
			series,
			labelGroup,
			seriesId;

		if (!point.mock) {
		// if it is a real point it creates a mirror group of the point for the label
		// if the group is already created it is stored in the series
			series = point.series;
			seriesId = series._i;
			labelGroup = this.labelGroups[seriesId];

			if (!labelGroup) {
			// if the mirror series group is not found, create it and link them
				labelGroup = this.labelGroups[seriesId] = this.chart.renderer.g('annotation-label')
					.attr({
						zIndex: 1
					})
					.add(group);

				labelGroup.series = series;
			}
		} else {
		// a mock point does not need a special group - its group is a main annotation group
			labelGroup = group;
		}

		label.add(labelGroup);
	},



	/**
	 * Linking label with points
	 *
	 * @param {Object} label
	 * @returns {Object | null} a point which a label is linked or a null if the point
	 * has not been found
	**/
	getLinkedPoint: function (label) {
		var pointOptions = label.options.point,
			point = label.point;

		if (!point || point.series === null) {
		// check if the point does not exist or was destroyed/updated

			if (isObject(pointOptions)) {
			// if a point config is an object then it should require all information
			// needed to create a mock point
				point = this.createMockPoint(pointOptions);
				label.point = point;

			
			} else if (isString(pointOptions)) {
				point = this.chart.get(pointOptions) || null;

				if (point) {
					label.point = point;
				}
			}
		}

		return point;
	},


	/**
	 * Creating a mock point for ta label
	 *
	 * @param {Object} pointOptions
	 * @returns {Object} a mock point
	**/
	createMockPoint: function (pointOptions) {
		var chart = this.chart,
			
			// initialise a mock point
			point = {
				series: {
					chart: chart,
					visible: true,
					getPlotBox: seriesPrototype.getPlotBox,
					alignDataLabel: seriesPrototype.alignDataLabel,
					justifyDataLabel: seriesPrototype.justifyDataLabel
					
				},
				mock: true,
				translate: function () {
					var series = this.series,
						xAxis = series.xAxis,
						yAxis = series.yAxis,
						plotX = point.plotX,
						plotY = point.plotY,
						isInside = true;

					if (xAxis) {
						point.plotX = plotX = xAxis.toPixels(this.x/* , chart.inverted */);
						isInside = plotX >= 0 && plotX <= xAxis.len;
					}

					if (yAxis) {
						point.plotY = plotY = yAxis.toPixels(this.y/* , chart.inverted */);
						isInside = isInside && plotY >= 0 && plotY <= yAxis.len;
					}

					this.isInside = isInside;
				},
				getLabelConfig: function () {
						return {
							x: this.x,
							y: this.y,
							point: this
						};
					}
			},

			xAxisId = pointOptions.xAxis,
			xAxis = defined(xAxisId) ? chart.xAxis[xAxisId] || chart.get(xAxisId) : null,
			
			yAxisId = pointOptions.yAxis,
			yAxis = defined(yAxisId) ? chart.yAxis[yAxisId] || chart.get(yAxisId) : null;

		// check if axis is assigned in the options, if it is not x and y are pixels
		// otherwise they are values in the specified axis' scale
		if (xAxis) {
			point.x = pointOptions.x;
			point.series.xAxis = xAxis;
		} else {
			point.plotX = pointOptions.x;
		}

		if (yAxis) {
			point.y = pointOptions.y;
			point.series.yAxis = yAxis;
		} else {
			point.plotY = pointOptions.y;
		}

		return point;
	},



	/**
	 * Tooltip-like positioning of the label
	 *
	 * @param {Object} label
	 * @param {Object} point
	 * @returns {Object} position of the label
	**/
	getLabelPosition: function (label, point) {
		var chart = this.chart,
			labelOptions = label.options,
			shape = label.options.shape,
			position,
			seriesPlotBox,

			round = Math.round;

		if (point.isInside && point.series.type !== 'pie') {

			position = (labelOptions.positioner || tooltipPrototype.getPosition).call({
				chart: chart,
				distance: labelOptions.distance || 16
			}, label.width, label.height, point);

			// the position must be adjusted with group's translation
			if (!point.mock) {
				seriesPlotBox = point.series.getPlotBox();
				position.x -= seriesPlotBox.translateX;
				position.y -= seriesPlotBox.translateY;
			}

			position.x = round(position.x);
			position.y = round(position.y || 0);

			if (inArray(shape, this.shapesWithAnchors) > -1) {
			// create an array shapes with anchors
				position.anchorX = round(point.plotX);
				position.anchorY = round(point.plotY);
			}
		}

		return position || {
			x: 0,
			y: -9e9
		};
	},

	/**
	 * Data label - like position of the label
	 *
	 * @param {Object} label
	 * @param {Object} point
	 * @returns {undefined}
	**/
	alignLabel: function (label, point) {
		point.series.alignDataLabel(
			point,
			label,
			label.options,
			null,
			true // true for not animating
		);

		/* Workaround for bad placing anchor on animation */
		// if (label.placed) {
		//     setTimeout(function () {
		//         label.attr({
		//            anchorX: point.plotX, // + plotBox.translateX,
		//            anchorY: point.plotY // + plotBox.translateY
		//         });
		//     }, 0);
		// }
	},


	destroyLabel: function (label) {
		erase(this.labels, label);
		label.destroy();
	}
};

/* *******************************************************************************
*
* EXTENDING CHART PROTOTYPE
*
******************************************************************************* */

H.extend(chartPrototype, {
	addAnnotation: function (userOptions) {
		var annotation = new Annotation(this, userOptions);

		this.annotations.push(annotation);
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