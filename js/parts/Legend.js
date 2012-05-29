/**
 * The overview of the chart's series
 */
function Legend(chart) {

	this.init(chart);
}

Legend.prototype = {
	
	/**
	 * Initialize the legend
	 */
	init: function (chart) {
		var legend = this,
			options = legend.options = chart.options.legend;
	
		if (!options.enabled) {
			return;
		}
	
		var //style = options.style || {}, // deprecated
			itemStyle = options.itemStyle,
			padding = pick(options.padding, 8), // docs
			itemMarginTop = options.itemMarginTop || 0;
	
		legend.baseline = pInt(itemStyle.fontSize) + 3 + itemMarginTop; // used in Series prototype
		legend.itemStyle = itemStyle;
		legend.itemHiddenStyle = merge(itemStyle, options.itemHiddenStyle);
		legend.itemMarginTop = itemMarginTop;
		legend.padding = padding;
		legend.initialItemX = padding;
		legend.initialItemY = padding - 5; // 5 is the number of pixels above the text
		legend.maxItemWidth = 0;
		legend.chart = chart;
		//legend.allItems = UNDEFINED;
		//legend.legendWidth = UNDEFINED;
		//legend.legendHeight = UNDEFINED;
		//legend.offsetWidth = UNDEFINED;
		legend.itemHeight = 0;
		legend.lastLineHeight = 0;
		//legend.itemX = UNDEFINED;
		//legend.itemY = UNDEFINED;
		//legend.lastItemY = UNDEFINED;
	
		// Elements
		//legend.group = UNDEFINED;
		//legend.box = UNDEFINED;

		// run legend
		legend.render();

		// move checkboxes
		addEvent(legend.chart, 'endResize', function () { legend.positionCheckboxes(); });

/*		// expose
		return {
			colorizeItem: colorizeItem,
			destroyItem: destroyItem,
			render: render,
			destroy: destroy,
			getLegendWidth: getLegendWidth,
			getLegendHeight: getLegendHeight
		};*/
	},

	/**
	 * Set the colors for the legend item
	 * @param {Object} item A Series or Point instance
	 * @param {Object} visible Dimmed or colored
	 */
	colorizeItem: function (item, visible) {
		var legend = this,
			options = legend.options,
			legendItem = item.legendItem,
			legendLine = item.legendLine,
			legendSymbol = item.legendSymbol,
			hiddenColor = legend.itemHiddenStyle.color,
			textColor = visible ? options.itemStyle.color : hiddenColor,
			symbolColor = visible ? item.color : hiddenColor;

		if (legendItem) {
			legendItem.css({ fill: textColor });
		}
		if (legendLine) {
			legendLine.attr({ stroke: symbolColor });
		}
		if (legendSymbol) {
			legendSymbol.attr({
				stroke: symbolColor,
				fill: symbolColor
			});
		}
	},

	/**
	 * Position the legend item
	 * @param {Object} item A Series or Point instance
	 */
	positionItem: function (item) {
		var legend = this,
			options = legend.options,
			symbolPadding = options.symbolPadding,
			ltr = !options.rtl,
			legendItemPos = item._legendItemPos,
			itemX = legendItemPos[0],
			itemY = legendItemPos[1],
			checkbox = item.checkbox;

		if (item.legendGroup) {
			item.legendGroup.translate(
				ltr ? itemX : legend.legendWidth - itemX - 2 * symbolPadding - 4,
				itemY
			);
		}

		if (checkbox) {
			checkbox.x = itemX;
			checkbox.y = itemY;
		}
	},

	/**
	 * Destroy a single legend item
	 * @param {Object} item The series or point
	 */
	destroyItem: function (item) {
		var checkbox = item.checkbox;

		// destroy SVG elements
		each(['legendItem', 'legendLine', 'legendSymbol', 'legendGroup'], function (key) {
			if (item[key]) {
				item[key].destroy();
			}
		});

		if (checkbox) {
			discardElement(item.checkbox);
		}
	},

	/**
	 * Destroys the legend.
	 */
	destroy: function () {
		var legend = this,
			legendGroup = legend.group,
			box = legend.box;

		if (box) {
			legend.box = box.destroy();
		}

		if (legendGroup) {
			legend.group = legendGroup.destroy();
		}
	},

	/**
	 * Position the checkboxes after the width is determined
	 */
	positionCheckboxes: function () {
		var legend = this;

		each(legend.allItems, function (item) {
			var checkbox = item.checkbox,
				alignAttr = legend.group.alignAttr;
			if (checkbox) {
				css(checkbox, {
					left: (alignAttr.translateX + item.legendItemWidth + checkbox.x - 20) + PX,
					top: (alignAttr.translateY + checkbox.y + 3) + PX
				});
			}
		});
	},

	/**
	 * Render a single specific legend item
	 * @param {Object} item A series or point
	 */
	renderItem: function (item) {
		var legend = this,
			chart = legend.chart,
			renderer = chart.renderer,
			options = legend.options,
			horizontal = options.layout === 'horizontal',
			symbolWidth = options.symbolWidth,
			symbolPadding = options.symbolPadding,
			itemStyle = legend.itemStyle,
			itemHiddenStyle = legend.itemHiddenStyle,
			padding = legend.padding,
			ltr = !options.rtl,
			itemHeight,
			widthOption = options.width,
			itemMarginBottom = options.itemMarginBottom || 0,
			itemMarginTop = legend.itemMarginTop,
			initialItemX = legend.initialItemX,
			bBox,
			itemWidth,
			li = item.legendItem,
			series = item.series || item,
			itemOptions = series.options,
			showCheckbox = itemOptions.showCheckbox;

		if (!li) { // generate it once, later move it

			// Generate the group box
			// A group to hold the symbol and text. Text is to be appended in Legend class.
			item.legendGroup = renderer.g('legend-item')
				.attr({ zIndex: 1 })
				.add(legend.scrollGroup);

			// Draw the legend symbol inside the group box
			series.drawLegendSymbol(legend, item);

			// Generate the list item text and add it to the group
			item.legendItem = li = renderer.text(
					options.labelFormatter.call(item),
					ltr ? symbolWidth + symbolPadding : -symbolPadding,
					legend.baseline,
					options.useHTML
				)
				.css(item.visible ? itemStyle : itemHiddenStyle)
				.attr({
					align: ltr ? 'left' : 'right',
					zIndex: 2
				})
				.add(item.legendGroup);

			// Set the events on the item group
			item.legendGroup.on('mouseover', function () {
					item.setState(HOVER_STATE);
					li.css(legend.options.itemHoverStyle);
				})
				.on('mouseout', function () {
					li.css(item.visible ? itemStyle : itemHiddenStyle);
					item.setState();
				})
				.on('click', function () {
					var strLegendItemClick = 'legendItemClick',
						fnLegendItemClick = function () {
							item.setVisible();
						};

					// click the name or symbol
					if (item.firePointEvent) { // point
						item.firePointEvent(strLegendItemClick, null, fnLegendItemClick);
					} else {
						fireEvent(item, strLegendItemClick, null, fnLegendItemClick);
					}
				});

			// Colorize the items
			legend.colorizeItem(item, item.visible);

			// add the HTML checkbox on top
			if (itemOptions && showCheckbox) {
				item.checkbox = createElement('input', {
					type: 'checkbox',
					checked: item.selected,
					defaultChecked: item.selected // required by IE7
				}, options.itemCheckboxStyle, chart.container);

				addEvent(item.checkbox, 'click', function (event) {
					var target = event.target;
					fireEvent(item, 'checkboxClick', {
							checked: target.checked
						},
						function () {
							item.select();
						}
					);
				});
			}
		}

		// calculate the positions for the next line
		bBox = li.getBBox();

		itemWidth = item.legendItemWidth =
			options.itemWidth || symbolWidth + symbolPadding + bBox.width + padding +
			(showCheckbox ? 20 : 0);
		legend.itemHeight = itemHeight = bBox.height;

		// if the item exceeds the width, start a new line
		if (horizontal && legend.itemX - initialItemX + itemWidth >
				(widthOption || (chart.chartWidth - 2 * padding - initialItemX))) {
			legend.itemX = initialItemX;
			legend.itemY += itemMarginTop + legend.lastLineHeight + itemMarginBottom;
			legend.lastLineHeight = 0; // reset for next line
		}

		// If the item exceeds the height, start a new column
		/*if (!horizontal && legend.itemY + options.y + itemHeight > chart.chartHeight - spacingTop - spacingBottom) {
			legend.itemY = legend.initialItemY;
			legend.itemX += legend.maxItemWidth;
			legend.maxItemWidth = 0;
		}*/

		// Set the edge positions
		legend.maxItemWidth = mathMax(legend.maxItemWidth, itemWidth);
		legend.lastItemY = itemMarginTop + legend.itemY + itemMarginBottom;
		legend.lastLineHeight = mathMax(itemHeight, legend.lastLineHeight); // #915

		// cache the position of the newly generated or reordered items
		item._legendItemPos = [legend.itemX, legend.itemY];

		// advance
		if (horizontal) {
			legend.itemX += itemWidth;

		} else {
			legend.itemY += itemMarginTop + itemHeight + itemMarginBottom;
			legend.lastLineHeight = itemHeight;
		}

		// the width of the widest item
		legend.offsetWidth = widthOption || mathMax(
			horizontal ? legend.itemX - initialItemX : itemWidth,
			legend.offsetWidth
		);
	},

	/**
	 * Render the legend. This method can be called both before and after
	 * chart.render. If called after, it will only rearrange items instead
	 * of creating new ones.
	 */
	render: function () {
		var legend = this,
			chart = legend.chart,
			renderer = chart.renderer,
			legendGroup = legend.group,
			allItems,
			display,
			legendWidth,
			legendHeight,
			box = legend.box,
			options = legend.options,
			padding = legend.padding,
			legendBorderWidth = options.borderWidth,
			legendBackgroundColor = options.backgroundColor;

		legend.itemX = legend.initialItemX;
		legend.itemY = legend.initialItemY;
		legend.offsetWidth = 0;
		legend.lastItemY = 0;

		if (!legendGroup) {
			legend.group = legendGroup = renderer.g('legend')
				// #414, #759. Trackers will be drawn above the legend, but we have 
				// to sacrifice that because tooltips need to be above the legend
				// and trackers above tooltips
				.attr({ zIndex: 7 }) 
				.add();
			legend.contentGroup = renderer.g()
				.attr({ zIndex: 1 }) // above background
				.add(legendGroup);
			legend.scrollGroup = renderer.g()
				.add(legend.contentGroup);
			legend.clipRect = renderer.clipRect(0, 0, chart.chartWidth, chart.chartHeight);
			legend.contentGroup.clip(legend.clipRect);
		}

		// add each series or point
		allItems = [];
		each(chart.series, function (serie) {
			var seriesOptions = serie.options;

			if (!seriesOptions.showInLegend) {
				return;
			}

			// use points or series for the legend item depending on legendType
			allItems = allItems.concat(
					serie.legendItems ||
					(seriesOptions.legendType === 'point' ?
							serie.data :
							serie)
			);
		});

		// sort by legendIndex
		stableSort(allItems, function (a, b) {
			return (a.options.legendIndex || 0) - (b.options.legendIndex || 0);
		});

		// reversed legend
		if (options.reversed) {
			allItems.reverse();
		}

		legend.allItems = allItems;
		legend.display = display = !!allItems.length;

		// render the items
		each(allItems, function (item) {
			legend.renderItem(item); 
		});

		// Draw the border
		legendWidth = options.width || legend.offsetWidth;
		legendHeight = legend.lastItemY + legend.lastLineHeight;
		
		
		legendHeight = legend.handleOverflow(legendHeight);

		if (legendBorderWidth || legendBackgroundColor) {
			legendWidth += padding;
			legendHeight += padding;

			if (!box) {
				legend.box = box = renderer.rect(
					0,
					0,
					legendWidth,
					legendHeight,
					options.borderRadius,
					legendBorderWidth || 0
				).attr({
					stroke: options.borderColor,
					'stroke-width': legendBorderWidth || 0,
					fill: legendBackgroundColor || NONE
				})
				.add(legendGroup)
				.shadow(options.shadow);
				box.isNew = true;

			} else if (legendWidth > 0 && legendHeight > 0) {
				box[box.isNew ? 'attr' : 'animate'](
					box.crisp(null, null, null, legendWidth, legendHeight)
				);
				box.isNew = false;
			}

			// hide the border if no items
			box[display ? 'show' : 'hide']();
		}
		
		legend.legendWidth = legendWidth;
		legend.legendHeight = legendHeight;

		// Now that the legend width and height are established, put the items in the 
		// final position
		each(allItems, function (item) {
			legend.positionItem(item);
		});

		// 1.x compatibility: positioning based on style
		/*var props = ['left', 'right', 'top', 'bottom'],
			prop,
			i = 4;
		while (i--) {
			prop = props[i];
			if (options.style[prop] && options.style[prop] !== 'auto') {
				options[i < 2 ? 'align' : 'verticalAlign'] = prop;
				options[i < 2 ? 'x' : 'y'] = pInt(options.style[prop]) * (i % 2 ? -1 : 1);
			}
		}*/

		if (display) {
			legendGroup.align(extend({
				width: legendWidth,
				height: legendHeight
			}, options), true, chart.spacingBox);
		}

		if (!chart.isResizing) {
			this.positionCheckboxes();
		}
	},
	
	/**
	 * Set up the overflow handling by adding navigation with up and down arrows below the
	 * legend.
	 */
	handleOverflow: function (legendHeight) {
		var legend = this,
			chart = this.chart,
			renderer = chart.renderer,
			pageCount,
			options = this.options,
			optionsY = options.y,
			alignTop = options.verticalAlign === 'top',
			spaceHeight = chart.spacingBox.height + (alignTop ? -optionsY : optionsY) - this.padding,
			clipHeight,
			clipRect = this.clipRect,
			navOptions = options.navigation,
			animation = pick(navOptions.animation, true),
			arrowSize = navOptions.arrowSize || 12,
			nav = this.nav;
			
		if (options.layout === 'horizontal') {
			spaceHeight /= 2;
		}
		
		// Reset the legend height and adjust the clipping rectangle
		if (legendHeight > spaceHeight) {
			
			this.clipHeight = clipHeight = spaceHeight - 20;
			this.pageCount = pageCount = mathCeil(legendHeight / clipHeight);
			this.currentPage = pick(this.currentPage, 1);
			this.fullHeight = legendHeight;
			
			clipRect.attr({
				height: clipHeight
			});
			
			// Add navigation elements
			if (!nav) {
				this.nav = nav = renderer.g().attr({ zIndex: 1 }).add(this.group);
				this.up = renderer.symbol('triangle', 0, 0, arrowSize, arrowSize)
					.on('click', function () {
						legend.scroll(-1, animation);
					})
					.add(nav);
				this.pager = renderer.text('', 15, 10)
					.css(navOptions.style)
					.add(nav);
				this.down = renderer.symbol('triangle-down', 0, 0, arrowSize, arrowSize)
					.on('click', function () {
						legend.scroll(1, animation);
					})
					.add(nav);
			}
			
			// Set initial position
			legend.scroll(0);
			
			legendHeight = spaceHeight;
			
		} else if (nav) {
			clipRect.attr({
				height: chart.chartHeight
			});
			nav.hide();
			this.scrollGroup.attr({
				translateY: 1
			});
		}
		
		return legendHeight;
	},
	
	/**
	 * Scroll the legend by a number of pages
	 * @param {Object} scrollBy
	 * @param {Object} animation
	 */
	scroll: function (scrollBy, animation) {
		var pageCount = this.pageCount,
			currentPage = this.currentPage + scrollBy,
			clipHeight = this.clipHeight,
			navOptions = this.options.navigation,
			activeColor = navOptions.activeColor,
			inactiveColor = navOptions.inactiveColor,
			pager = this.pager,
			padding = this.padding;
		
		// When resizing while looking at the last page
		if (currentPage > pageCount) {
			currentPage = pageCount;
		}
		
		if (currentPage > 0) {
			
			if (animation !== UNDEFINED) {
				setAnimation(animation, this.chart);
			}
			
			this.nav.attr({
				translateX: padding,
				translateY: clipHeight + 7,
				visibility: VISIBLE
			});
			this.up.attr({
					fill: currentPage === 1 ? inactiveColor : activeColor
				})
				.css({
					cursor: currentPage === 1 ? 'default' : 'pointer'
				});
			pager.attr({
				text: currentPage + '/' + this.pageCount
			});
			this.down.attr({
					x: 18 + this.pager.getBBox().width, // adjust to text width
					fill: currentPage === pageCount ? inactiveColor : activeColor
				})
				.css({
					cursor: currentPage === pageCount ? 'default' : 'pointer'
				});
			
			this.scrollGroup.animate({
				translateY: -mathMin(clipHeight * (currentPage - 1), this.fullHeight - clipHeight + padding) + 1
			});
			pager.attr({
				text: currentPage + '/' + pageCount
			});
			
			
			this.currentPage = currentPage;
		}
			
	}
	
};

