/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 *
 * (c) 2014 Highsoft AS
 * Authors: Jon Arild Nygard / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
(function (H) {
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
		this.val = 0;
	}

	// Define default options
	plotOptions.treemap = merge(plotOptions.scatter, {
		legend: false,
		marker: false,
		borderColor: '#FFFFFF',
		borderWidth: 1,
		borderRadius: 0,
		radius: 0,
		dataLabels: {
			verticalAlign: 'middle',
			formatter: function () { // #2945
				return this.point.id;
			}
		},
		tooltip: {
			headerFormat: '',
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
		isCartesian: false,	
		trackerGroups: ['group', 'dataLabelsGroup'],
		handleLayout: function () {
		var tree = this.buildTree(),
			seriesArea = this.getSeriesArea(tree.val);
			this.calculateArea(tree, seriesArea);
			this.setColorRecursive(tree, undefined);
		},
		buildTree: function () {
			var tree,
				i = 0,
				parentList = [],
				allIds = [],
				key,
				insertItem = function (key) {
					each(parentList[key], function (item) {
						parentList[""].push(item);
					});
				},
				getNodeTree = function (id, i, level, list, points) {
					var children = [],
						sortedChildren = [],
						val = 0,
						nodeTree,
						node,
						insertNode;
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
					if (list[id] !== undefined) {
						each(list[id], function (i) {
							node = getNodeTree(points[i].id, i, (level + 1), list, points);
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
		calculateArea: function (node, area) {
			var childrenValues = [],
				childValues,
				series = this,
				i = 0,
				setPointValues = function (node, values) {
					var point;
					if (node.val > 0) {
						point = series.points[node.i];
						// Set point values
						point.shapeType = 'rect';
						point.shapeArgs = {
							x: values.x,
							y: values.y,
							width: values.width,
							height: values.height
						};
						point.plotX = point.shapeArgs.x + (point.shapeArgs.width / 2);
						point.plotY = point.shapeArgs.y + (point.shapeArgs.height / 2);
					}
				};
			childrenValues = series[series.options.layoutAlgorithm](area, node.children);
			each(node.children, function (child) {
				childValues = childrenValues[i];
				childValues.val = child.val;
				// If node has children, then call method recursively
				if (child.children.length) {
					series.calculateArea(child, childValues);
				} else {
					setPointValues(child, childValues);
				}
				i = i + 1;
			});
		},
		getSeriesArea: function (val) {
			var w = this.chart.plotWidth,
				x = w * this._i,
				y = 0,
				h = this.chart.plotHeight,
				seriesArea = new Area(x, y, w, h);
			seriesArea.val = val;
			return seriesArea;
		},
		setColorRecursive: function (node, color) {
			var series = this,
				point = series.points[node.i];
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
			if (node.children.length) {
				each(node.children, function (child) {
					series.setColorRecursive(child, color);
				});
			}
		},
		strip: function (parent, children) {
			var childrenArea = [],
				pTot,
				x = parent.x,
				y = parent.y,
				height = parent.height,
				i = 0,
				end = children.length - 1,
				group = {
					total: 0,
					nW: 0,
					lW: 0,
					elArr: [],
					lP: {
						total: 0,
						lH: 0,
						nH: 0,
						nR: 0,
						lR: 0,
						aspectRatio: function (w, h) {
							return Math.max((w / h), (h / w));
						}
					},
					addElement: function (el) {
						this.lW = this.nW;
						// Calculate last point old aspect ratio
						this.lP.total = this.elArr[this.elArr.length - 1];
						this.lP.lH = this.lP.total / this.nW;
						this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH);
						// New total
						this.total = this.total + el;
						this.nW = this.total / height;
						// Calculate last point new aspect ratio
						this.lP.nH = this.lP.total / this.nW;
						this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH);
						this.elArr.push(el);
						
					},
					reset: function () {
						this.nW = 0;
						this.lW = 0;
						this.elArr = [];
						this.total = 0;
					}
				},
				calculateGroupPoints = function (last) {
					var pX,
						pY,
						pW,
						pH,
						gW = group.lW,
						keep,
						i = 0,
						end = group.elArr.length - 1;
					if (last) {
						gW = group.nW;
					} else {
						keep = group.elArr[group.elArr.length - 1];
					}
					each(group.elArr, function (p) {
						if (last || (i < end)) {
							pX = x;
							pY = y; 
							pW = gW;
							pH = p / pW;
							childrenArea.push(new Area(pX, pY, pW, pH));
							y = y + pH;
						}
						i = i + 1;
					});
					// Reset variables
					group.reset();
					y = parent.y;
					x = x + gW;
					// If not last, then add uncalculated element
					if (!last) {
						group.addElement(keep);
					}
				};
			// Loop through and calculate all areas
			each(children, function (child) {
				pTot = (parent.width * parent.height) * (child.val / parent.val);
				group.addElement(pTot);
				if (group.lP.nR > group.lP.lR) {
					calculateGroupPoints(false);
				}
				// If last child, then calculate all remaining areas
				if (i === end) {
					calculateGroupPoints(true);
				}
				i = i + 1;
			});
			return childrenArea;
		},
		squarified: function (parent, children) {
			var childrenArea = [],
				pTot,
				x = parent.x,
				y = parent.y,
				height = parent.height,
				width = parent.width,
				i = 0,
				direction = 0,
				end = children.length - 1,
				group = {
					total: 0,
					nW: 0,
					lW: 0,
					nH: 0,
					lH: 0,
					elArr: [],
					lP: {
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
					},
					addElement: function (el) {
						this.lP.total = this.elArr[this.elArr.length - 1];
						this.total = this.total + el;
						if (direction === 0) {
							// Calculate last point old aspect ratio
							this.lW = this.nW;
							this.lP.lH = this.lP.total / this.lW;
							this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH);
							// Calculate last point new aspect ratio
							this.nW = this.total / height;
							this.lP.nH = this.lP.total / this.nW;
							this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH);
						} else {
							// Calculate last point old aspect ratio
							this.lH = this.nH;
							this.lP.lW = this.lP.total / this.lH;
							this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH);
							// Calculate last point new aspect ratio
							this.nH = this.total / width;
							this.lP.nW = this.lP.total / this.nH;
							this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH);
						}
						this.elArr.push(el);						
					},
					reset: function () {
						this.nW = 0;
						this.lW = 0;
						this.elArr = [];
						this.total = 0;
					}
				},
				calculateGroupPoints = function (last) {
					var pX,
						pY,
						pW,
						pH,
						gW = group.lW,
						gH = group.lH,
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
							if (direction === 0) {
								pX = x;
								pY = y; 
								pW = gW;
								pH = p / pW;
							} else {
								pX = x;
								pY = y;
								pH = gH;
								pW = p / pH;
							}
							childrenArea.push(new Area(pX, pY, pW, pH));
							if (direction === 0) {
								y = y + pH;
							} else {
								x = x + pW;
							}							
						}
						i = i + 1;
					});
					// Reset variables
					group.reset();
					if (direction === 0) {
						width = width - gW;
					} else {
						height = height - gH;
					}
					y = parent.y + (parent.height - height);
					x = parent.x + (parent.width - width);
					direction = 1 - direction;
					// If not last, then add uncalculated element
					if (!last) {
						group.addElement(keep);
					}
				};
			// Loop through and calculate all areas
			each(children, function (child) {
				pTot = (parent.width * parent.height) * (child.val / parent.val);
				group.addElement(pTot);
				if (group.lP.nR > group.lP.lR) {
					calculateGroupPoints(false);
				}
				// If last child, then calculate all remaining areas
				if (i === end) {
					calculateGroupPoints(true);
				}
				i = i + 1;
			});
			return childrenArea;
		},
		sliceAndDice: function (parent, children) {
			var childrenArea = [],
				pTot,
				direction = 0,
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
				childrenArea.push(new Area(pX, pY, pW, pH));
				direction = 1 - direction;
			});
			return childrenArea;
		},
		stripes: function (parent, children) {
			var childrenArea = [],
				pTot,
				x = parent.x,
				y = parent.y,
				width = parent.width,
				pX,
				pY,
				pW,
				pH;
			each(children, function (child) {
				pTot = (parent.width * parent.height) * (child.val / parent.val);
				pX = x;
				pY = y;
				pH = parent.height;
				pW = pTot / pH;
				width = width - pW;
				x = x + pW;
				childrenArea.push(new Area(pX, pY, pW, pH));
			});
			return childrenArea;
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
