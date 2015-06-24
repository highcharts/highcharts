/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2014 Highsoft AS
 * Authors: Jon Arild Nygard / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

/*global HighchartsAdapter */
(function (H) {
	var seriesTypes = H.seriesTypes,
		merge = H.merge,
		extend = H.extend,
		extendClass = H.extendClass,
		defaultOptions = H.getOptions(),
		plotOptions = defaultOptions.plotOptions,
		noop = function () { return; },
		each = H.each,
		grep = HighchartsAdapter.grep,
		pick = H.pick,
		Series = H.Series,
		Color = H.Color;

	// Define default options
	plotOptions.treemap = merge(plotOptions.scatter, {
		showInLegend: false,
		marker: false,
		borderColor: '#E0E0E0',
		borderWidth: 1,
		dataLabels: {
			enabled: true,
			defer: false,
			verticalAlign: 'middle',
			formatter: function () { // #2945
				return this.point.name || this.point.id;
			},
			inside: true
		},
		tooltip: {
			headerFormat: '',
			pointFormat: '<b>{point.name}</b>: {point.node.val}</b><br/>'
		},
		layoutAlgorithm: 'sliceAndDice',
		layoutStartingDirection: 'vertical',
		alternateStartingDirection: false,
		levelIsConstant: true,
		states: {
			hover: {
				borderColor: '#A0A0A0',
				brightness: seriesTypes.heatmap ? 0 : 0.1,
				shadow: false
			}
		},
		drillUpButton: {
			position: { 
				align: 'left',
				x: 10,
				y: -50
			}
		}
	});
	
	// Stolen from heatmap	
	var colorSeriesMixin = {
		// mapping between SVG attributes and the corresponding options
		pointAttrToOptions: { 
			stroke: 'borderColor',
			'stroke-width': 'borderWidth',
			fill: 'color',
			dashstyle: 'borderDashStyle'
		},
		pointArrayMap: ['value'],
		axisTypes: seriesTypes.heatmap ? ['xAxis', 'yAxis', 'colorAxis'] : ['xAxis', 'yAxis'],
		optionalAxis: 'colorAxis',
		getSymbol: noop,
		parallelArrays: ['x', 'y', 'value', 'colorValue'],
		colorKey: 'colorValue', // Point color option key
		translateColors: seriesTypes.heatmap && seriesTypes.heatmap.prototype.translateColors
	};

	// The Treemap series type
	seriesTypes.treemap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
		type: 'treemap',
		trackerGroups: ['group', 'dataLabelsGroup'],
		pointClass: extendClass(H.Point, {
			setState: function (state, move) {
				H.Point.prototype.setState.call(this, state, move);
				if (state === 'hover') {
					if (this.dataLabel) {
						this.dataLabel.attr({ zIndex: 1002 });
					}
				} else {
					if (this.dataLabel) {
						this.dataLabel.attr({ zIndex: (this.pointAttr[''].zIndex + 1) });
					}
				}
			},
			setVisible: seriesTypes.pie.prototype.pointClass.prototype.setVisible
		}),
		// @todo Move to translate
		handleLayout: function () {
			var tree = this.tree,
				seriesArea;
			if (this.points.length) {
				// Assign variables
				this.rootNode = pick(this.rootNode, "");
				tree = this.tree = this.getTree();
				this.levelMap = this.getLevels();
				seriesArea = this.getSeriesArea(tree.val);
				this.calculateChildrenAreas(tree, seriesArea);
				this.setPointValues();
			}
		},
		/**
		* Creates a tree structured object from the series points
		*/
		getTree: function () {
			var tree,
				series = this,
				parentList = [],
				allIds = [],
				key,
				insertItem = function (key) {
					each(parentList[key], function (item) {
						parentList[""].push(item);
					});
				};
			// Actions
			this.nodeMap = [];

			// Map children to index
			// @todo Use data instead of points
			each(this.points, function (point, index) {
				var parent = "";
				allIds.push(point.id);
				if (point.parent !== undefined) {
					parent = point.parent;
				}
				if (parentList[parent] === undefined) {
					parentList[parent] = [];
				}
				parentList[parent].push(index);
			});
			/* 
			*  Quality check:
			*  - If parent does not exist, then set parent to tree root
			*  - Add node id to parents children list
			*/  
			for (key in parentList) {
				if ((parentList.hasOwnProperty(key)) && (key !== "") && (HighchartsAdapter.inArray(key, allIds) === -1)) {
					insertItem(key);
					delete parentList[key];
				}
			}
			tree = series.buildNode("", -1, 0, parentList, null);
			this.eachParents(this.nodeMap[this.rootNode], function (node) {
				node.visible = true;
			});
			this.eachChildren(this.nodeMap[this.rootNode], function (node) {
				node.visible = true;
			});
			this.setTreeValues(tree);
			return tree;
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
				childrenTotal = 0,
				sorted = [],
				val,
				point = series.points[tree.i];

			// First give the children some values
			each(tree.children, function (child) {
				child = series.setTreeValues(child);
				series.insertElementSorted(sorted, child, function (el, el2) {
					return el.val > el2.val; 
				});

				if (!child.ignore) {
					childrenTotal += child.val;
				} else {
					// @todo Add predicate to avoid looping already ignored children
					series.eachChildren(child, function (node) {
						extend(node, {
							ignore: true,
							isLeaf: false,
							visible: false
						});
					});
				}
			});

			// Set the values
			val = pick(point && point.value, childrenTotal);
			extend(tree, {
				children: sorted,
				childrenTotal: childrenTotal,
				// Ignore this node if point is not visible
				ignore: !(pick(point && point.visible, true) && (val > 0)),
				isLeaf: tree.visible && !childrenTotal,
				name: pick(point && point.name, ""),
				val: val
			});
			return tree;
		},
		eachChildren: function (node, callback) {
			var series = this,
				children = node.children;
			callback(node);
			if (children.length) {
				each(children, function (child) {
					series.eachChildren(child, callback);
				});
			}
		},
		eachParents: function (node, callback) {
			var parent = this.nodeMap[node.parent];
			callback(node);
			if (parent) {
				this.eachParents(parent, callback);
			}
		},
		/**
		 * Recursive function which calculates the area for all children of a node.
		 * @param {Object} node The node which is parent to the children.
		 * @param {Object} area The rectangular area of the parent.
		 */
		calculateChildrenAreas: function (parent, area) {
			var series = this,
				options = series.options,
				levelNumber = (options.levelIsConstant ? parent.level : (parent.level - this.nodeMap[this.rootNode].level)),
				level = this.levelMap[levelNumber + 1],
				algorithm = pick((series[level && level.layoutAlgorithm] && level.layoutAlgorithm), options.layoutAlgorithm),
				alternate = options.alternateStartingDirection,
				childrenValues = [],
				children,
				point;

			// Collect all children which should be included
			children = grep(parent.children, function (n) {
				return !n.ignore;
			});

			if (level && level.layoutStartingDirection) {
				area.direction = level.layoutStartingDirection === 'vertical' ? 0 : 1;
			}
			childrenValues = series[algorithm](area, children);
			each(children, function (child, index) {
				point = series.points[child.i];
				point.level = levelNumber + 1;
				child.values = merge(childrenValues[index], {
					val: child.childrenTotal,
					direction: (alternate ? 1 - area.direction : area.direction)
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
			series.nodeMap[""].values = {
				x: 0,
				y: 0,
				width: 100,
				height: 100
			};
			each(series.points, function (point) {
				var node = point.node,
					values = node.values,
					x1,
					x2,
					y1,
					y2;
				// Points which is ignored, have no values.
				if (values) {
					values.x = values.x / series.axisRatio;
					values.width = values.width / series.axisRatio;
					x1 = Math.round(xAxis.translate(values.x, 0, 0, 0, 1));
					x2 = Math.round(xAxis.translate(values.x + values.width, 0, 0, 0, 1));
					y1 = Math.round(yAxis.translate(values.y, 0, 0, 0, 1));
					y2 = Math.round(yAxis.translate(values.y + values.height, 0, 0, 0, 1));
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
		getSeriesArea: function (val) {
			var x = 0,
				y = 0,
				h = 100,
				r = this.axisRatio = (this.xAxis.len / this.yAxis.len),
				w = 100 * r,
				d = this.options.layoutStartingDirection === 'vertical' ? 0 : 1,
				seriesArea = {
					x: x,
					y: y,
					width: w,
					height: h,
					direction: d,
					val: val
				};
				this.nodeMap[""].values = seriesArea;
			return seriesArea;
		},
		getLevels: function () {
			var map = [],
				levels = this.options.levels;
			if (levels) {
				each(levels, function (level) {
					if (level.level !== undefined) {
						map[level.level] = level;
					}
				});
			}
			return map;
		},
		setColorRecursive: function (node, color) {
			var series = this,
				point,
				level;
			if (node) {
				point = series.points[node.i];
				level = series.levelMap[node.level];
				// Select either point color, level color or inherited color.
				color = pick(point && point.options.color, level && level.color, color);
				if (point) {
					point.color = color;
				}
				// Do it all again with the children	
				if (node.children.length) {
					each(node.children, function (child) {
						series.setColorRecursive(child, color);
					});
				}
			}
		},
		alg_func_group: function (h, w, d, p) {
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
		alg_func_calcPoints: function (directionChange, last, group, childrenArea) {
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
		alg_func_lowAspectRatio: function (directionChange, parent, children) {
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
				group = new this.alg_func_group(parent.height, parent.width, direction, plot);
			// Loop through and calculate all areas
			each(children, function (child) {
				pTot = (parent.width * parent.height) * (child.val / parent.val);
				group.addElement(pTot);
				if (group.lP.nR > group.lP.lR) {
					series.alg_func_calcPoints(directionChange, false, group, childrenArea, plot);
				}
				// If last child, then calculate all remaining areas
				if (i === end) {
					series.alg_func_calcPoints(directionChange, true, group, childrenArea, plot);
				}
				i = i + 1;
			});
			return childrenArea;
		},
		alg_func_fill: function (directionChange, parent, children) {
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
			return this.alg_func_lowAspectRatio(false, parent, children);
		},
		squarified: function (parent, children) {
			return this.alg_func_lowAspectRatio(true, parent, children);
		},
		sliceAndDice: function (parent, children) {
			return this.alg_func_fill(true, parent, children);
		},
		stripes: function (parent, children) {
			return this.alg_func_fill(false, parent, children);
		},
		translate: function () {
			// Call prototype function
			Series.prototype.translate.call(this);
			this.handleLayout();

			// If a colorAxis is defined
			if (this.colorAxis) {
				this.translateColors();
			} else if (!this.options.colorByPoint) {
				this.setColorRecursive(this.tree, undefined);
			}
		},
		/**
		 * Extend drawDataLabels with logic to handle custom options related to the treemap series:
		 * - Points which is not a leaf node, has dataLabels disabled by default.
		 * - Options set on series.levels is merged in.
		 * - Width of the dataLabel is set to match the width of the point shape.
		 */
		drawDataLabels: function () {
			var series = this,
				dataLabelsGroup = series.dataLabelsGroup,
				points = series.points,
				options,
				level;
			each(points, function (point) {
				level = series.levelMap[point.level];
				// Set options to new object to avoid problems with scope
				options = {style: {}};

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
				}

				// Merge custom options with point options
				point.dlOptions = merge(options, point.options.dataLabels);
			});

			this.dataLabelsGroup = this.group; // Draw dataLabels in same group as points, because of z-index on hover
			Series.prototype.drawDataLabels.call(this);
			this.dataLabelsGroup = dataLabelsGroup;
		},
		alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
		/**
		* Extending ColumnSeries drawPoints
		*/
		drawPoints: function () {
			var series = this,
				points = series.points,
				seriesOptions = series.options,
				attr,
				hover,
				level;
			each(points, function (point) {
				level = series.levelMap[point.level];
				attr = {
					stroke: seriesOptions.borderColor,
					'stroke-width': seriesOptions.borderWidth,
					dashstyle: seriesOptions.borderDashStyle,
					r: 0, // borderRadius gives wrong size relations and should always be disabled
					fill: pick(point.color, series.color)
				};
				// Overwrite standard series options with level options			
				if (level) {
					attr.stroke = level.borderColor || attr.stroke;
					attr['stroke-width'] = level.borderWidth || attr['stroke-width'];
					attr.dashstyle = level.borderDashStyle || attr.dashstyle;
				}
				// Merge with point attributes
				attr.stroke = point.borderColor || attr.stroke;
				attr['stroke-width'] = point.borderWidth || attr['stroke-width'];
				attr.dashstyle = point.borderDashStyle || attr.dashstyle;
				attr.zIndex = (1000 - (point.level * 2));

				// Make a copy to prevent overwriting individual props
				point.pointAttr = merge(point.pointAttr);
				hover = point.pointAttr.hover;
				hover.zIndex = 1001;
				hover.fill = Color(attr.fill).brighten(seriesOptions.states.hover.brightness).get();
				// If not a leaf, then remove fill
				if (!point.node.isLeaf) {
					if (pick(seriesOptions.interactByLeaf, !seriesOptions.allowDrillToNode)) {
						attr.fill = 'none';
						delete hover.fill;
					} else {
						// TODO: let users set the opacity
						attr.fill = Color(attr.fill).setOpacity(0.15).get();
						hover.fill = Color(hover.fill).setOpacity(0.75).get();
					}
				}
				if (point.node.level <= series.nodeMap[series.rootNode].level) {
					attr.fill = 'none';
					attr.zIndex = 0;
					delete hover.fill;
				}
				point.pointAttr[''] = H.extend(point.pointAttr[''], attr);
				// @todo Move this to drawDataLabels
				if (point.dataLabel) {
					point.dataLabel.attr({ zIndex: (point.pointAttr[''].zIndex + 1) });
				}
			});
			// Call standard drawPoints
			seriesTypes.column.prototype.drawPoints.call(this);

			each(points, function (point) {
				if (point.graphic) {
					point.graphic.attr(point.pointAttr['']);
				}
			});

			// Set click events on points 
			if (seriesOptions.allowDrillToNode) {
				series.drillTo();
			}
		},
		/**
		 * Inserts an element into an array, sorted by a condition.
		 * Modifies the referenced array
		 * @param {*[]} arr The array which the element is inserted into.
		 * @param {*} el The element to insert.
		 * @param {function} cond The condition to sort on. First parameter is el, second parameter is array element
		 */
		insertElementSorted: function (arr, el, cond) {
			var i = 0,
				inserted = false;
			if (arr.length !== 0) {
				each(arr, function (arrayElement) {
					if (cond(el, arrayElement) && !inserted) {
						arr.splice(i, 0, el);
						inserted = true;
					}
					i = i + 1;					
				});
			} 
			if (!inserted) {
				arr.push(el);
			}
		},
		/**
		* Add drilling on the suitable points
		*/
		drillTo: function () {
			var series = this,
				points = series.points;
			each(points, function (point) {
				var drillId,
					drillName;
				H.removeEvent(point, 'click.drillTo');
				if (point.graphic) {
					point.graphic.css({ cursor: 'default' });
				}

				// Get the drill to id
				if (series.options.interactByLeaf) {
					drillId = series.drillToByLeaf(point);
				} else {
					drillId = series.drillToByGroup(point);
				}

				// If a drill id is returned, add click event and cursor. 
				if (drillId) {
					drillName = series.nodeMap[series.rootNode].name || series.rootNode;
					if (point.graphic) {
						point.graphic.css({ cursor: 'pointer' });
					}
					H.addEvent(point, 'click.drillTo', function () {
						point.setState(''); // Remove hover
						series.drillToNode(drillId);
						series.showDrillUpButton(drillName);
					});
				}
			});
		},
		/**
		* Finds the drill id for a parent node.
		* Returns false if point should not have a click event
		* @param {Object} point
		* @return {string || boolean} Drill to id or false when point should not have a click event
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
		* @return {string || boolean} Drill to id or false when point should not have a click event
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
			var drillPoint = null,
				node,
				parent;
			if (this.rootNode) {
				node = this.nodeMap[this.rootNode];
				if (node.parent !== null) {
					drillPoint = this.nodeMap[node.parent];
				} else {
					drillPoint = this.nodeMap[""];
				}
			}

			if (drillPoint !== null) {
				this.drillToNode(drillPoint.id);
				if (drillPoint.id === "") {
					this.drillUpButton = this.drillUpButton.destroy();
				} else {
					parent = this.nodeMap[drillPoint.parent];
					this.showDrillUpButton((parent.name || parent.id));
				}
			} 
		},
		drillToNode: function (id) {
			var node = this.nodeMap[id],
				val = node.values;
			this.rootNode = id;
			this.xAxis.setExtremes(val.x, val.x + val.width, false);
			this.yAxis.setExtremes(val.y, val.y + val.height, false);
			this.isDirty = true; // Force redraw
			this.chart.redraw();
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
					zIndex: 9
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
	}));
}(Highcharts));