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
	UNDEFINED,

	tooltipPrototype = H.Tooltip.prototype,
	seriesPrototype = H.Series.prototype,
	chartPrototype = H.Chart.prototype;


function MockPoint(chart, options) {
	this.init(chart, options);
}

MockPoint.prototype = {
	init: function (chart, options) {
		this.series = {
			forceDL: defined(options.forced) ? options.forced : false,
			visible: true,
			chart: chart,
			getPlotBox: seriesPrototype.getPlotBox,
			alignDataLabel: seriesPrototype.alignDataLabel,
			justifyDataLabel: seriesPrototype.justifyDataLabel
		};

		this.mock = true;

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

	getAlignToBox: function (forceTranslate) {
		if (forceTranslate) {
			this.translate()
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

function Annotation(chart, options) {
	this.init(chart, options);
}

Annotation.prototype = {
	shapesWithAnchor: ['callout', 'connector'],
	shapesWithoutBackground: ['connector'],
	/**
	 * Default options for an annotation
	**/
	defaultOptions: {
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
	 * @param {Object} userOptions
	 * @returns {undefined}
	**/

	init: function (chart, userOptions) {
		this.chart = chart;

		// keeps annotation's labels
		this.labels = [];
		this.shapes = [];

		this.setOptions(userOptions);

		each(this.options.labels || [], this.initLabel, this);
		each(this.options.shapes || [], this.initShape, this);
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
		this.redrawShapes();
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

	redrawShapes: function () {
		var shapes = this.shapes,
			i = shapes.length;

		// each(labels, this.redrawLabel, this) cannot be used - needs a backward loop
		// labels array might be modified due to destruction of some label
		while (i--) {
			this.redrawShape(shapes[i]);
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
		var chart = this.chart;

		each(this.labels, function (label) {
			label.destroy();
		});

		destroyObjectProperties(this, chart);
	},

	hideOverlappingLabels: chartPrototype.hideOverlappingLabels,

	initShape: function (shapeOptions) {
		var renderer = this.chart.renderer,
			options = merge(this.options.shapeOptions, shapeOptions),
			type = options.type,
			attr = this.itemOptionsToAttrs(options),

			shape = renderer[type] ? renderer[type](0, 0, 0, 0) : 
				renderer.symbols[type] ? renderer.symbol(type) : 'rect';

		shape.attr(attr);
		shape.options = options;
		this.shapes.push(shape);
	},

	redrawShape: function (shape) {
		var point = this.getLinkedPoint(shape),
			options = shape.options,
			parentGroup = shape.parentGroup,
			anchor,
			series = point.series,
			plotBox,
			ty, tx, translatedAnchor;

		if (!point) {
			this.destroyShape(shape);
		
		} else {
			if (!parentGroup) {
				shape.add(this.group);
			}

			anchor = point.mock ? point.getAlignToBox(true) : tooltipPrototype.getAnchor.call({
				chart: this.chart
			}, point);

			plotBox = series.getPlotBox(),
			tx = plotBox.translateX,
			ty = plotBox.translateY,
			translatedAnchor = {
				anchorX: anchor[0] + tx,
				anchorY: anchor[1] + ty
			};

			shape.attr({
				x: translatedAnchor.anchorX,
				y: translatedAnchor.anchorY
			});
		}
	},

	destroyShape: function (shape) {
		erase(this.shapes, shape);
		shape.destroy();
	},

	itemOptionsToAttrs: function (options) {
		var attrs = {
				fill: options.backgroundColor,
				stroke: options.borderColor,
				'stroke-width': options.borderWidth,
				zIndex: options.zIndex,
				width: options.width,
				height: options.height,
				r: pick(options.r, options.borderRadius),
				padding: options.padding
			},

			key;

		for (key in attrs) {
			if (attrs[key] === UNDEFINED) {
				delete attrs[key];
			}
		}

		return attrs;
	},

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

			style = options.style,

		// options for label's background
			// attr = {
			// 	fill: options.backgroundColor,
			// 	stroke: options.borderColor,
			// 	'stroke-width': options.borderWidth,
			// 	r: options.borderRadius,
			// 	padding: options.padding,
			// 	zIndex: options.zIndex
			// },
			attr = this.itemOptionsToAttrs(options),

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

		if (isNumber(options.distance) || options.positioner) {
		// if there are specified options for a tooltip-like positioning
		// label won't be aligned with data labels method
			label.noAlign = true;
		}

		label.options = options;

		// labelrank required for hideOverlappingLabels()
		label.labelrank = options.labelrank;
		label.annotation = this;

		label.attr(attr).css(style).shadow(options.shadow);

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
			text;

		if (!point) {
			this.destroyLabel(label);

		} else {
			if (!parentGroup) {
				this.renderLabel(label);
			}

			if (point.mock) {
				point.translate();
			}

			text = options.format || options.text;
			label.attr({
				text: text ? format(text, point.getLabelConfig()) : options.formatter.call(point)
			});

			// this.positionLabel(label);
			this.positionLabel(label);

		}
	},

	/**
	 * @param {Object} label an intiailised label object
	 * @returns {undefined}
	**/
	renderLabel: function (label) {
		label.add(this.group);
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
	 * @returns {MockPoint} a mock point
	**/
	createMockPoint: function (pointOptions) {
		return new MockPoint(this.chart, pointOptions);
	},


	/**
	 * Tooltip-like positioning of the label
	 *
	 * @param {Object} label
	 * @param {Object} point
	 * @returns {Object} position of the label
	**/
	// getLabelPosition: function (label, point, anchor) {
	// 	var chart = this.chart,
	// 		labelOptions = label.options,
	// 		position,

	// 		round = Math.round;

	// 	if (point.isInside !== false && point.series.visible) {
	// 		position = (labelOptions.positioner || tooltipPrototype.getPosition).call(
	// 			{
	// 				chart: chart,
	// 				distance: pick(labelOptions.distance, 16)
	// 			},
	// 			label.width,
	// 			label.height,
	// 			{
	// 				plotX: anchor.x,
	// 				plotY: anchor.y,
	// 				negative: point.negative,
	// 				ttBelow: point.ttBelow,
	// 				h: anchor.h
	// 			}
	// 		);

	// 		position.x = round(position.x);
	// 		position.y = round(position.y || 0);
	// 	}

	// 	return position || {
	// 		x: 0,
	// 		y: -9e9
	// 	};
	// },

	/**
	 * Data label - like position of the label
	 *
	 * @param {Object} label
	 * @param {Object} point
	 * @returns {undefined}
	**/
	alignLabel: function (label, point, alignTo) {
		var series = point.series,
			rawAlign = label.rawAlign = !(series.alignDataLabel && series.alignDataLabel !== H.noop),
			box = alignTo && {
				x: alignTo[0],
				y: alignTo[1],
				height: alignTo[2] || 0,
				width: alignTo[3] || 0
			};
		rawAlign = true
		if (!rawAlign) {
			series.alignDataLabel(
				point,
				label,
				label.options,
				box,
			//	label.placed
				true // true for not animating

			);

		} else {
			label.align(extend(label.options, {
				width: label.width,
				height: label.height
			}), null, box);
		}

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

	// positionLabel: function (label) {
	// 	var point = label.point,
	// 		series = point.series,
	// 		anchor = point.mock ? point.getAlignToBox() : tooltipPrototype.getAnchor.call({
	// 			chart: this.chart
	// 		}, point),

	// 		plotBox = series.getPlotBox(),
	// 		tx = plotBox.translateX,
	// 		ty = plotBox.translateY,
	// 		translatedAnchor = {
	// 			anchorX: anchor[0] + tx,
	// 			anchorY: anchor[1] + ty
	// 		},

	// 		labelPosition;


	// 	if (label.noAlign) {
	// 		labelPosition = this.getLabelPosition(label, point, anchor);
	// 		label.placed = true;

	// 		extend(labelPosition, translatedAnchor);

	// 		label.attr(labelPosition)

	// 	} else {
	// 		var a = anchor.slice()
	// 		a[0] += tx
	// 		a[1] += ty

	// 		this.alignLabel(label, point, a);

	// 		labelPosition = {
	// 			x: label.x + tx,
	// 			y: label.y + ty
	// 		};

	// 		if (label.rawAlign) {
	// 			extend(labelPosition, translatedAnchor);
	// 		}

	// 		label.attr(translatedAnchor)
	// 	}

	// 	if (label.placed) {
	// 	//	label.attr(labelPosition); //animate instead of attr is a workaround for zooming with animation

	// 		label.alignAttr = {
	// 			x: labelPosition.x,
	// 			y: labelPosition.y
	// 		};
	// 	}
	// },

	getAnchorPosition: function (label) {
		var labelOptions = label.options,
			point = label.point,
			series = point.series,
			inverted = this.chart.inverted,
			plotBox = point.series.getPlotBox(),

			box = point.mock ? point.getAlignToBox() : tooltipPrototype.getAnchor.call({
				chart: this.chart
			}, point),
			anchor = {
				x: box[0],
				y: box[1],
				height: box[2] || 0
			},

			dlBox = point.dlBox || point.shapeArgs,
			below,
			inside,
			overshoot;

		if (dlBox && !(defined(labelOptions.distance) || labelOptions.positioner)) {
			below = pick(point.below, point.plotY > pick(series.translatedThreshold, series.yAxis.len)),
			inside = pick(labelOptions.inside, !!series.options.stacking)
			anchor = merge(dlBox);

            if (anchor.y < 0) {
                anchor.height += anchor.y;
                anchor.y = 0;
            }
            overshoot = anchor.y + anchor.height - series.yAxis.len;
            if (overshoot > 0) {
                anchor.height -= overshoot;
            }

            if (inverted) {
                anchor = {
                    x: series.yAxis.len - anchor.y - anchor.height,
                    y: series.xAxis.len - anchor.x - anchor.width,
                    width: anchor.height,
                    height: anchor.width
                };
            }

            // Compute the alignment box
            if (!inside) {
                if (inverted) {
                    anchor.x += below ? 0 : anchor.width;
                    anchor.width = 0;
                } else {
                    anchor.y += below ? anchor.height : 0;
                    anchor.height = 0;
                }
            }
        }

		return {
			relativePosition: anchor,
			absolutePosition: merge(anchor, {
				x: anchor.x + plotBox.translateX,
				y: anchor.y + plotBox.translateY
			})
		};
	},

	getPosition: function (label, anchor) {
		var labelOptions = label.options,
			labelPosition;

		if (defined(labelOptions.distance) || labelOptions.positioner) {
			labelPosition = this.getLabelPosition(label, label.point, anchor.relativePosition);

			extend(labelPosition, {
				anchorX: anchor.absolutePosition.x,
				anchorY: anchor.absolutePosition.y
			});
		}

		return labelPosition;
	},

	adjustForColumns: function (label) {
		var options = label.options,
			point = label.point,
			inverted = this.chart.inverted,
            series = point.series,
            dlBox = point.dlBox || point.shapeArgs, // data label box for alignment
            below = pick(point.below, point.plotY > pick(series.translatedThreshold, series.yAxis.len)), // point.below is used in range series
            inside = pick(options.inside, !!series.options.stacking), // draw it inside the box?
            overshoot,
            alignTo = {};

        // Align to the column itself, or the top of it
        if (dlBox) { // Area range uses this method but not alignTo
            alignTo = merge(dlBox);

            if (alignTo.y < 0) {
                alignTo.height += alignTo.y;
                alignTo.y = 0;
            }
            overshoot = alignTo.y + alignTo.height - series.yAxis.len;
            if (overshoot > 0) {
                alignTo.height -= overshoot;
            }

            if (inverted) {
                alignTo = {
                    x: series.yAxis.len - alignTo.y - alignTo.height,
                    y: series.xAxis.len - alignTo.x - alignTo.width,
                    width: alignTo.height,
                    height: alignTo.width
                };
            }

            // Compute the alignment box
            if (!inside) {
                if (inverted) {
                    alignTo.x += below ? 0 : alignTo.width;
                    alignTo.width = 0;
                } else {
                    alignTo.y += below ? alignTo.height : 0;
                    alignTo.height = 0;
                }
            }
        }


        // When alignment is undefined (typically columns and bars), display the individual
        // point below or above the point depending on the threshold
        // options.align = pick(
        //     options.align, !inverted || inside ? 'center' : below ? 'right' : 'left'
        // );
        // options.verticalAlign = pick(
        //     options.verticalAlign,
        //     inverted || inside ? 'middle' : below ? 'top' : 'bottom'
        // );
        console.log(alignTo);
        return alignTo;
	},

	align: function (label, point, anchor) {
		var box = {
			x: anchor.x,
			y: anchor.y,
			height: anchor.h || anchor.height || 0,
			width: anchor.w || anchor.width || 0
		};

		// // label.placed = false;
		// label.align(extend(label.options, {
		// 	width: label.width,
		// 	height: label.height
		// }), null, box);
		
		// label[true ? 'attr' : 'animate']({
		// 	anchorX: anchor[0],
		// 	anchorY: anchor[1]
		// });

		// extend(box, this.adjustForColumns(label));

		// var plotBox = point.series.getPlotBox();
		// box.x += plotBox.translateX;
		// box.y += plotBox.translateY;

		var position = this.getAlignedPosition(
				extend(label.options, {
					width: label.width,
					height: label.height
				}),
				box
			);


		if (pick(label.options.overflow, 'justify') === 'justify') {
			position = this.getAlignedPosition(
				this.getJustifiedOptions(label, label.options, position),
				box
			);
		}

		label.alignAttr = position;
		label.placed = true;
		label.attr(extend(position, {
			anchorX: anchor.x,
			anchorY: anchor.y
		}));
		// label.alignAttr = {
		// 	x: label.x,
		// 	y: label.y
		// }
	},

	position: function (label) {
		var anchor = this.getAnchorPosition(label),
			labelPosition = this.getPosition(label, anchor);

		if (labelPosition) {
			label.attr(labelPosition);
			label.alignAttr = labelPosition;
		} else {
			this.align(label, label.point, anchor.absolutePosition)
		}
	},

	destroyLabel: function (label) {
		erase(this.labels, label);
		label.destroy();
	},

	getAlignedPosition: function (alignOptions, box) {
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
	    }
	},

	getJustifiedOptions: function (label, alignOptions, alignAttr) {
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

	positionLabel: function (label) {
		var anchor = this.getAnchor(label, label.point),
			attrs = this.getLabelPosition(label, anchor);

		if (attrs) {
			label.alignAttr = attrs;
			label.placed = true;

			attrs.anchorX = anchor.absolutePosition.x;
			attrs.anchorY = anchor.absolutePosition.y;

			label.attr(attrs)
		
		} else {
			label.placed = false;
			label.attr({
				x: 0,
				y: -9e9
			});
		}

	},

	getAnchor: function (label, point) {
		var labelOptions = label.options,
			series = point.series,
			inverted = this.chart.inverted,
			plotBox = point.series.getPlotBox(),

			box = point.mock ? point.getAlignToBox() : tooltipPrototype.getAnchor.call({
				chart: this.chart
			}, point),

			anchor = {
				x: box[0],
				y: box[1],
				height: box[2] || 0,
				width: box[3] || 0
			};

			// dlBox = point.dlBox || point.shapeArgs,
			// below,
			// inside,
			// overshoot;

		// if (dlBox && !(defined(labelOptions.distance) || labelOptions.positioner)) {
		// 	below = pick(point.below, point.plotY > pick(series.translatedThreshold, series.yAxis.len)),
		// 	inside = pick(labelOptions.inside, !!series.options.stacking)
		// 	anchor = merge(dlBox);

  //           if (anchor.y < 0) {
  //               anchor.height += anchor.y;
  //               anchor.y = 0;
  //           }
  //           overshoot = anchor.y + anchor.height - series.yAxis.len;
  //           if (overshoot > 0) {
  //               anchor.height -= overshoot;
  //           }

  //           if (inverted) {
  //               anchor = {
  //                   x: series.yAxis.len - anchor.y - anchor.height,
  //                   y: series.xAxis.len - anchor.x - anchor.width,
  //                   width: anchor.height,
  //                   height: anchor.width
  //               };
  //           }

  //           if (!inside) {
  //               if (inverted) {
  //                   anchor.x += below ? 0 : anchor.width;
  //                   anchor.width = 0;
  //               } else {
  //                   anchor.y += below ? anchor.height : 0;
  //                   anchor.height = 0;
  //               }
  //           }
        // }

		return {
			relativePosition: anchor,
			absolutePosition: merge(anchor, {
				x: anchor.x + plotBox.translateX,
				y: anchor.y + plotBox.translateY
			})
		};
	},

	getLabelPosition: function (label, anchor) {
		var chart = this.chart,
			point = label.point,
			labelOptions = label.options,
			anchorAbsolutePosition = anchor.absolutePosition,
			anchorRelativePosition = anchor.relativePosition,
			labelPosition,
			isInsidePlot,
			alignTo,

			visible = point.series.visible && point.isInside !== false;

		if (visible) {
			if (defined(labelOptions.distance) || labelOptions.positioner) {
				labelPosition = (labelOptions.positioner || tooltipPrototype.getPosition).call(
					{
						chart: chart,
						distance: pick(labelOptions.distance, 16)
					},
					label.width,
					label.height,
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
				
				labelPosition = this.getAlignedPosition(
					extend(labelOptions, {
						width: label.width,
						height: label.height
					}),
					alignTo
				);

				if (pick(label.options.overflow, 'justify') === 'justify') {
					labelPosition = this.getAlignedPosition(
						this.getJustifiedOptions(label, label.options, labelPosition),
						alignTo
					);
				}
			}



			if (labelOptions.crop) {
				isInsidePlot = function (x, y) {
					return x >= chart.plotLeft &&
						x <= chart.plotLeft + chart.plotWidth &&
						y >= chart.plotTop &&
						y <= chart.plotTop + chart.plotHeight;
				};

				visible = 
					isInsidePlot(labelPosition.x, labelPosition.y) &&
					isInsidePlot(labelPosition.x + label.width, labelPosition.y + label.height);
			}
		}

		return visible ? labelPosition : null;
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

		if (redraw) {
			this.redraw();
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
