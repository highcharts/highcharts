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
import '../mixins/centered-series.js';
import drawPoint from '../mixins/draw-point.js';
import mixinTreeSeries from '../mixins/tree-series.js';
import '../parts/Series.js';
import './treemap.src.js';
var CenteredSeriesMixin = H.CenteredSeriesMixin,
	Series = H.Series,
	each = H.each,
	extend = H.extend,
	getCenter = CenteredSeriesMixin.getCenter,
	getColor = mixinTreeSeries.getColor,
	getStartAndEndRadians = CenteredSeriesMixin.getStartAndEndRadians,
	grep = H.grep,
	isBoolean = function (x) {
		return typeof x === 'boolean';
	},
	isNumber = H.isNumber,
	isObject = H.isObject,
	isString = H.isString,
	merge = H.merge,
	noop = H.noop,
	pick = H.pick,
	rad2deg = 180 / Math.PI,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	setTreeValues = mixinTreeSeries.setTreeValues,
	reduce = H.reduce;

var layoutAlgorithm = function layoutAlgorithm(parent, children) {
	var startAngle = parent.start,
		range = parent.end - startAngle,
		total = parent.val,
		x = parent.x,
		y = parent.y,
		innerRadius = parent.r,
		outerRadius = innerRadius + parent.radius;

	return reduce(children || [], function (arr, child) {
		var percentage = (1 / total) * child.val,
			radians = percentage * range,
			values = {
				x: x,
				y: y,
				innerR: innerRadius,
				r: outerRadius,
				radius: parent.radius,
				start: startAngle,
				end: startAngle + radians
			};
		arr.push(values);
		startAngle = values.end;
		return arr;
	}, []);
};

/**
 * getEndPoint - Find a set of coordinates given a start coordinates, an angle,
 *     and a distance.
 *
 * @param  {number} x Start coordinate x
 * @param  {number} y Start coordinate y
 * @param  {number} angle Angle in radians
 * @param  {number} distance Distance from start to end coordinates
 * @return {object} Returns the end coordinates, x and y.
 */
var getEndPoint = function getEndPoint(x, y, angle, distance) {
	return {
		x: x + (Math.cos(angle) * distance),
		y: y + (Math.sin(angle) * distance)
	};
};

var getDlOptions = function getDlOptions(params) {
	// Set options to new object to avoid problems with scope
	var shape = isObject(params.shapeArgs) ? params.shapeArgs : {},
		optionsSeries = (
			isObject(params.optionsSeries) ?
			params.optionsSeries.dataLabels :
			{}
		),
		optionsPoint = (
			isObject(params.optionsPoint) ?
			params.optionsPoint.dataLabels :
			{}
		),
		optionsLevel = (
			isObject(params.level) ?
			params.level.dataLabels :
			{}
		),
		options = merge({
			rotationMode: 'perpendicular',
			style: {
				width: shape.radius
			}
		}, optionsSeries, optionsLevel, optionsPoint),
		rotationRad,
		rotation;
	if (!isNumber(options.rotation)) {
		rotationRad = (shape.end - (shape.end - shape.start) / 2);
		rotation = (rotationRad * rad2deg) % 180;
		if (options.rotationMode === 'parallel') {
			rotation -= 90;
		}
		// Data labels should not rotate beyond 90 degrees, for readability.
		if (rotation > 90) {
			rotation -= 180;
		}
		options.rotation = rotation;
	}
	// NOTE: alignDataLabel positions the data label differntly when rotation is
	// 0. Avoiding this by setting rotation to a small number.
	if (options.rotation === 0) {
		options.rotation =  0.001;
	}
	return options;
};

var getAnimation = function getAnimation(shape, params) {
	var center = params.center,
		point = params.point,
		radians = params.radians,
		innerR = params.innerR,
		idRoot = params.idRoot,
		idPreviousRoot = params.idPreviousRoot,
		shapeExisting = params.shapeExisting,
		shapeRoot = params.shapeRoot,
		shapePreviousRoot = params.shapePreviousRoot,
		visible = params.visible,
		from = {},
		to = {
			end: shape.end,
			start: shape.start,
			innerR: shape.innerR,
			r: shape.r,
			x: center.x,
			y: center.y
		};
	if (visible) {
		// Animate points in
		if (!point.graphic && shapePreviousRoot) {
			if (idRoot === point.id) {
				from = {
					start: radians.start,
					end: radians.end
				};
			} else {
				from = (shapePreviousRoot.end <= shape.start) ? {
					start: radians.end,
					end: radians.end
				} : {
					start: radians.start,
					end: radians.start
				};
			}
			// Animate from center and outwards.
			from.innerR = from.r = innerR;
		}
	} else {
		// Animate points out
		if (point.graphic) {
			if (idPreviousRoot === point.id) {
				to = {
					innerR: innerR,
					r: innerR
				};
			} else if (shapeRoot) {
				to = (shapeRoot.end <= shapeExisting.start) ?
				{
					innerR: innerR,
					r: innerR,
					start: radians.end,
					end: radians.end
				} : {
					innerR: innerR,
					r: innerR,
					start: radians.start,
					end: radians.start
				};
			}
		}
	}
	return {
		from: from,
		to: to
	};
};

var setShapeArgs = function setShapeArgs(parent, parentValues) {
	var childrenValues = [],
		// Collect all children which should be included
		children = grep(parent.children, function (n) {
			return n.visible;
		});
	childrenValues = layoutAlgorithm(parentValues, children);
	each(children, function (child, index) {
		var values = childrenValues[index],
			angle = values.start + ((values.end - values.start) / 2),
			radius = values.innerR + ((values.r - values.innerR) / 2),
			isCircle = (
				values.innerR === 0 &&
				(values.end - values.start) > 6.28
			),
			center = (
				isCircle ?
				{ x: values.x, y: values.y } :
				getEndPoint(values.x, values.y, angle, radius)
			),
			val = (
				child.val ?
				(
					child.childrenTotal > child.val ?
					child.childrenTotal :
					child.val
				) :
				child.childrenTotal
			);
		child.shapeArgs = merge(values, {
			plotX: center.x,
			plotY: center.y
		});
		child.values = merge(values, {
			val: val
		});
		// If node has children, then call method recursively
		if (child.children.length) {
			setShapeArgs(child, child.values);
		}
	});
};

var getDrillId = function getDrillId(point, idRoot, mapIdToNode) {
	var drillId,
		node = point.node,
		nodeRoot;
	if (!node.isLeaf) {
		// When it is the root node, the drillId should be set to parent.
		if (idRoot === point.id) {
			nodeRoot = mapIdToNode[idRoot];
			drillId = nodeRoot.parent;
		} else {
			drillId = point.id;
		}
	}
	return drillId;
};

var cbSetTreeValuesBefore = function before(node, options) {
	var mapIdToNode = options.mapIdToNode,
		nodeParent = mapIdToNode[node.parent],
		series = options.series,
		chart = series.chart,
		points = series.points,
		point = points[node.i],
		colorInfo = getColor(node, {
			colors: chart && chart.options && chart.options.colors,
			colorIndex: series.colorIndex,
			colorByPoint: series.colorByPoint,
			index: options.index,
			levelMap: options.levelMap,
			parentColor: nodeParent && nodeParent.color,
			parentColorIndex: nodeParent && nodeParent.colorIndex,
			series: options.series,
			siblings: options.siblings
		});
	node.color = colorInfo.color;
	node.colorIndex = colorInfo.colorIndex;
	if (point) {
		point.color = node.color;
		point.colorIndex = node.colorIndex;
	}
	return node;
};

/**
 * A Sunburst displays hierarchical data, where a level in the hierarchy is represented by a circle.
 * The center represents the root node of the tree.
 * The visualization bears a resemblance to both treemap and pie charts.
 *
 * @extends {plotOptions.pie}
 * @sample highcharts/demo/sunburst Sunburst chart
 * @excluding allAreas, center, clip, colorAxis, compare, compareBase,
 *            dataGrouping, depth, endAngle, gapSize, gapUnit,
 *            ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *            minSize, navigatorOptions, pointRange, slicedOffset
 * @product highcharts
 * @optionparent plotOptions.sunburst
 */
var sunburstOptions = {
	/**
	 * The center of the sunburst chart relative to the plot area. Can be
	 * percentages or pixel values.
	 *
	 * @type {Array<String|Number>}
	 * @sample {highcharts} highcharts/plotoptions/pie-center/ Centered at 100, 100
	 * @product highcharts
	 */
	center: ['50%', '50%'],
	/**
	 * @extends plotOptions.series.dataLabels
	 * @excluding align,allowOverlap,staggerLines,step
	 */
	dataLabels: {
		defer: true,
		style: {
			textOverflow: 'ellipsis'
		},
		/**
		 * Decides how the data label will be rotated according to the perimeter
		 * of the sunburst. It can either be parallel or perpendicular to the
		 * perimeter.
		 * `series.rotation` takes precedence over `rotationMode`.
		 * @since 6.0.0
		 * @validvalue ["perpendicular", "parallel"]
		 */
		rotationMode: 'perpendicular'
	},
	/**
	 * Which point to use as a root in the visualization.
	 *
	 * @type {String|undefined}
	 * @default undefined
	 */
	rootId: undefined,

	/**
	 * Used together with the levels and `allowDrillToNode` options. When
	 * set to false the first level visible when drilling is considered
	 * to be level one. Otherwise the level will be the same as the tree
	 * structure.
	 */
	levelIsConstant: true
	/**
	 * Set options on specific levels. Takes precedence over series options,
	 * but not point options.
	 *
	 * @type {Array<Object>}
	 * @sample highcharts/demo/sunburst Sunburst chart
	 * @apioption plotOptions.sunburst.levels
	 */
	/**
	 * Can set a `borderColor` on all points which lies on the same level.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.borderColor
	 */
	/**
	 * Can set a `borderWidth` on all points which lies on the same level.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.borderWidth
	 */
	/**
	 * Can set a `borderDashStyle` on all points which lies on the same level.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.borderDashStyle
	 */
	/**
	 * Can set a `color` on all points which lies on the same level.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.color
	 */
	/**
	 * Can set a `colorVariation` on all points which lies on the same level.
	 *
	 * @type {Object}
	 * @apioption plotOptions.sunburst.levels.colorVariation
	 */
	/**
	 * The key of a color variation. Currently supports `brightness` only.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.colorVariation.key
	 */
	/**
	 * The ending value of a color variation. The last sibling will receive this
	 * value.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.colorVariation.to
	 */
	/**
	 * Can set a `dataLabels` on all points which lies on the same level.
	 *
	 * @type {Object}
	 * @apioption plotOptions.sunburst.levels.dataLabels
	 */
	/**
	 * Can set a `rotation` on all points which lies on the same level.
	 *
	 * @type {Number}
	 * @apioption plotOptions.sunburst.levels.rotation
	 */
	/**
	 * Can set a `rotationMode` on all points which lies on the same level.
	 *
	 * @type {String}
	 * @apioption plotOptions.sunburst.levels.rotationMode
	 */
	/**
	 * When enabled the user can click on a point which is a parent and
	 * zoom in on its children.
	 *
	 * @sample highcharts/demo/sunburst
	 *         Allow drill to node
	 * @type {Boolean}
	 * @default false
	 * @apioption plotOptions.sunburst.allowDrillToNode
	 */	
};

/**
 * Properties of the Sunburst series.
 */
var sunburstSeries = {
	drawDataLabels: noop, // drawDataLabels is called in drawPoints
	drawPoints: function drawPoints() {
		var series = this,
			levelMap = series.levelMap,
			shapeRoot = series.shapeRoot,
			group = series.group,
			hasRendered = series.hasRendered,
			idRoot = series.rootNode,
			idPreviousRoot = series.idPreviousRoot,
			nodeMap = series.nodeMap,
			nodePreviousRoot = nodeMap[idPreviousRoot],
			shapePreviousRoot = nodePreviousRoot && nodePreviousRoot.shapeArgs,
			points = series.points,
			radians = series.startAndEndRadians,
			chart = series.chart,
			optionsChart = chart && chart.options && chart.options.chart || {},
			animation = (
				isBoolean(optionsChart.animation) ?
				optionsChart.animation :
				true
			),
			positions = series.center,
			center = {
				x: positions[0],
				y: positions[1]
			},
			innerR = positions[3] / 2,
			renderer = series.chart.renderer,
			animateLabels,
			animateLabelsCalled = false,
			addedHack = false,
			hackDataLabelAnimation = !!(
				animation &&
				hasRendered &&
				idRoot !== idPreviousRoot &&
				series.dataLabelsGroup
			);

		if (hackDataLabelAnimation) {
			series.dataLabelsGroup.attr({ opacity: 0 });
			animateLabels = function () {
				var s = series;
				animateLabelsCalled = true;
				if (s.dataLabelsGroup) {
					s.dataLabelsGroup.animate({ opacity: 1, visibility: 'visible' });
				}
			};
		}
		each(points, function (point) {
			var node = point.node,
				level = levelMap[node.levelDynamic],
				shapeExisting = point.shapeExisting || {},
				shape = node.shapeArgs || {},
				attrStyle = series.pointAttribs(point, point.selected && 'select'),
				animationInfo,
				onComplete,
				visible = !!(node.visible && node.shapeArgs);
			if (hasRendered && animation) {
				animationInfo = getAnimation(shape, {
					center: center,
					point: point,
					radians: radians,
					innerR: innerR,
					idRoot: idRoot,
					idPreviousRoot: idPreviousRoot,
					shapeExisting: shapeExisting,
					shapeRoot: shapeRoot,
					shapePreviousRoot: shapePreviousRoot,
					visible: visible
				});
			} else {
				// When animation is disabled, attr is called from animation.
				animationInfo = {
					to: shape,
					from: {}
				};
			}
			extend(point, {
				shapeExisting: shape, // Store for use in animation
				tooltipPos: [shape.plotX, shape.plotY],
				drillId: getDrillId(point, idRoot, nodeMap),
				name: '' + (point.name || point.id || point.index),
				plotX: shape.plotX, // used for data label position
				plotY: shape.plotY, // used for data label position
				value: node.val,
				isNull: !visible // used for dataLabels & point.draw
			});
			point.dlOptions = getDlOptions({
				level: level,
				optionsPoint: point.options,
				optionsSeries: series.options,
				shapeArgs: shape
			});
			if (!addedHack && visible) {
				addedHack = true;
				onComplete = animateLabels;
			}
			point.draw({
				animate: animationInfo.to,
				attr: extend(animationInfo.from, attrStyle),
				onComplete: onComplete,
				group: group,
				renderer: renderer,
				shapeType: 'arc',
				shapeArgs: shape
			});
		});
		// Draw data labels after points
		// TODO draw labels one by one to avoid addtional looping
		if (hackDataLabelAnimation && addedHack) {
			series.hasRendered = false;
			series.options.dataLabels.defer = true;
			Series.prototype.drawDataLabels.call(series);
			series.hasRendered = true;
			// If animateLabels is called before labels were hidden, then call
			// it again.
			if (animateLabelsCalled) {
				animateLabels();
			}
		} else {
			Series.prototype.drawDataLabels.call(series);
		}
	},
	pointAttribs: seriesTypes.column.prototype.pointAttribs,
	translate: function translate() {
		var series = this,
			options = series.options,
			positions = series.center = getCenter.call(series),
			radians = series.startAndEndRadians = getStartAndEndRadians(options.startAngle, options.endAngle),
			innerRadius = positions[3] / 2,
			outerRadius = positions[2] / 2,
			idRoot = series.rootNode = pick(series.rootNode, options.rootId, ''),
			mapIdToNode = series.nodeMap,
			idTop,
			nodeRoot = mapIdToNode && mapIdToNode[idRoot],
			nodeTop,
			radiusPerLevel,
			tree,
			height,
			values;
		series.shapeRoot = nodeRoot && nodeRoot.shapeArgs;
		// Call prototype function
		Series.prototype.translate.call(series);
		// Create a object map from level to options
		series.levelMap = reduce(series.options.levels || [],
			function (arr, item) {
				arr[item.level] = item;
				return arr;
			}, {});
		// @todo Only if series.isDirtyData is true
		tree = series.tree = series.getTree();
		mapIdToNode = series.nodeMap;
		nodeRoot = mapIdToNode[idRoot];
		idTop = isString(nodeRoot.parent) ? nodeRoot.parent : '';
		nodeTop = mapIdToNode[idTop];
		// TODO Try to combine setTreeValues & setColorRecursive to avoid
		//  unnecessary looping.
		setTreeValues(tree, {
			before: cbSetTreeValuesBefore,
			idRoot: idRoot,
			levelIsConstant: options.levelIsConstant,
			levelMap: series.levelMap,
			mapIdToNode: mapIdToNode,
			points: series.points,
			series: series
		});
		height = (idRoot === idTop) ? nodeRoot.height : nodeRoot.height + 1;
		radiusPerLevel = (outerRadius - innerRadius) / height;
		values = mapIdToNode[''].shapeArgs = {
			end: radians.end,
			r: innerRadius,
			radius: radiusPerLevel,
			start: radians.start,
			val: nodeTop.val,
			x: positions[0],
			y: positions[1]
		};
		setShapeArgs(nodeTop, values);
	},

	/**
	 * Animate the slices in. Similar to the animation of polar charts.
	 */
	animate: function (init) {
		var chart = this.chart,
			center = [
				chart.plotWidth / 2,
				chart.plotHeight / 2
			],
			plotLeft = chart.plotLeft,
			plotTop = chart.plotTop,
			attribs, 
			group = this.group;

		// Initialize the animation
		if (init) {

			// Scale down the group and place it in the center
			attribs = {
				translateX: center[0] + plotLeft,
				translateY: center[1] + plotTop,
				scaleX: 0.001, // #1499
				scaleY: 0.001,
				rotation: 10,
				opacity: 0.01
			};

			group.attr(attribs);

		// Run the animation
		} else {
			attribs = {
				translateX: plotLeft,
				translateY: plotTop,
				scaleX: 1,
				scaleY: 1,
				rotation: 0,
				opacity: 1
			};
			group.animate(attribs, this.options.animation);

			// Delete this function to allow it only once
			this.animate = null;
		}
	}
};

/**
 * Properties of the Sunburst series.
 */
var sunburstPoint = {
	draw: drawPoint,
	shouldDraw: function shouldDraw() {
		var point = this;
		return !point.isNull;
	}
};

/**
 * A `sunburst` series. If the [type](#series.sunburst.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 * 
 * For options that apply to multiple series, it is recommended to add
 * them to the [plotOptions.series](#plotOptions.series) options structure.
 * To apply to all series of this specific type, apply it to [plotOptions.
 * sunburst](#plotOptions.sunburst).
 * 
 * @type {Object}
 * @extends plotOptions.sunburst
 * @excluding dataParser,dataURL,stack
 * @product highcharts
 * @apioption series.sunburst
 */

/** 
 * @type {Array<Object|Number>}
 * @extends series.treemap.data
 * @excluding x,y
 * @product highcharts
 * @apioption series.sunburst.data
 */

/**
* The value of the point, resulting in a relative area of the point
* in the sunburst.
* 
* @type {Number}
* @default undefined
* @since 6.0.0
* @product highcharts
* @apioption series.sunburst.data.value
*/

/**
 * Use this option to build a tree structure. The value should be the id of the
 * point which is the parent. If no points has a matching id, or this option is
 * undefined, then the parent will be set to the root.
 * 
 * @type {String|undefined}
 * @default undefined
 * @since 6.0.0
 * @product highcharts
 * @apioption series.treemap.data.parent
 */
seriesType(
	'sunburst',
	'treemap',
	sunburstOptions,
	sunburstSeries,
	sunburstPoint
);
