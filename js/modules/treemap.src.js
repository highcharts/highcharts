/**
 * (c) 2014 Highsoft AS
 * Authors: Jon Arild Nygard / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
import '../parts/Color.js';

var seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	map = H.map,
	merge = H.merge,
	extend = H.extend,
	noop = H.noop,
	each = H.each,
	grep = H.grep,
	isNumber = H.isNumber,
	isString = H.isString,
	pick = H.pick,
	Series = H.Series,
	stableSort = H.stableSort,
	color = H.Color,
	eachObject = function (list, func, context) {
		context = context || this;
		H.objectEach(list, function (val, key) {
			func.call(context, val, key, list);
		});
	},
	reduce = function (arr, func, previous, context) {
		context = context || this;
		arr = arr || []; // @note should each be able to handle empty values automatically?
		each(arr, function (current, i) {
			previous = func.call(context, previous, current, i, arr);
		});
		return previous;
	},
	// @todo find correct name for this function. 
	// @todo Similar to reduce, this function is likely redundant
	recursive = function (item, func, context) {
		var next;
		context = context || this;
		next = func.call(context, item);
		if (next !== false) {
			recursive(next, func, context);
		}
	};

// The Treemap series type
/**
 * @extends {plotOptions.scatter}
 * @optionparent plotOptions.treemap
 */
seriesType('treemap', 'scatter', {

	/**
	 * Whether to display this series type or specific series item in the
	 * legend.
	 * 
	 * @type {Boolean}
	 * @default false
	 * @product highcharts
	 */
	showInLegend: false,

	/**
	 */
	marker: false,

	/**
	 * @extends plotOptions.heatmap.dataLabels
	 * @since 4.1.0
	 * @product highcharts
	 */
	dataLabels: {

		/**
		 * Enable or disable the data labels.
		 * 
		 * @type {Boolean}
		 * @sample {highcharts} highcharts/plotoptions/series-datalabels-enabled/ Data labels enabled
		 * @default true
		 * @since 4.1.0
		 * @product highcharts
		 */
		enabled: true,

		/**
		 * Whether to defer displaying the data labels until the initial series
		 * animation has finished.
		 * 
		 * @type {Boolean}
		 * @default false
		 * @since 4.1.0
		 * @product highcharts
		 */
		defer: false,

		/**
		 * The vertical alignment of a data label. Can be one of top, middle
		 * or bottom. The default value depends on the data, for instance
		 * in a column chart, the label is above positive values and below
		 * negative values.
		 * 
		 * @type {String}
		 * @default middle
		 * @since 4.1.0
		 * @product highcharts
		 */
		verticalAlign: 'middle',

		/**
		 */
		formatter: function () { // #2945
			return this.point.name || this.point.id;
		},

		/**
		 * Whether to align the data label inside the box or to the actual
		 * value point.
		 * 
		 * @type {Boolean}
		 * @default true
		 * @since 4.1.0
		 * @product highcharts
		 */
		inside: true
	},

	/**
	 * @extends plotOptions.heatmap.tooltip
	 * @since 4.1.0
	 * @product highcharts
	 */
	tooltip: {

		/**
		 * The HTML of the tooltip header line. Variables are enclosed by
		 * curly brackets. Available variables are point.key, series.name,
		 * series.color and other members from the point and series objects.
		 * The point.key variable contains the category name, x value or
		 * datetime string depending on the type of axis. For datetime axes,
		 * the point.key date format can be set using tooltip.xDateFormat.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/tooltip/footerformat/ A HTML table in the tooltip
		 * @default ""
		 * @since 4.1.0
		 * @product highcharts
		 */
		headerFormat: '',

		/**
		 * The HTML of the point's line in the tooltip. Variables are enclosed
		 * by curly brackets. Available variables are point.x, point.y, series.
		 * name and series.color and other properties on the same form. Furthermore,
		 * point.y can be extended by the tooltip.yPrefix and tooltip.ySuffix
		 * variables. This can also be overridden for each series, which makes
		 * it a good hook for displaying units.
		 * 
		 * @type {String}
		 * @sample {highcharts} highcharts/tooltip/pointformat/ A different point format with value suffix
		 * @default "&#60;b&#62;{point.name}&#60;/b&#62;: {point.value}&#60;/b&#62;&#60;br/&#62;"
		 * @since 4.1.0
		 * @product highcharts
		 */
		pointFormat: '<b>{point.name}</b>: {point.value}</b><br/>'
	},

	/**
	 * Whether to ignore hidden points when the layout algorithm runs.
	 * If `false`, hidden points will leave open spaces.
	 * 
	 * @type {Boolean}
	 * @default true
	 * @since 5.0.8
	 * @product highcharts
	 */
	ignoreHiddenPoint: true,

	/**
	 * This option decides which algorithm is used for setting position
	 * and dimensions of the points. Can be one of `sliceAndDice`, `stripes`,
	 *  `squarified` or `strip`.
	 * 
	 * @validvalue ["sliceAndDice", "stripes", "squarified", "strip"]
	 * @type {String}
	 * @see [How to write your own algorithm](http://www.highcharts.com/docs/chart-
	 * and-series-types/treemap)
	 * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-sliceanddice/ SliceAndDice by default
	 * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-stripes/ Stripes
	 * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-squarified/ Squarified
	 * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-strip/ Strip
	 * @default sliceAndDice
	 * @since 4.1.0
	 * @product highcharts
	 */
	layoutAlgorithm: 'sliceAndDice',

	/**
	 * Defines which direction the layout algorithm will start drawing.
	 *  Possible values are "vertical" and "horizontal".
	 * 
	 * @validvalue ["vertical", "horizontal"]
	 * @type {String}
	 * @default vertical
	 * @since 4.1.0
	 * @product highcharts
	 */
	layoutStartingDirection: 'vertical',

	/**
	 * Enabling this option will make the treemap alternate the drawing
	 * direction between vertical and horizontal. The next levels starting
	 * direction will always be the opposite of the previous.
	 * 
	 * @type {Boolean}
	 * @sample {highcharts} highcharts/plotoptions/treemap-alternatestartingdirection-true/ Enabled
	 * @default false
	 * @since 4.1.0
	 * @product highcharts
	 */
	alternateStartingDirection: false,

	/**
	 * Used together with the levels and allowDrillToNode options. When
	 * set to false the first level visible when drilling is considered
	 * to be level one. Otherwise the level will be the same as the tree
	 * structure.
	 * 
	 * @validvalue ["true", "false"]
	 * @type {Boolean}
	 * @default true
	 * @since 4.1.0
	 * @product highcharts
	 */
	levelIsConstant: true,

	/**
	 */
	drillUpButton: {

		/**
		 */
		position: { 

			/**
			 */
			align: 'right',

			/**
			 */
			x: -10,

			/**
			 */
			y: 10
		}
	},
	/*= if (build.classic) { =*/
	// Presentational options

	/**
	 * The color of the border surrounding each tree map item.
	 * 
	 * @type {Color}
	 * @default #e6e6e6
	 * @product highcharts
	 */
	borderColor: '${palette.neutralColor10}',

	/**
	 */
	borderWidth: 1,

	/**
	 * The opacity of a point in treemap. When a point has children, the
	 * visibility of the children is determined by the opacity.
	 * 
	 * @type {Number}
	 * @default 0.15
	 * @since 4.2.4
	 * @product highcharts
	 */
	opacity: 0.15,

	/**
	 * A wrapper object for all the series options in specific states.
	 * 
	 * @extends plotOptions.heatmap.states
	 * @product highcharts
	 */
	states: {

		/**
		 * Options for the hovered series
		 * 
		 * @extends plotOptions.heatmap.states.hover
		 * @excluding halo
		 * @product highcharts
		 */
		hover: {

			/**
			 */
			borderColor: '${palette.neutralColor40}',

			/**
			 */
			brightness: seriesTypes.heatmap ? 0 : 0.1,

			/**
			 * The opacity of a point in treemap. When a point has children,
			 * the visibility of the children is determined by the opacity.
			 * 
			 * @type {Number}
			 * @default 0.75
			 * @since 4.2.4
			 * @product highcharts
			 */
			opacity: 0.75,

			/**
			 */
			shadow: false
		}
	}
	/*= } =*/

// Prototype members
}, {
	pointArrayMap: ['value'],
	axisTypes: seriesTypes.heatmap ? ['xAxis', 'yAxis', 'colorAxis'] : ['xAxis', 'yAxis'],
	directTouch: true,
	optionalAxis: 'colorAxis',
	getSymbol: noop,
	parallelArrays: ['x', 'y', 'value', 'colorValue'],
	colorKey: 'colorValue', // Point color option key
	translateColors: seriesTypes.heatmap && seriesTypes.heatmap.prototype.translateColors,
	trackerGroups: ['group', 'dataLabelsGroup'],
	/**
	 * Creates an object map from parent id to childrens index.
	 * @param {Array} data List of points set in options.
	 * @param {string} data[].parent Parent id of point.
	 * @param {Array} ids List of all point ids.
	 * @return {Object} Map from parent id to children index in data.
	 */
	getListOfParents: function (data, ids) {
		var listOfParents = reduce(data, function (prev, curr, i) {
			var parent = pick(curr.parent, '');
			if (prev[parent] === undefined) {
				prev[parent] = [];
			}
			prev[parent].push(i);
			return prev;
		}, {});

		// If parent does not exist, hoist parent to root of tree.
		eachObject(listOfParents, function (children, parent, list) {
			if ((parent !== '') && (H.inArray(parent, ids) === -1)) {
				each(children, function (child) {
					list[''].push(child);
				});
				delete list[parent];
			}
		});
		return listOfParents;
	},
	/**
	* Creates a tree structured object from the series points
	*/
	getTree: function () {
		var series = this,
			allIds = map(this.data, function (d) {
				return d.id;
			}),
			parentList = series.getListOfParents(this.data, allIds);

		series.nodeMap = [];
		return series.buildNode('', -1, 0, parentList, null);
	},
	init: function (chart, options) {
		var series = this;
		Series.prototype.init.call(series, chart, options);
		if (series.options.allowDrillToNode) {
			H.addEvent(series, 'click', series.onClickDrillToNode);
		}
	},
	buildNode: function (id, i, level, list, parent) {
		var series = this,
			children = [],
			point = series.points[i],
			node,
			child;

		// Actions
		each((list[id] || []), function (i) {
			child = series.buildNode(series.points[i].id, i, (level + 1), list, id);
			children.push(child);
		});
		node = {
			id: id,
			i: i,
			children: children,
			level: level,
			parent: parent,
			visible: false // @todo move this to better location
		};
		series.nodeMap[node.id] = node;
		if (point) {
			point.node = node;
		}
		return node;
	},
	setTreeValues: function (tree) {
		var series = this,
			options = series.options,
			childrenTotal = 0,
			children = [],
			val,
			point = series.points[tree.i];
		// Parents of the root node is by default visible
		recursive(series.nodeMap[series.rootNode], function (node) {
			var next = false,
				p = node.parent;
			node.visible = true;
			if (p || p === '') {
				next = series.nodeMap[p];
			}
			return next;
		});
		// Children of the root node is by default visible
		recursive(series.nodeMap[series.rootNode].children, function (children) {
			var next = false;
			each(children, function (child) {
				child.visible = true;
				if (child.children.length) {
					next = (next || []).concat(child.children);
				}
			});
			return next;
		});

		// First give the children some values
		each(tree.children, function (child) {
			child = series.setTreeValues(child);
			children.push(child);

			if (!child.ignore) {
				childrenTotal += child.val;
			} else {
				// @todo Add predicate to avoid looping already ignored children
				recursive(child.children, function (children) {
					var next = false;
					each(children, function (node) {
						extend(node, {
							ignore: true,
							isLeaf: false,
							visible: false
						});
						if (node.children.length) {
							next = (next || []).concat(node.children);
						}
					});
					return next;
				});
			}
		});
		// Sort the children
		stableSort(children, function (a, b) {
			return a.sortIndex - b.sortIndex;
		});
		// Set the values
		val = pick(point && point.options.value, childrenTotal);
		if (point) {
			point.value = val;
		}
		extend(tree, {
			children: children,
			childrenTotal: childrenTotal,
			// Ignore this node if point is not visible
			ignore: !(pick(point && point.visible, true) && (val > 0)),
			isLeaf: tree.visible && !childrenTotal,
			levelDynamic: (options.levelIsConstant ? tree.level : (tree.level - series.nodeMap[series.rootNode].level)),
			name: pick(point && point.name, ''),
			sortIndex: pick(point && point.sortIndex, -val),
			val: val
		});
		return tree;
	},
	/**
	 * Recursive function which calculates the area for all children of a node.
	 * @param {Object} node The node which is parent to the children.
	 * @param {Object} area The rectangular area of the parent.
	 */
	calculateChildrenAreas: function (parent, area) {
		var series = this,
			options = series.options,
			level = this.levelMap[parent.levelDynamic + 1],
			algorithm = pick((series[level && level.layoutAlgorithm] && level.layoutAlgorithm), options.layoutAlgorithm),
			alternate = options.alternateStartingDirection,
			childrenValues = [],
			children;

		// Collect all children which should be included
		children = grep(parent.children, function (n) {
			return !n.ignore;
		});

		if (level && level.layoutStartingDirection) {
			area.direction = level.layoutStartingDirection === 'vertical' ? 0 : 1;
		}
		childrenValues = series[algorithm](area, children);
		each(children, function (child, index) {
			var values = childrenValues[index];
			child.values = merge(values, {
				val: child.childrenTotal,
				direction: (alternate ? 1 - area.direction : area.direction)
			});
			child.pointValues = merge(values, {
				x: (values.x / series.axisRatio),
				width: (values.width / series.axisRatio) 
			});
			// If node has children, then call method recursively
			if (child.children.length) {
				series.calculateChildrenAreas(child, child.values);
			}
		});
	},
	setPointValues: function () {
		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis;
		each(series.points, function (point) {
			var node = point.node,
				values = node.pointValues,
				x1,
				x2,
				y1,
				y2,
				crispCorr = 0;

			/*= if (build.classic) { =*/
			// Get the crisp correction in classic mode. For this to work in 
			// styled mode, we would need to first add the shape (without x, y,
			// width and height), then read the rendered stroke width using
			// point.graphic.strokeWidth(), then modify and apply the shapeArgs.
			// This applies also to column series, but the downside is
			// performance and code complexity.
			crispCorr = (
				(series.pointAttribs(point)['stroke-width'] || 0) % 2
			) / 2;
			/*= } =*/

			// Points which is ignored, have no values.
			if (values && node.visible) {
				x1 = Math.round(xAxis.translate(values.x, 0, 0, 0, 1)) - crispCorr;
				x2 = Math.round(xAxis.translate(values.x + values.width, 0, 0, 0, 1)) - crispCorr;
				y1 = Math.round(yAxis.translate(values.y, 0, 0, 0, 1)) - crispCorr;
				y2 = Math.round(yAxis.translate(values.y + values.height, 0, 0, 0, 1)) - crispCorr;
				// Set point values
				point.shapeType = 'rect';
				point.shapeArgs = {
					x: Math.min(x1, x2),
					y: Math.min(y1, y2),
					width: Math.abs(x2 - x1),
					height: Math.abs(y2 - y1)
				};
				point.plotX = point.shapeArgs.x + (point.shapeArgs.width / 2);
				point.plotY = point.shapeArgs.y + (point.shapeArgs.height / 2);
			} else {
				// Reset visibility
				delete point.plotX;
				delete point.plotY;
			}
		});
	},
	setColorRecursive: function (node, color, colorIndex) {
		var series = this,
			point,
			level;
		if (node) {
			point = series.points[node.i];
			level = series.levelMap[node.levelDynamic];
			// Select either point color, level color or inherited color.
			color = pick(
				point && point.options.color,
				level && level.color,
				color,
				series.color
			);
			colorIndex = pick(
				point && point.options.colorIndex,
				level && level.colorIndex,
				colorIndex,
				series.colorIndex
			);
			
			if (point) {
				point.color = color;
				point.colorIndex = colorIndex;
			}
			
			// Do it all again with the children	
			if (node.children.length) {
				each(node.children, function (child) {
					series.setColorRecursive(child, color, colorIndex);
				});
			}
		}
	},
	algorithmGroup: function (h, w, d, p) {
		this.height = h;
		this.width = w;
		this.plot = p;
		this.direction = d;
		this.startDirection = d;
		this.total = 0;
		this.nW = 0;
		this.lW = 0;
		this.nH = 0;
		this.lH = 0;
		this.elArr = [];
		this.lP = {
			total: 0,
			lH: 0,
			nH: 0,
			lW: 0,
			nW: 0,
			nR: 0,
			lR: 0,
			aspectRatio: function (w, h) {
				return Math.max((w / h), (h / w));
			}
		};
		this.addElement = function (el) {
			this.lP.total = this.elArr[this.elArr.length - 1];
			this.total = this.total + el;
			if (this.direction === 0) {
				// Calculate last point old aspect ratio
				this.lW = this.nW;
				this.lP.lH = this.lP.total / this.lW;
				this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH);
				// Calculate last point new aspect ratio
				this.nW = this.total / this.height;
				this.lP.nH = this.lP.total / this.nW;
				this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH);
			} else {
				// Calculate last point old aspect ratio
				this.lH = this.nH;
				this.lP.lW = this.lP.total / this.lH;
				this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH);
				// Calculate last point new aspect ratio
				this.nH = this.total / this.width;
				this.lP.nW = this.lP.total / this.nH;
				this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH);
			}
			this.elArr.push(el);						
		};
		this.reset = function () {
			this.nW = 0;
			this.lW = 0;
			this.elArr = [];
			this.total = 0;
		};
	},
	algorithmCalcPoints: function (directionChange, last, group, childrenArea) {
		var pX,
			pY,
			pW,
			pH,
			gW = group.lW,
			gH = group.lH,
			plot = group.plot,
			keep,
			i = 0,
			end = group.elArr.length - 1;
		if (last) {
			gW = group.nW;
			gH = group.nH;
		} else {
			keep = group.elArr[group.elArr.length - 1];
		}
		each(group.elArr, function (p) {
			if (last || (i < end)) {
				if (group.direction === 0) {
					pX = plot.x;
					pY = plot.y; 
					pW = gW;
					pH = p / pW;
				} else {
					pX = plot.x;
					pY = plot.y;
					pH = gH;
					pW = p / pH;
				}
				childrenArea.push({
					x: pX,
					y: pY,
					width: pW,
					height: pH
				});
				if (group.direction === 0) {
					plot.y = plot.y + pH;
				} else {
					plot.x = plot.x + pW;
				}						
			}
			i = i + 1;
		});
		// Reset variables
		group.reset();
		if (group.direction === 0) {
			group.width = group.width - gW;
		} else {
			group.height = group.height - gH;
		}
		plot.y = plot.parent.y + (plot.parent.height - group.height);
		plot.x = plot.parent.x + (plot.parent.width - group.width);
		if (directionChange) {
			group.direction = 1 - group.direction;
		}
		// If not last, then add uncalculated element
		if (!last) {
			group.addElement(keep);
		}
	},
	algorithmLowAspectRatio: function (directionChange, parent, children) {
		var childrenArea = [],
			series = this,
			pTot,
			plot = {
				x: parent.x,
				y: parent.y,
				parent: parent
			},
			direction = parent.direction,
			i = 0,
			end = children.length - 1,
			group = new this.algorithmGroup(parent.height, parent.width, direction, plot); // eslint-disable-line new-cap
		// Loop through and calculate all areas
		each(children, function (child) {
			pTot = (parent.width * parent.height) * (child.val / parent.val);
			group.addElement(pTot);
			if (group.lP.nR > group.lP.lR) {
				series.algorithmCalcPoints(directionChange, false, group, childrenArea, plot);
			}
			// If last child, then calculate all remaining areas
			if (i === end) {
				series.algorithmCalcPoints(directionChange, true, group, childrenArea, plot);
			}
			i = i + 1;
		});
		return childrenArea;
	},
	algorithmFill: function (directionChange, parent, children) {
		var childrenArea = [],
			pTot,
			direction = parent.direction,
			x = parent.x,
			y = parent.y,
			width = parent.width,
			height = parent.height,
			pX,
			pY,
			pW,
			pH;
		each(children, function (child) {
			pTot = (parent.width * parent.height) * (child.val / parent.val);
			pX = x;
			pY = y;
			if (direction === 0) {
				pH = height;
				pW = pTot / pH;
				width = width - pW;
				x = x + pW;
			} else {
				pW = width;
				pH = pTot / pW;
				height = height - pH;
				y = y + pH;
			}
			childrenArea.push({
				x: pX,
				y: pY,
				width: pW,
				height: pH
			});
			if (directionChange) {
				direction = 1 - direction;
			}
		});
		return childrenArea;
	},
	strip: function (parent, children) {
		return this.algorithmLowAspectRatio(false, parent, children);
	},
	squarified: function (parent, children) {
		return this.algorithmLowAspectRatio(true, parent, children);
	},
	sliceAndDice: function (parent, children) {
		return this.algorithmFill(true, parent, children);
	},
	stripes: function (parent, children) {
		return this.algorithmFill(false, parent, children);
	},
	translate: function () {
		var series = this,
			rootId = series.rootNode = pick(series.rootNode, series.options.rootId, ''),
			rootNode,
			pointValues,
			seriesArea,
			tree,
			val;

		// Call prototype function
		Series.prototype.translate.call(series);
		// Create a object map from level to options
		series.levelMap = reduce(series.options.levels, function (arr, item) {
			arr[item.level] = item;
			return arr;
		}, {});
		tree = series.tree = series.getTree(); // @todo Only if series.isDirtyData is true
		rootNode = series.nodeMap[rootId];
		if (
			rootId !== '' &&
			(!rootNode || !rootNode.children.length)
		) {
			series.drillToNode('', false);
			rootId = series.rootNode;
			rootNode = series.nodeMap[rootId];
		}
		series.setTreeValues(tree);

		// Calculate plotting values.
		series.axisRatio = (series.xAxis.len / series.yAxis.len);
		series.nodeMap[''].pointValues = pointValues = { x: 0, y: 0, width: 100, height: 100 };
		series.nodeMap[''].values = seriesArea = merge(pointValues, {
			width: (pointValues.width * series.axisRatio),
			direction: (series.options.layoutStartingDirection === 'vertical' ? 0 : 1),
			val: tree.val
		});
		series.calculateChildrenAreas(tree, seriesArea);

		// Logic for point colors
		if (series.colorAxis) {
			series.translateColors();
		} else if (!series.options.colorByPoint) {
			series.setColorRecursive(series.tree);
		}

		// Update axis extremes according to the root node.
		if (series.options.allowDrillToNode) {
			val = rootNode.pointValues;
			series.xAxis.setExtremes(val.x, val.x + val.width, false);
			series.yAxis.setExtremes(val.y, val.y + val.height, false);
			series.xAxis.setScale();
			series.yAxis.setScale();
		}

		// Assign values to points.
		series.setPointValues();
	},
	/**
	 * Extend drawDataLabels with logic to handle custom options related to the treemap series:
	 * - Points which is not a leaf node, has dataLabels disabled by default.
	 * - Options set on series.levels is merged in.
	 * - Width of the dataLabel is set to match the width of the point shape.
	 */
	drawDataLabels: function () {
		var series = this,
			points = grep(series.points, function (n) {
				return n.node.visible;
			}),
			options,
			level;
		each(points, function (point) {
			level = series.levelMap[point.node.levelDynamic];
			// Set options to new object to avoid problems with scope
			options = { style: {} };

			// If not a leaf, then label should be disabled as default
			if (!point.node.isLeaf) {
				options.enabled = false;
			}

			// If options for level exists, include them as well
			if (level && level.dataLabels) {
				options = merge(options, level.dataLabels);
				series._hasPointLabels = true;
			}

			// Set dataLabel width to the width of the point shape.
			if (point.shapeArgs) {
				options.style.width = point.shapeArgs.width;
				if (point.dataLabel) {
					point.dataLabel.css({ width: point.shapeArgs.width + 'px' });
				}
			}

			// Merge custom options with point options
			point.dlOptions = merge(options, point.options.dataLabels);
		});
		Series.prototype.drawDataLabels.call(this);
	},

	/**
	 * Over the alignment method by setting z index
	 */
	alignDataLabel: function (point) {
		seriesTypes.column.prototype.alignDataLabel.apply(this, arguments);
		if (point.dataLabel) {
			point.dataLabel.attr({ zIndex: point.node.zIndex + 1 });
		}
	},

	/*= if (build.classic) { =*/
	/**
	 * Get presentational attributes
	 */
	pointAttribs: function (point, state) {
		var level = this.levelMap[point.node.levelDynamic] || {},
			options = this.options,
			attr,
			stateOptions = (state && options.states[state]) || {},
			className = point.getClassName(),
			opacity;

		// Set attributes by precedence. Point trumps level trumps series. Stroke width uses pick
		// because it can be 0.
		attr = {
			'stroke': point.borderColor || level.borderColor || stateOptions.borderColor || options.borderColor,
			'stroke-width': pick(point.borderWidth, level.borderWidth, stateOptions.borderWidth, options.borderWidth),
			'dashstyle': point.borderDashStyle || level.borderDashStyle || stateOptions.borderDashStyle || options.borderDashStyle,
			'fill': point.color || this.color
		};

		// Hide levels above the current view
		if (className.indexOf('highcharts-above-level') !== -1) {
			attr.fill = 'none';
			attr['stroke-width'] = 0;

		// Nodes with children that accept interaction
		} else if (className.indexOf('highcharts-internal-node-interactive') !== -1) {
			opacity = pick(stateOptions.opacity, options.opacity);
			attr.fill = color(attr.fill).setOpacity(opacity).get();
			attr.cursor = 'pointer';
		// Hide nodes that have children
		} else if (className.indexOf('highcharts-internal-node') !== -1) {
			attr.fill = 'none';

		} else if (state) {
			// Brighten and hoist the hover nodes
			attr.fill = color(attr.fill).brighten(stateOptions.brightness).get();
		}
		return attr;
	},
	/*= } =*/

	/**
	* Extending ColumnSeries drawPoints
	*/
	drawPoints: function () {
		var series = this,
			points = grep(series.points, function (n) {
				return n.node.visible;
			});

		each(points, function (point) {
			var groupKey = 'levelGroup-' + point.node.levelDynamic;
			if (!series[groupKey]) {
				series[groupKey] = series.chart.renderer.g(groupKey)
					.attr({
						zIndex: 1000 - point.node.levelDynamic // @todo Set the zIndex based upon the number of levels, instead of using 1000
					})
					.add(series.group);
			}
			point.group = series[groupKey];
			
		});
		// Call standard drawPoints
		seriesTypes.column.prototype.drawPoints.call(this);

		// If drillToNode is allowed, set a point cursor on clickables & add drillId to point 
		if (series.options.allowDrillToNode) {
			each(points, function (point) {
				if (point.graphic) {
					point.drillId = series.options.interactByLeaf ? series.drillToByLeaf(point) : series.drillToByGroup(point);
				}
			});
		}
	},
	/**
	* Add drilling on the suitable points
	*/
	onClickDrillToNode: function (event) {
		var series = this,
			point = event.point,
			drillId = point && point.drillId;
		// If a drill id is returned, add click event and cursor. 
		if (isString(drillId)) {
			point.setState(''); // Remove hover
			series.drillToNode(drillId);
		}
	},
	/**
	* Finds the drill id for a parent node.
	* Returns false if point should not have a click event
	* @param {Object} point
	* @return {String|Boolean} Drill to id or false when point should not have a click event
	*/
	drillToByGroup: function (point) {
		var series = this,
			drillId = false;
		if ((point.node.level - series.nodeMap[series.rootNode].level) === 1 && !point.node.isLeaf) {
			drillId = point.id;
		}
		return drillId;
	},
	/**
	* Finds the drill id for a leaf node.
	* Returns false if point should not have a click event
	* @param {Object} point
	* @return {String|Boolean} Drill to id or false when point should not have a click event
	*/
	drillToByLeaf: function (point) {
		var series = this,
			drillId = false,
			nodeParent;
		if ((point.node.parent !== series.rootNode) && (point.node.isLeaf)) {
			nodeParent = point.node;
			while (!drillId) {
				nodeParent = series.nodeMap[nodeParent.parent];
				if (nodeParent.parent === series.rootNode) {
					drillId = nodeParent.id;
				}
			}
		}
		return drillId;
	},
	drillUp: function () {
		var series = this,
			node = series.nodeMap[series.rootNode];
		if (node && isString(node.parent)) {
			series.drillToNode(node.parent);
		}
	},
	drillToNode: function (id, redraw) {
		var series = this,
			nodeMap = series.nodeMap,
			node = nodeMap[id];
		series.rootNode = id;
		if (id === '') {
			series.drillUpButton = series.drillUpButton.destroy();
		} else {
			series.showDrillUpButton((node && node.name || id));
		}
		this.isDirty = true; // Force redraw
		if (pick(redraw, true)) {
			this.chart.redraw();
		}
	},
	showDrillUpButton: function (name) {
		var series = this,
			backText = (name || '< Back'),
			buttonOptions = series.options.drillUpButton,
			attr,
			states;

		if (buttonOptions.text) {
			backText = buttonOptions.text;
		}
		if (!this.drillUpButton) {
			attr = buttonOptions.theme;
			states = attr && attr.states;
						
			this.drillUpButton = this.chart.renderer.button(
				backText,
				null,
				null,
				function () {
					series.drillUp(); 
				},
				attr, 
				states && states.hover,
				states && states.select
			)
			.attr({
				align: buttonOptions.position.align,
				zIndex: 7
			})
			.add()
			.align(buttonOptions.position, false, buttonOptions.relativeTo || 'plotBox');
		} else {
			this.drillUpButton.attr({
				text: backText
			})
			.align();
		}
	},
	buildKDTree: noop,
	drawLegendSymbol: H.LegendSymbolMixin.drawRectangle,
	getExtremes: function () {
		// Get the extremes from the value data
		Series.prototype.getExtremes.call(this, this.colorValueData);
		this.valueMin = this.dataMin;
		this.valueMax = this.dataMax;

		// Get the extremes from the y data
		Series.prototype.getExtremes.call(this);
	},
	getExtremesFromAll: true,
	bindAxes: function () {
		var treeAxis = {
			endOnTick: false,
			gridLineWidth: 0,
			lineWidth: 0,
			min: 0,
			dataMin: 0,
			minPadding: 0,
			max: 100,
			dataMax: 100,
			maxPadding: 0,
			startOnTick: false,
			title: null,
			tickPositions: []
		};
		Series.prototype.bindAxes.call(this);
		H.extend(this.yAxis.options, treeAxis);
		H.extend(this.xAxis.options, treeAxis);
	}

// Point class
}, {
	getClassName: function () {
		var className = H.Point.prototype.getClassName.call(this),
			series = this.series,
			options = series.options;

		// Above the current level
		if (this.node.level <= series.nodeMap[series.rootNode].level) {
			className += ' highcharts-above-level';
		
		} else if (!this.node.isLeaf && !pick(options.interactByLeaf, !options.allowDrillToNode)) {
			className += ' highcharts-internal-node-interactive';

		} else if (!this.node.isLeaf) {
			className += ' highcharts-internal-node';
		}
		return className;
	},
	isValid: function () {
		return isNumber(this.value);
	},
	setState: function (state) {
		H.Point.prototype.setState.call(this, state);

		// Graphic does not exist when point is not visible.
		if (this.graphic) {
			this.graphic.attr({
				zIndex: state === 'hover' ? 1 : 0
			});
		}
	},
	setVisible: seriesTypes.pie.prototype.pointClass.prototype.setVisible
});
