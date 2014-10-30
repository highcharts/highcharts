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
		extendClass = H.extendClass,
		defaultOptions = H.getOptions(),
		plotOptions = defaultOptions.plotOptions,
		noop = function () { return; },
		each = H.each;

	// Define default options
	plotOptions.treemap = merge(plotOptions.scatter, {
		showInLegend: false,
		marker: false,
		borderColor: '#FFFFFF',
		borderWidth: 1,
		borderRadius: 0,
		radius: 0,
		dataLabels: {
			enabled: true,
			verticalAlign: 'middle',
			formatter: function () { // #2945
				return this.point.name || this.point.id;
			},
			inside: true
		},
		tooltip: {
			headerFormat: '',
			pointFormat: 'name: <b>{point.name}</b><br/>value: <b>{point.value}</b><br/>'
		},
		layoutAlgorithm: 'sliceAndDice',
		directionalChange: false,
		states: {
			hover: {
				borderColor: '#000000',
				brightness: 0.1,
				shadow: false,
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
			dashstyle: 'borderDashStyle',
			r: 'borderRadius'
		},
		pointArrayMap: ['value'],
		axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
		optionalAxis: 'colorAxis',
		getSymbol: noop,
		parallelArrays: ['x', 'y', 'value'],
		colorKey: 'colorValue', // Point color option key
		translateColors: seriesTypes.heatmap.prototype.translateColors
	};

	// The Treemap series type
	seriesTypes.treemap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
		type: 'treemap',
		trackerGroups: ['group', 'dataLabelsGroup'],
		pointClass: extendClass(H.Point, {
			setState: function (state, move) {
				H.Point.prototype.setState.call(this, state, move);
				if (state === 'hover') {
					this.graphic.toFront();
				}
			}
		}),
		handleLayout: function () {
		var series = this,
			tree = this.tree,
			seriesArea;
			if (this.points.length) {
				// Modify series
				this.nodeMap = [];
				this.xAxis.dataMin = 0;
				this.xAxis.dataMax = 100;
				this.yAxis.dataMin = 0;
				this.yAxis.dataMax = 100;

				// Assign variables
				if (!tree) {
					tree = this.buildTree();
				}
				if (!this.rootNode) {
					this.rootNode = "";
				}
				this.levelMap = this.getLevels();
				each(series.points, function (point) {
					// Reset visibility
					delete point.plotX;
					delete point.plotY;
					point.inDisplay = false;
				});
				seriesArea = this.getSeriesArea(tree.val);
				this.nodeMap[""].values = seriesArea;
				this.setColorRecursive(tree, undefined);
				this.calculateArea(tree, seriesArea);
			}
		},
		buildTree: function () {
			var tree,
				series = this,
				i = 0,
				parentList = [],
				allIds = [],
				key,
				insertItem = function (key) {
					each(parentList[key], function (item) {
						parentList[""].push(item);
					});
				},
				getNodeTree = function (id, i, level, list, points, parent) {
					var children = [],
						sortedChildren = [],
						val = 0,
						point = points[i],
						nodeTree,
						node,
						insertNode,
						name;
					insertNode = function () {
						var i = 0,
							inserted = false;
						if (sortedChildren.length !== 0) {
							each(sortedChildren, function (child) {
								if (node.val > child.val && !inserted) {
									sortedChildren.splice(i, 0, node);
									inserted = true;
								}
								i = i + 1;					
							});
						} 
						if (!inserted) {
							sortedChildren.push(node);
						}
					};

					// Actions
					if (point) {
						name = point.name || "";
					}
					if (list[id] !== undefined) {
						each(list[id], function (i) {
							node = getNodeTree(points[i].id, i, (level + 1), list, points, id);
							val += node.val;
							insertNode();
							children.push(node);
						});
					} else {
						val = points[i].value;
					}
					nodeTree = {
						id: id,
						i: i,
						children: sortedChildren,
						val: val,
						level: level,
						parent: parent,
						name: name
					};
					series.nodeMap[nodeTree.id] = nodeTree;
					return nodeTree;
				};
			// Actions
			// Map children to index
			each(this.points, function (point) {
				var parent = "";
				allIds.push(point.id);
				if (point.parent !== undefined) {
					parent = point.parent;
				}
				if (parentList[parent] === undefined) {
					parentList[parent] = [];
				}
				parentList[parent].push(i);
				i = i + 1;
			});
			/* 
			*  Quality check:
			*  - If parent does not exist, then set parent to tree root
			*  - Add node id to parents children list
			*/  
			for (key in parentList) {
				if (parentList.hasOwnProperty(key)) {
					if (key !== "") {
						if (HighchartsAdapter.inArray(key, allIds) === -1) {
							insertItem(key);
							delete parentList[key];
						}
					}
				}
			}
			tree = getNodeTree("", -1, 0, parentList, this.points, null);
			return tree;
		},
		calculateArea: function (node, area) {
			var childrenValues = [],
				childValues,
				series = this,
				options = series.options,
				xAxis = series.xAxis,
				yAxis = series.yAxis,				
				algorithm = options.layoutAlgorithm,
				directionalChange = options.directionalChange,							
				i = 0,
				level,
				point,
				x1,
				x2,
				y1,
				y2,
				setPointValues = function (node, values, isLeaf) {
						node.values = values;
						point = series.points[node.i];
						x1 = Math.round(xAxis.len - xAxis.translate(values.x, 0, 0, 0, 1));
						x2 = Math.round(xAxis.len - xAxis.translate(values.x + values.width, 0, 0, 0, 1));
						y1 = Math.round(yAxis.translate(values.y, 0, 1, 0, 1));
						y2 = Math.round(yAxis.translate(values.y + values.height, 0, 1, 0, 1));
					if (node.val > 0) {
						point = series.points[node.i];
						point.inDisplay = true;
						point.isLeaf = isLeaf;
						point.level = node.level;
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
					}
				};
			// If layoutAlgorithm is set for the level of the children, then default is overwritten
			if (this.levelMap[node.level + 1]) {
				level = this.levelMap[node.level + 1];
				if (level.layoutAlgorithm && series[level.layoutAlgorithm]) {
					algorithm = level.layoutAlgorithm;
				}
			}
			childrenValues = series[algorithm](area, node.children);
			each(node.children, function (child) {
				point = series.points[child.i];
				point.level = child.level;
				childValues = childrenValues[i];
				childValues.val = child.val;
				childValues.direction = area.direction;
				if (directionalChange) {
					childValues.direction = 1 - childValues.direction;
				}
				// If node has children, then call method recursively
				if (child.children.length) {
					setPointValues(child, childValues, false);
					series.calculateArea(child, childValues);
				} else {
					setPointValues(child, childValues, true);
				}
				i = i + 1;
			});
		},
		getSeriesArea: function (val) {
			var w = this.xAxis.dataMax,
				x = this.xAxis.dataMin,
				y = this.yAxis.dataMin,
				h = this.yAxis.dataMax,
				seriesArea = {
					x: x,
					y: y,
					width: w,
					height: h,
					direction: 0,
					val: val
				};
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
				point = series.points[node.i],
				level;
			// Overwrite color if level specific color is set
			if (this.levelMap[node.level] !== undefined) {
				level = this.levelMap[node.level];
				if (level.color !== undefined) {
					color = level.color;
				}
			}
			// If point color is not set, then give it inherited or level color
			if (node.i !== -1) {
				if (point.color === undefined) {
					if (color !== undefined) {
						point.color = color;
						point.options.color = color;
					}
				} else {
					color = point.color;
				}
			}
			// Do it all again with the children	
			if (node.children.length) {
				each(node.children, function (child) {
					series.setColorRecursive(child, color);
				});
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
			H.Series.prototype.translate.call(this);
			this.handleLayout();

			this.translateColors();
		},
		drawDataLabels: function () {
			var series = this,
				points = series.points,
				options,
				level,
				dataLabels;
			each(points, function (point) {
				level = series.levelMap[point.level];
				options = series.options.dataLabels;
				// If not a leaf, then label should be disabled as default
				if (!point.isLeaf) {
					options = merge(options, {enabled: false});
				}
				if (level) {
					dataLabels = level.dataLabels;
					if (dataLabels) {
						options = merge(options, dataLabels);
						series._hasPointLabels = true;
					}
				}
				options = merge(options, point.options.dataLabels);
				point.options.dataLabels = options;
			});
			H.Series.prototype.drawDataLabels.call(this);
		},
		alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
		drawPoints: function () {
			var series = this,
				points = series.points,
				seriesOptions = series.options,
				attr,
				level;
			each(points, function (point) {
				level = series.levelMap[point.level];
				attr = {
					stroke: seriesOptions.borderColor,
					'stroke-width': seriesOptions.borderWidth,
					dashstyle: seriesOptions.borderDashStyle,
					r: 0, // borderRadius gives wrong size relations and should always be disabled
					fill: series.color
				};
				// Overwrite standard series options with level options			
				if (level) {
					attr.stroke = level.borderColor || attr.stroke;
					attr['stroke-width'] = level.borderWidth || attr['stroke-width'];
					attr.dashstyle = level.borderDashStyle || attr.dashstyle;
					attr.fill = level.color || attr.fill;
				}
				// Merge with point attributes
				attr.stroke = point.borderColor || attr.stroke;
				attr['stroke-width'] = point.borderWidth || attr['stroke-width'];
				attr.dashstyle = point.borderDashStyle || attr.dashstyle;
				attr.fill = point.color || attr.fill;
				attr.zIndex = (1000 - point.level);
				// If not a leaf, then remove fill
				if (!point.isLeaf) {
					attr.fill = 'none';
					delete point.pointAttr.hover.fill;
				}
				point.pointAttr[''] = merge(point.pointAttr[''], attr);

				if (series.options.allowDrillToNode) {
					H.removeEvent(point, 'click');
					H.addEvent(point, 'click', function () {
						series.drillCloser(point);
					});
				}
			});
			// Call standard drawPoints
			seriesTypes.column.prototype.drawPoints.call(this);
		},
		drillCloser: function (point) {
			var points = this.points,
				drillNode = this.nodeMap[point.id],
				parent,
				valid = true;
			while (valid) {
				parent = this.nodeMap[drillNode.parent];
				valid = (parent.parent !== null) && (points[parent.i].inDisplay);
				if (valid) {
					drillNode = parent;
				}
			}
			// If it is not the same point, then drill to it
			if (drillNode.id !== point.id) {
				this.drillToNode(drillNode.id);
				this.showDrillUpButton((parent.name || parent.id));
			}
		},
		drillUp: function () {
			var drillPoint = null,
				node,
				parent;
			if (this.rootNode) {
				node = this.nodeMap[this.rootNode];
				if (node.parent !== null) {
					drillPoint = this.nodeMap[node.parent];
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
			this.chart.redraw();
		},
		showDrillUpButton: function (name) {
			var series = this,
				backText = 'Back to: ' + (name || 'Top'),
				buttonOptions = series.options.drillUpButton,
				attr,
				states;

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
		drawLegendSymbol: H.LegendSymbolMixin.drawRectangle,
		bindAxes: function () {
			var treeAxis = {
				endOnTick: false,
				gridLineWidth: 0,
				lineWidth: 0,
				min: 0,
				minPadding: 0,
				max: 100,
				maxPadding: 0,
				startOnTick: false,
				title: null,
				tickPositions: []
			};
			H.Series.prototype.bindAxes.call(this);
			H.extend(this.xAxis.options, treeAxis);
			H.extend(this.yAxis.options, treeAxis);
		}
	}));
}(Highcharts));