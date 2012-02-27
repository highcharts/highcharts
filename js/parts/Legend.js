/**
 * Context holding the variables that were in local closure in the chart.
 */
function LegendContext(
		chart,
		renderer,
		getSpacingBox,
		getIsResizing
	) {
	return {
		chart: chart, // object
		renderer: renderer, // object
		getSpacingBox: getSpacingBox, // function
		getIsResizing: getIsResizing
	};
}

/**
 * The overview of the chart's series
 */
var Legend = function (context) {
	var chart = context.chart,
		renderer = context.renderer,
		legendWidth,
		legendHeight,
		getSpacingBox = context.getSpacingBox,
		container = chart.container,
		getIsResizing = context.getIsResizing;

	var options = chart.options.legend;

	if (!options.enabled) {
		return;
	}

	var horizontal = options.layout === 'horizontal',
		symbolWidth = options.symbolWidth,
		symbolPadding = options.symbolPadding,
		allItems,
		style = options.style,
		itemStyle = options.itemStyle,
		itemHoverStyle = options.itemHoverStyle,
		itemHiddenStyle = merge(itemStyle, options.itemHiddenStyle),
		padding = options.padding || pInt(style.padding),
		ltr = !options.rtl,
		y = 18,
		initialItemX = 4 + padding + symbolWidth + symbolPadding,
		itemX,
		itemY,
		lastItemY,
		itemHeight = 0,
		itemMarginTop = options.itemMarginTop || 0,
		itemMarginBottom = options.itemMarginBottom || 0,
		box,
		legendBorderWidth = options.borderWidth,
		legendBackgroundColor = options.backgroundColor,
		legendGroup,
		offsetWidth,
		widthOption = options.width,
		series = chart.series,
		reversedLegend = options.reversed;



	/**
	 * Set the colors for the legend item
	 * @param {Object} item A Series or Point instance
	 * @param {Object} visible Dimmed or colored
	 */
	function colorizeItem(item, visible) {
		var legendItem = item.legendItem,
			legendLine = item.legendLine,
			legendSymbol = item.legendSymbol,
			hiddenColor = itemHiddenStyle.color,
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
	}

	/**
	 * Position the legend item
	 * @param {Object} item A Series or Point instance
	 * @param {Object} visible Dimmed or colored
	 */
	function positionItem(item) {
		var legendItem = item.legendItem,
			legendLine = item.legendLine,
			legendItemPos = item._legendItemPos,
			itemX = legendItemPos[0],
			itemY = legendItemPos[1],
			legendSymbol = item.legendSymbol,
			symbolX,
			checkbox = item.checkbox;
		
		if (legendItem) {
			legendItem.attr({
				x: ltr ? itemX : legendWidth - itemX,
				y: itemY
			});
		}
		if (legendLine) {
			legendLine.translate(
				ltr ? itemX : legendWidth - itemX,
				itemY - 4
			);
		}
		if (legendSymbol) {
			symbolX = itemX + legendSymbol.xOff;
			legendSymbol.attr({
				x: ltr ? symbolX : legendWidth - symbolX,
				y: itemY + legendSymbol.yOff
			});
		}
		if (checkbox) {
			checkbox.x = itemX;
			checkbox.y = itemY;
		}
	}

	/**
	 * Destroy a single legend item
	 * @param {Object} item The series or point
	 */
	function destroyItem(item) {
		var checkbox = item.checkbox;

		// destroy SVG elements
		each(['legendItem', 'legendLine', 'legendSymbol'], function (key) {
			if (item[key]) {
				item[key].destroy();
			}
		});

		if (checkbox) {
			discardElement(item.checkbox);
		}


	}

	/**
	 * Destroys the legend.
	 */
	function destroy() {
		if (box) {
			box = box.destroy();
		}

		if (legendGroup) {
			legendGroup = legendGroup.destroy();
		}
	}

	/**
	 * Position the checkboxes after the width is determined
	 */
	function positionCheckboxes() {
		each(allItems, function (item) {
			var checkbox = item.checkbox,
				alignAttr = legendGroup.alignAttr;
			if (checkbox) {
				css(checkbox, {
					left: (alignAttr.translateX + item.legendItemWidth + checkbox.x - 40) + PX,
					top: (alignAttr.translateY + checkbox.y - 11) + PX
				});
			}
		});
	}

	/**
	 * Render a single specific legend item
	 * @param {Object} item A series or point
	 */
	function renderItem(item) {
		var bBox,
			itemWidth,
			legendSymbol,
			symbolX,
			symbolY,
			simpleSymbol,
			radius,
			li = item.legendItem,
			series = item.series || item,
			itemOptions = series.options,
			strokeWidth = (itemOptions && itemOptions.borderWidth) || 0;


		if (!li) { // generate it once, later move it

			// let these series types use a simple symbol
			simpleSymbol = /^(bar|pie|area|column)$/.test(series.type);

			// generate the list item text
			item.legendItem = li = renderer.text(
					options.labelFormatter.call(item),
					0,
					0,
					options.useHTML
				)
				.css(item.visible ? itemStyle : itemHiddenStyle)
				.on('mouseover', function () {
					item.setState(HOVER_STATE);
					li.css(itemHoverStyle);
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
				})
				.attr({
					align: ltr ? 'left' : 'right',
					zIndex: 2
				})
				.add(legendGroup);

			// draw the line
			if (!simpleSymbol && itemOptions && itemOptions.lineWidth) {
				var attrs = {
						'stroke-width': itemOptions.lineWidth,
						zIndex: 2
					};
				if (itemOptions.dashStyle) {
					attrs.dashstyle = itemOptions.dashStyle;
				}
				item.legendLine = renderer.path([
					M,
					(-symbolWidth - symbolPadding) * (ltr ? 1 : -1),
					0,
					L,
					(-symbolPadding) * (ltr ? 1 : -1),
					0
				])
				.attr(attrs)
				.add(legendGroup);
			}

			// draw a simple symbol
			if (simpleSymbol) { // bar|pie|area|column

				legendSymbol = renderer.rect(
					(symbolX = -symbolWidth - symbolPadding),
					(symbolY = -11),
					symbolWidth,
					12,
					2
				).attr({
					//'stroke-width': 0,
					zIndex: 3
				}).add(legendGroup);
				
				if (!ltr) {
					symbolX += symbolWidth;
				}
				
			} else if (itemOptions && itemOptions.marker && itemOptions.marker.enabled) { // draw the marker
				radius = itemOptions.marker.radius;
				legendSymbol = renderer.symbol(
					item.symbol,
					(symbolX = -symbolWidth / 2 - symbolPadding - radius),
					(symbolY = -4 - radius),
					2 * radius,
					2 * radius
				)
				.attr(item.pointAttr[NORMAL_STATE])
				.attr({ zIndex: 3 })
				.add(legendGroup);
				
				if (!ltr) {
					symbolX += symbolWidth / 2;
				}

			}
			if (legendSymbol) {
				
				legendSymbol.xOff = symbolX + (strokeWidth % 2 / 2);
				legendSymbol.yOff = symbolY + (strokeWidth % 2 / 2);
			}

			item.legendSymbol = legendSymbol;

			// colorize the items
			colorizeItem(item, item.visible);


			// add the HTML checkbox on top
			if (itemOptions && itemOptions.showCheckbox) {
				item.checkbox = createElement('input', {
					type: 'checkbox',
					checked: item.selected,
					defaultChecked: item.selected // required by IE7
				}, options.itemCheckboxStyle, container);

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
			options.itemWidth || symbolWidth + symbolPadding + bBox.width + padding;
		itemHeight = bBox.height;

		// if the item exceeds the width, start a new line
		if (horizontal && itemX - initialItemX + itemWidth >
				(widthOption || (chart.chartWidth - 2 * padding - initialItemX))) {
			itemX = initialItemX;
			itemY += itemMarginTop + itemHeight + itemMarginBottom;
		}
		lastItemY = itemY + itemMarginBottom;

		// cache the position of the newly generated or reordered items
		item._legendItemPos = [itemX, itemY];

		// advance
		if (horizontal) {
			itemX += itemWidth;
		} else {
			itemY += itemMarginTop + itemHeight + itemMarginBottom;
		}

		// the width of the widest item
		offsetWidth = widthOption || mathMax(
			horizontal ? itemX - initialItemX : itemWidth,
			offsetWidth
		);

	}

	/**
	 * Render the legend. This method can be called both before and after
	 * chart.render. If called after, it will only rearrange items instead
	 * of creating new ones.
	 */
	function renderLegend() {
		itemX = initialItemX;
		itemY = padding + itemMarginTop + y - 5; // 5 is the number of pixels above the text
		offsetWidth = 0;
		lastItemY = 0;

		if (!legendGroup) {
			legendGroup = renderer.g('legend')
				// #414, #759. Trackers will be drawn above the legend, but we have 
				// to sacrifice that because tooltips need to be above the legend
				// and trackers above tooltips
				.attr({ zIndex: 7 }) 
				.add();
		}


		// add each series or point
		allItems = [];
		each(series, function (serie) {
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
		if (reversedLegend) {
			allItems.reverse();
		}

		// render the items
		each(allItems, renderItem);


		// Draw the border
		legendWidth = widthOption || offsetWidth;
		legendHeight = lastItemY - y + itemHeight;

		if (legendBorderWidth || legendBackgroundColor) {
			legendWidth += 2 * padding;
			legendHeight += 2 * padding;

			if (!box) {
				box = renderer.rect(
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
			box[allItems.length ? 'show' : 'hide']();
		}
		
		// Now that the legend width and height are extablished, put the items in the 
		// final position
		each(allItems, positionItem);

		// 1.x compatibility: positioning based on style
		var props = ['left', 'right', 'top', 'bottom'],
			prop,
			i = 4;
		while (i--) {
			prop = props[i];
			if (style[prop] && style[prop] !== 'auto') {
				options[i < 2 ? 'align' : 'verticalAlign'] = prop;
				options[i < 2 ? 'x' : 'y'] = pInt(style[prop]) * (i % 2 ? -1 : 1);
			}
		}

		if (allItems.length) {
			legendGroup.align(extend(options, {
				width: legendWidth,
				height: legendHeight
			}), true, getSpacingBox());
		}

		if (!getIsResizing()) {
			positionCheckboxes();
		}
	}

	function getLegendWidth() {
		return legendWidth;
	}

	function getLegendHeight() {
		return legendHeight;
	}

	// run legend
	renderLegend();

	// move checkboxes
	addEvent(chart, 'endResize', positionCheckboxes);

	// expose
	return {
		colorizeItem: colorizeItem,
		destroyItem: destroyItem,
		renderLegend: renderLegend,
		destroy: destroy,
		getLegendWidth: getLegendWidth,
		getLegendHeight: getLegendHeight
	};
};

