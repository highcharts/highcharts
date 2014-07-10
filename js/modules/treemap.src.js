/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2014 Highsoft AS
 * Authors: Jon Arild Nygard / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
(function (H) { // docs
	var seriesTypes = H.seriesTypes,
		merge = H.merge,
		extendClass = H.extendClass,
		defaultOptions = H.getOptions(),
		plotOptions = defaultOptions.plotOptions,
		noop = function () { return; },
		each = H.each;
	defaultOptions.legend = false;

	function Area(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
		this.centerX = this.x + (w / 2);
		this.centerY = this.y + (h / 2);
		this.totalArea = w * h;
		this.direction = 0;
		this.totalValue = 0;
		this._plotW = w;
		this._plotH = h;
		this._plotX = x;
		this._plotY = y;	
		// Calculates plotting width for a child point
		this.plotW = function (total) {
			var val = 0;
			if (this.direction === 0) {
				val = total / this._plotH;
				this._plotW -= val;
			} else {
				val = this._plotW;
			}
			return val;
		};
		// Calculates plotting height for a child point
		this.plotH = function (total) {
			var val = 0;
			if (this.direction === 1) {
				val = total / this._plotW;
				this._plotH -= val;
			} else {
				val = this._plotH;
			}
			return val;
		};
		// Calculates x value for a child point
		this.plotX = function (w) {
			var val = this._plotX;
			if (this.direction === 0) {
				this._plotX += w;
			}
			return val;
		};
		// Calculates y value for a child point
		this.plotY = function (h) {
			var val = this._plotY;
			if (this.direction === 1) {
				this._plotY += h;
			}
			return val;
		};
	}

	// Define default options
	plotOptions.treemap = merge(plotOptions.scatter, {
		legend: false,
		marker: {
			lineColor: "#000",
			lineWidth: 0.5,
			radius: 0
		},
		dataLabels: {
			verticalAlign: 'middle',
			formatter: function () { // #2945
				return this.point.id;
			}
		},
		tooltip: {
			pointFormat: 'id: <b>{point.id}</b><br/>parent: <b>{point.parent}</b><br/>value: <b>{point.value}</b><br/>'
		},
		layoutAlgorithm: 'sliceAndDice'
	});
	
	// Stolen from heatmap	
	var colorSeriesMixin = {
		// mapping between SVG attributes and the corresponding options
		pointAttrToOptions: { 
			stroke: 'borderColor',
			'stroke-width': 'borderWidth',
			fill: 'color',
			dashstyle: 'dashStyle'
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
		isCartesian: false,	
		trackerGroups: ['group', 'dataLabelsGroup'],
		handleLayout: function () {
		var tree = this.buildTree(),
			seriesArea;
			seriesArea = this.getSeriesArea(tree.totalValue);
			this.calculateArea(seriesArea, tree);
			this.setColorRecursive(tree, undefined);
		},
		buildTree: function () {
			var tree,
				index = 0,
				parentList = [],
				allIds = [],
				key,
				insertItem = function (key) {
					each(parentList[key], function (item) {
						parentList[""].push(item);
					});
				},
				getNodeTree = function (id, index, level, list, points) {
					var children = [],
						sortedChildren = [],
						totalValue = 0,
						nodeTree,
						node,
						insertNode;
					insertNode = function () {
						var index = 0,
							inserted = false;
						if (sortedChildren.length !== 0) {
							each(sortedChildren, function (val) {
								if (node.totalValue > val.totalValue && !inserted) {
									sortedChildren.splice(index, 0, node);
									inserted = true;
								}
								index = index + 1;					
							});
						} 
						if (!inserted) {
							sortedChildren.push(node);
						}
					};

					// Actions
					if (list[id] !== undefined) {
						each(list[id], function (index) {
							node = getNodeTree(points[index].id, index, (level + 1), list, points);
							totalValue += node.totalValue;
							insertNode();
							children.push(node);
						});
					} else {
						totalValue = points[index].value;
					}
					nodeTree = {
						id: id,
						index: index,
						children: sortedChildren,
						totalValue: totalValue,
						level: level
					};
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
				parentList[parent].push(index);
				index = index + 1;
			});
			/* 
			*  Quality check:
			*  - If parent does not exist, then set parent to tree root
			*  - Add node id to parents children list
			*/  
			for (key in parentList) {
				if (parentList.hasOwnProperty(key)) {
					if (key !== "") {
						if (allIds.indexOf(key) === -1) {
							insertItem(key);
							delete parentList[key];
						}
					}
				}
			}
			tree = getNodeTree("", -1, 0, parentList, this.points);
			return tree;
		},
		calculateArea: function (parentArea, node) {
			var pointArea, point, series;
			series = this;
			pointArea = series[series.options.layoutAlgorithm](parentArea, node.totalValue);
			// If node is not a leaf, then call this method recursively			 
			if (node.children.length) {
				each(node.children, function (childNode) {
					series.calculateArea(pointArea, childNode);
				});
			} else {
				if (node.totalValue > 0) {
					point = series.points[node.index];
					// Set point values
					point.shapeType = 'rect';
					point.shapeArgs = {
						x: pointArea.x,
						y: pointArea.y,
						width: pointArea.width,
						height: pointArea.height
					};
					point.plotX = pointArea.centerX;
					point.plotY = pointArea.centerY;
				}
			}
			
		},
		getSeriesArea: function (totalValue) {
			var w = this.chart.plotWidth,
				x = w * this._i,
				y = 0,
				h = this.chart.plotHeight,
				seriesArea = new Area(x, y, w, h);
			seriesArea.totalValue = totalValue;
			return seriesArea;
		},
		setColorRecursive: function (node, color) {
			var series = this,
				point = series.points[node.index];
			if (node.index !== -1) {
				if (point.color === undefined) {
					if (color !== undefined) {
						point.color = color;
					}
				} else {
					color = point.color;
				}
			}		
			if (node.children.length) {
				each(node.children, function (childNode) {
					series.setColorRecursive(childNode, color);
				});
			}
		},
		sliceAndDice: function (parent, value) {
			var pointTotal = parent.totalArea * (value / parent.totalValue),
				pointW = parent.plotW(pointTotal),
				pointH = parent.plotH(pointTotal),
				pointX = parent.plotX(pointW),
				pointY = parent.plotY(pointH),
				pointArea = new Area(pointX, pointY, pointW, pointH);
			pointArea.totalValue = value;
			parent.direction = 1 - parent.direction;
			return pointArea;
		},
		stripes: function (parent, value) {
			// Call sliceAndDice
			var pointArea = this.sliceAndDice(parent, value);
			// Reset direction
			parent.direction = 0;
			return pointArea;
		},
		translate: function () {
			H.Series.prototype.translate.call(this);
			this.handleLayout();

			this.translateColors();

			// Make sure colors are updated on colorAxis update (#2893)
			if (this.chart.hasRendered) {
				each(this.points, function (point) {
					point.shapeArgs.fill = point.color;
				});
			}
		},		
		drawPoints: seriesTypes.column.prototype.drawPoints,
		drawLegendSymbol: H.LegendSymbolMixin.drawRectangle
	}));
}(Highcharts));
