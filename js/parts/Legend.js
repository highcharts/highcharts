/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from './Globals.js';
import './Utilities.js';
var H = Highcharts,

	addEvent = H.addEvent,
	css = H.css,
	discardElement = H.discardElement,
	defined = H.defined,
	each = H.each,
	isFirefox = H.isFirefox,
	marginNames = H.marginNames,
	merge = H.merge,
	pick = H.pick,
	setAnimation = H.setAnimation,
	stableSort = H.stableSort,
	win = H.win,
	wrap = H.wrap;

/**
 * The overview of the chart's series. The legend object is instanciated
 * internally in the chart constructor, and available from `chart.legend`. Each
 * chart has only one legend.
 * 
 * @class
 */
Highcharts.Legend = function (chart, options) {
	this.init(chart, options);
};

Highcharts.Legend.prototype = {

	/**
	 * Initialize the legend.
	 *
	 * @private
	 */
	init: function (chart, options) {

		this.chart = chart;
		
		this.setOptions(options);
		
		if (options.enabled) {
		
			// Render it
			this.render();

			// move checkboxes
			addEvent(this.chart, 'endResize', function () {
				this.legend.positionCheckboxes();
			});
		}
	},

	setOptions: function (options) {

		var padding = pick(options.padding, 8);

		this.options = options;
	
		/*= if (build.classic) { =*/
		this.itemStyle = options.itemStyle;
		this.itemHiddenStyle = merge(this.itemStyle, options.itemHiddenStyle);
		/*= } =*/
		this.itemMarginTop = options.itemMarginTop || 0;
		this.padding = padding;
		this.initialItemY = padding - 5; // 5 is pixels above the text
		this.maxItemWidth = 0;
		this.itemHeight = 0;
		this.symbolWidth = pick(options.symbolWidth, 16);
		this.pages = [];

	},

	/**
	 * Update the legend with new options. Equivalent to running `chart.update`
	 * with a legend configuration option.
	 * @param  {LegendOptions} options
	 *         Legend options.
	 * @param  {Boolean} [redraw=true]
	 *         Whether to redraw the chart.
	 *
	 * @sample highcharts/legend/legend-update/
	 *         Legend update
	 */
	update: function (options, redraw) {
		var chart = this.chart;

		this.setOptions(merge(true, this.options, options));
		this.destroy();
		chart.isDirtyLegend = chart.isDirtyBox = true;
		if (pick(redraw, true)) {
			chart.redraw();
		}
	},

	/**
	 * Set the colors for the legend item.
	 *
	 * @private
	 * @param  {Series|Point} item
	 *         A Series or Point instance
	 * @param  {Boolean} visible
	 *         Dimmed or colored
	 */
	colorizeItem: function (item, visible) {
		item.legendGroup[visible ? 'removeClass' : 'addClass'](
			'highcharts-legend-item-hidden'
		);

		/*= if (build.classic) { =*/
		var legend = this,
			options = legend.options,
			legendItem = item.legendItem,
			legendLine = item.legendLine,
			legendSymbol = item.legendSymbol,
			hiddenColor = legend.itemHiddenStyle.color,
			textColor = visible ? options.itemStyle.color : hiddenColor,
			symbolColor = visible ? (item.color || hiddenColor) : hiddenColor,
			markerOptions = item.options && item.options.marker,
			symbolAttr = { fill: symbolColor };

		if (legendItem) {
			legendItem.css({
				fill: textColor,
				color: textColor // #1553, oldIE
			}); 
		}
		if (legendLine) {
			legendLine.attr({ stroke: symbolColor });
		}

		if (legendSymbol) {

			// Apply marker options
			if (markerOptions && legendSymbol.isMarker) { // #585
				symbolAttr = item.pointAttribs();
				if (!visible) {
					symbolAttr.stroke = symbolAttr.fill = hiddenColor; // #6769
				}
			}

			legendSymbol.attr(symbolAttr);
		}
		/*= } =*/
	},

	/**
	 * Position the legend item.
	 *
	 * @private
	 * @param {Series|Point} item
	 *        The item to position
	 */
	positionItem: function (item) {
		var legend = this,
			options = legend.options,
			symbolPadding = options.symbolPadding,
			ltr = !options.rtl,
			legendItemPos = item._legendItemPos,
			itemX = legendItemPos[0],
			itemY = legendItemPos[1],
			checkbox = item.checkbox,
			legendGroup = item.legendGroup;

		if (legendGroup && legendGroup.element) {
			legendGroup.translate(
				ltr ? 
					itemX :
					legend.legendWidth - itemX - 2 * symbolPadding - 4,
				itemY
			);
		}

		if (checkbox) {
			checkbox.x = itemX;
			checkbox.y = itemY;
		}
	},

	/**
	 * Destroy a single legend item, used internally on removing series items.
	 * 
	 * @param {Series|Point} item
	 *        The item to remove
	 */
	destroyItem: function (item) {
		var checkbox = item.checkbox;

		// destroy SVG elements
		each(
			['legendItem', 'legendLine', 'legendSymbol', 'legendGroup'],
			function (key) {
				if (item[key]) {
					item[key] = item[key].destroy();
				}
			}
		);

		if (checkbox) {
			discardElement(item.checkbox);
		}
	},

	/**
	 * Destroy the legend. Used internally. To reflow objects, `chart.redraw`
	 * must be called after destruction.
	 */
	destroy: function () {
		function destroyItems(key) {
			if (this[key]) {
				this[key] = this[key].destroy();
			}
		}

		// Destroy items
		each(this.getAllItems(), function (item) {
			each(['legendItem', 'legendGroup'], destroyItems, item);
		});

		// Destroy legend elements
		each([
			'clipRect',
			'up',
			'down',
			'pager',
			'nav',
			'box',
			'title',
			'group'
		], destroyItems, this);
		this.display = null; // Reset in .render on update.
	},

	/**
	 * Position the checkboxes after the width is determined.
	 *
	 * @private
	 */
	positionCheckboxes: function () {
		var alignAttr = this.group && this.group.alignAttr,
			translateY,
			clipHeight = this.clipHeight || this.legendHeight,
			titleHeight = this.titleHeight;

		if (alignAttr) {
			translateY = alignAttr.translateY;
			each(this.allItems, function (item) {
				var checkbox = item.checkbox,
					top;

				if (checkbox) {
					top = translateY + titleHeight + checkbox.y +
						(this.scrollOffset || 0) + 3;
					css(checkbox, {
						left: (alignAttr.translateX + item.checkboxOffset +
							checkbox.x - 20) + 'px',
						top: top + 'px',
						display: top > translateY - 6 && top < translateY +
							clipHeight - 6 ? '' : 'none'
					});
				}
			}, this);
		}
	},

	/**
	 * Render the legend title on top of the legend.
	 *
	 * @private
	 */
	renderTitle: function () {
		var options = this.options,
			padding = this.padding,
			titleOptions = options.title,
			titleHeight = 0,
			bBox;

		if (titleOptions.text) {
			if (!this.title) {
				this.title = this.chart.renderer.label(
						titleOptions.text,
						padding - 3,
						padding - 4,
						null,
						null,
						null,
						options.useHTML,
						null,
						'legend-title'
					)
					.attr({ zIndex: 1 })
					/*= if (build.classic) { =*/
					.css(titleOptions.style)
					/*= } =*/
					.add(this.group);
			}
			bBox = this.title.getBBox();
			titleHeight = bBox.height;
			this.offsetWidth = bBox.width; // #1717
			this.contentGroup.attr({ translateY: titleHeight });
		}
		this.titleHeight = titleHeight;
	},

	/**
	 * Set the legend item text.
	 *
	 * @param  {Series|Point} item
	 *         The item for which to update the text in the legend.
	 */
	setText: function (item) {
		var options = this.options;
		item.legendItem.attr({
			text: options.labelFormat ?
				H.format(options.labelFormat, item, this.chart.time) :
				options.labelFormatter.call(item)
		});
	},

	/**
	 * Render a single specific legend item. Called internally from the `render`
	 * function.
	 *
	 * @private
	 * @param {Series|Point} item
	 *        The item to render.
	 */
	renderItem: function (item) {
		var legend = this,
			chart = legend.chart,
			renderer = chart.renderer,
			options = legend.options,
			horizontal = options.layout === 'horizontal',
			symbolWidth = legend.symbolWidth,
			symbolPadding = options.symbolPadding,
			/*= if (build.classic) { =*/
			itemStyle = legend.itemStyle,
			itemHiddenStyle = legend.itemHiddenStyle,
			/*= } =*/
			padding = legend.padding,
			itemDistance = horizontal ? pick(options.itemDistance, 20) : 0,
			ltr = !options.rtl,
			itemHeight,
			widthOption = options.width,
			itemMarginBottom = options.itemMarginBottom || 0,
			itemMarginTop = legend.itemMarginTop,
			bBox,
			itemWidth,
			li = item.legendItem,
			isSeries = !item.series,
			series = !isSeries && item.series.drawLegendSymbol ?
				item.series :
				item,
			seriesOptions = series.options,
			showCheckbox = legend.createCheckboxForItem &&
				seriesOptions &&
				seriesOptions.showCheckbox,
			// full width minus text width
			itemExtraWidth = symbolWidth + symbolPadding + itemDistance +
				(showCheckbox ? 20 : 0),
			useHTML = options.useHTML,
			fontSize = 12,
			itemClassName = item.options.className;

		if (!li) { // generate it once, later move it

			// Generate the group box, a group to hold the symbol and text. Text
			// is to be appended in Legend class.
			item.legendGroup = renderer.g('legend-item')
				.addClass(
					'highcharts-' + series.type + '-series ' +
					'highcharts-color-' + item.colorIndex +
					(itemClassName ? ' ' + itemClassName : '') +
					(isSeries ? ' highcharts-series-' + item.index : '')
				)
				.attr({ zIndex: 1 })
				.add(legend.scrollGroup);

			// Generate the list item text and add it to the group
			item.legendItem = li = renderer.text(
					'',
					ltr ? symbolWidth + symbolPadding : -symbolPadding,
					legend.baseline || 0,
					useHTML
				)
				/*= if (build.classic) { =*/
				// merge to prevent modifying original (#1021)
				.css(merge(item.visible ? itemStyle : itemHiddenStyle))
				/*= } =*/
				.attr({
					align: ltr ? 'left' : 'right',
					zIndex: 2
				})
				.add(item.legendGroup);

			// Get the baseline for the first item - the font size is equal for
			// all
			if (!legend.baseline) {
				/*= if (build.classic) { =*/
				fontSize = itemStyle.fontSize;
				/*= } =*/
				legend.fontMetrics = renderer.fontMetrics(
					fontSize,
					li
				);
				legend.baseline = legend.fontMetrics.f + 3 + itemMarginTop;
				li.attr('y', legend.baseline);
			}

			// Draw the legend symbol inside the group box
			legend.symbolHeight = options.symbolHeight || legend.fontMetrics.f;
			series.drawLegendSymbol(legend, item);

			if (legend.setItemEvents) {
				legend.setItemEvents(item, li, useHTML);
			}			

			// add the HTML checkbox on top
			if (showCheckbox) {
				legend.createCheckboxForItem(item);
			}
		}

		// Colorize the items
		legend.colorizeItem(item, item.visible);

		// Take care of max width and text overflow (#6659)
		/*= if (build.classic) { =*/
		if (!itemStyle.width) {
		/*= } =*/
			li.css({
				width: (
					options.itemWidth ||
					options.width ||
					chart.spacingBox.width
				) -	itemExtraWidth
			});
		/*= if (build.classic) { =*/
		}
		/*= } =*/

		// Always update the text
		legend.setText(item);

		// calculate the positions for the next line
		bBox = li.getBBox();

		itemWidth = item.checkboxOffset =
			options.itemWidth ||
			item.legendItemWidth ||
			bBox.width + itemExtraWidth;
		legend.itemHeight = itemHeight = Math.round(
			item.legendItemHeight || bBox.height || legend.symbolHeight
		);

		// If the item exceeds the width, start a new line
		if (
			horizontal &&
			legend.itemX - padding + itemWidth > (
				widthOption || (
					chart.spacingBox.width - 2 * padding - options.x
				)
			)
		) {
			legend.itemX = padding;
			legend.itemY += itemMarginTop + legend.lastLineHeight +
				itemMarginBottom;
			legend.lastLineHeight = 0; // reset for next line (#915, #3976)
		}

		// If the item exceeds the height, start a new column
		/*
		if (!horizontal && legend.itemY + options.y +
				itemHeight > chart.chartHeight - spacingTop - spacingBottom) {
			legend.itemY = legend.initialItemY;
			legend.itemX += legend.maxItemWidth;
			legend.maxItemWidth = 0;
		}
		*/

		// Set the edge positions
		legend.maxItemWidth = Math.max(legend.maxItemWidth, itemWidth);
		legend.lastItemY = itemMarginTop + legend.itemY + itemMarginBottom;
		legend.lastLineHeight = Math.max( // #915
			itemHeight,
			legend.lastLineHeight
		);

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
		legend.offsetWidth = widthOption || Math.max(
			(
				horizontal ? legend.itemX - padding - (item.checkbox ?
					// decrease by itemDistance only when no checkbox #4853
					0 :
					itemDistance
				) : itemWidth
			) + padding,
			legend.offsetWidth
		);
	},

	/**
	 * Get all items, which is one item per series for most series and one
	 * item per point for pie series and its derivatives.
	 *
	 * @return {Array.<Series|Point>}
	 *         The current items in the legend.
	 */
	getAllItems: function () {
		var allItems = [];
		each(this.chart.series, function (series) {
			var seriesOptions = series && series.options;

			// Handle showInLegend. If the series is linked to another series,
			// defaults to false.
			if (series && pick(
				seriesOptions.showInLegend,
				!defined(seriesOptions.linkedTo) ? undefined : false, true
			)) {
				
				// Use points or series for the legend item depending on
				// legendType
				allItems = allItems.concat(
					series.legendItems ||
					(
						seriesOptions.legendType === 'point' ?
							series.data :
							series
					)
				);
			}
		});
		return allItems;
	},

	/**
	 * Get a short, three letter string reflecting the alignment and layout.
	 *
	 * @private
	 * @return {String} The alignment, empty string if floating
	 */
	getAlignment: function () {
		var options = this.options;

		// Use the first letter of each alignment option in order to detect
		// the side. (#4189 - use charAt(x) notation instead of [x] for IE7)
		return options.floating ? '' : (
			options.align.charAt(0) +
			options.verticalAlign.charAt(0) +
			options.layout.charAt(0)
		);
	},

	/**
	 * Adjust the chart margins by reserving space for the legend on only one
	 * side of the chart. If the position is set to a corner, top or bottom is
	 * reserved for horizontal legends and left or right for vertical ones.
	 *
	 * @private
	 */
	adjustMargins: function (margin, spacing) {
		var chart = this.chart,
			options = this.options,
			alignment = this.getAlignment();

		if (alignment) {

			each([
				/(lth|ct|rth)/,
				/(rtv|rm|rbv)/,
				/(rbh|cb|lbh)/,
				/(lbv|lm|ltv)/
			], function (alignments, side) {
				if (alignments.test(alignment) && !defined(margin[side])) {

					// Now we have detected on which side of the chart we should
					// reserve space for the legend
					chart[marginNames[side]] = Math.max(
						chart[marginNames[side]],
						(
							chart.legend[
								(side + 1) % 2 ? 'legendHeight' : 'legendWidth'
							] +
							[1, -1, -1, 1][side] * options[
								(side % 2) ? 'x' : 'y'
							] +
							pick(options.margin, 12) +
							spacing[side] +
							(
								side === 0 ?
									chart.titleOffset +
										chart.options.title.margin :
									0
							) // #7428
						)
					);
				}
			});
		}
	},

	/**
	 * Render the legend. This method can be called both before and after
	 * `chart.render`. If called after, it will only rearrange items instead
	 * of creating new ones. Called internally on initial render and after
	 * redraws.
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
			alignTo;

		legend.itemX = padding;
		legend.itemY = legend.initialItemY;
		legend.offsetWidth = 0;
		legend.lastItemY = 0;

		if (!legendGroup) {
			legend.group = legendGroup = renderer.g('legend')
				.attr({ zIndex: 7 })
				.add();
			legend.contentGroup = renderer.g()
				.attr({ zIndex: 1 }) // above background
				.add(legendGroup);
			legend.scrollGroup = renderer.g()
				.add(legend.contentGroup);
		}

		legend.renderTitle();

		// add each series or point
		allItems = legend.getAllItems();

		// sort by legendIndex
		stableSort(allItems, function (a, b) {
			return ((a.options && a.options.legendIndex) || 0) -
				((b.options && b.options.legendIndex) || 0);
		});

		// reversed legend
		if (options.reversed) {
			allItems.reverse();
		}

		legend.allItems = allItems;
		legend.display = display = !!allItems.length;

		// render the items
		legend.lastLineHeight = 0;
		each(allItems, function (item) {
			legend.renderItem(item);
		});

		// Get the box
		legendWidth = (options.width || legend.offsetWidth) + padding;
		legendHeight = legend.lastItemY + legend.lastLineHeight +
			legend.titleHeight;
		legendHeight = legend.handleOverflow(legendHeight);
		legendHeight += padding;

		// Draw the border and/or background
		if (!box) {
			legend.box = box = renderer.rect()
				.addClass('highcharts-legend-box')
				.attr({
					r: options.borderRadius
				})
				.add(legendGroup);
			box.isNew = true;
		} 

		/*= if (build.classic) { =*/
		// Presentational
		box
			.attr({
				stroke: options.borderColor,
				'stroke-width': options.borderWidth || 0,
				fill: options.backgroundColor || 'none'
			})
			.shadow(options.shadow);
		/*= } =*/

		if (legendWidth > 0 && legendHeight > 0) {
			box[box.isNew ? 'attr' : 'animate'](
				box.crisp.call({}, { // #7260
					x: 0,
					y: 0,
					width: legendWidth,
					height: legendHeight
				}, box.strokeWidth())
			);
			box.isNew = false;
		}

		// hide the border if no items
		box[display ? 'show' : 'hide']();

		/*= if (!build.classic) { =*/
		// Open for responsiveness
		if (legendGroup.getStyle('display') === 'none') {
			legendWidth = legendHeight = 0;
		}
		/*= } =*/

		legend.legendWidth = legendWidth;
		legend.legendHeight = legendHeight;

		// Now that the legend width and height are established, put the items
		// in the final position
		each(allItems, function (item) {
			legend.positionItem(item);
		});

		if (display) {
			// If aligning to the top and the layout is horizontal, adjust for
			// the title (#7428)
			alignTo = chart.spacingBox;
			if (/(lth|ct|rth)/.test(legend.getAlignment())) {
				alignTo = merge(alignTo, {
					y: alignTo.y + chart.titleOffset +
						chart.options.title.margin
				});
			}

			legendGroup.align(merge(options, {
				width: legendWidth,
				height: legendHeight
			}), true, alignTo);
		}

		if (!chart.isResizing) {
			this.positionCheckboxes();
		}
	},

	/**
	 * Set up the overflow handling by adding navigation with up and down arrows
	 * below the legend.
	 *
	 * @private
	 */
	handleOverflow: function (legendHeight) {
		var legend = this,
			chart = this.chart,
			renderer = chart.renderer,
			options = this.options,
			optionsY = options.y,
			alignTop = options.verticalAlign === 'top',
			padding = this.padding,
			spaceHeight = chart.spacingBox.height +
				(alignTop ? -optionsY : optionsY) - padding,
			maxHeight = options.maxHeight,
			clipHeight,
			clipRect = this.clipRect,
			navOptions = options.navigation,
			animation = pick(navOptions.animation, true),
			arrowSize = navOptions.arrowSize || 12,
			nav = this.nav,
			pages = this.pages,
			lastY,
			allItems = this.allItems,
			clipToHeight = function (height) {
				if (typeof height === 'number') {
					clipRect.attr({
						height: height
					});
				} else if (clipRect) { // Reset (#5912)
					legend.clipRect = clipRect.destroy();
					legend.contentGroup.clip();
				}

				// useHTML
				if (legend.contentGroup.div) {
					legend.contentGroup.div.style.clip = height ? 
						'rect(' + padding + 'px,9999px,' +
							(padding + height) + 'px,0)' :
						'auto';
				}
			};


		// Adjust the height
		if (
			options.layout === 'horizontal' &&
			options.verticalAlign !== 'middle' &&
			!options.floating
		) {
			spaceHeight /= 2;
		}
		if (maxHeight) {
			spaceHeight = Math.min(spaceHeight, maxHeight);
		}

		// Reset the legend height and adjust the clipping rectangle
		pages.length = 0;
		if (legendHeight > spaceHeight && navOptions.enabled !== false) {

			this.clipHeight = clipHeight =
				Math.max(spaceHeight - 20 - this.titleHeight - padding, 0);
			this.currentPage = pick(this.currentPage, 1);
			this.fullHeight = legendHeight;

			// Fill pages with Y positions so that the top of each a legend item
			// defines the scroll top for each page (#2098)
			each(allItems, function (item, i) {
				var y = item._legendItemPos[1],
					h = Math.round(item.legendItem.getBBox().height),
					len = pages.length;

				if (!len || (y - pages[len - 1] > clipHeight &&
						(lastY || y) !== pages[len - 1])) {
					pages.push(lastY || y);
					len++;
				}

				// Keep track of which page each item is on
				item.pageIx = len - 1;
				if (lastY) {
					allItems[i - 1].pageIx = len - 1;
				}

				if (i === allItems.length - 1 &&
						y + h - pages[len - 1] > clipHeight) {
					pages.push(y);
					item.pageIx = len;
				}
				if (y !== lastY) {
					lastY = y;
				}
			});

			// Only apply clipping if needed. Clipping causes blurred legend in
			// PDF export (#1787)
			if (!clipRect) {
				clipRect = legend.clipRect =
					renderer.clipRect(0, padding, 9999, 0);
				legend.contentGroup.clip(clipRect);
			}

			clipToHeight(clipHeight);

			// Add navigation elements
			if (!nav) {
				this.nav = nav = renderer.g()
					.attr({ zIndex: 1 })
					.add(this.group);

				this.up = renderer
					.symbol(
						'triangle',
						0,
						0,
						arrowSize,
						arrowSize
					)
					.on('click', function () {
						legend.scroll(-1, animation);
					})
					.add(nav);

				this.pager = renderer.text('', 15, 10)
					.addClass('highcharts-legend-navigation')
					/*= if (build.classic) { =*/
					.css(navOptions.style)
					/*= } =*/
					.add(nav);

				this.down = renderer
					.symbol(
						'triangle-down',
						0,
						0,
						arrowSize,
						arrowSize
					)
					.on('click', function () {
						legend.scroll(1, animation);
					})
					.add(nav);
			}

			// Set initial position
			legend.scroll(0);

			legendHeight = spaceHeight;

		// Reset
		} else if (nav) {
			clipToHeight();
			this.nav = nav.destroy(); // #6322
			this.scrollGroup.attr({
				translateY: 1
			});
			this.clipHeight = 0; // #1379
		}

		return legendHeight;
	},

	/**
	 * Scroll the legend by a number of pages.
	 * @param  {Number} scrollBy
	 *         The number of pages to scroll.
	 * @param  {AnimationOptions} animation
	 *         Whether and how to apply animation.
	 */
	scroll: function (scrollBy, animation) {
		var pages = this.pages,
			pageCount = pages.length,
			currentPage = this.currentPage + scrollBy,
			clipHeight = this.clipHeight,
			navOptions = this.options.navigation,
			pager = this.pager,
			padding = this.padding;

		// When resizing while looking at the last page
		if (currentPage > pageCount) {
			currentPage = pageCount;
		}

		if (currentPage > 0) {
			
			if (animation !== undefined) {
				setAnimation(animation, this.chart);
			}

			this.nav.attr({
				translateX: padding,
				translateY: clipHeight + this.padding + 7 + this.titleHeight,
				visibility: 'visible'
			});
			this.up.attr({
				'class': currentPage === 1 ?
					'highcharts-legend-nav-inactive' :
					'highcharts-legend-nav-active'
			});
			pager.attr({
				text: currentPage + '/' + pageCount
			});
			this.down.attr({
				'x': 18 + this.pager.getBBox().width, // adjust to text width
				'class': currentPage === pageCount ?
					'highcharts-legend-nav-inactive' :
					'highcharts-legend-nav-active'
			});

			/*= if (build.classic) { =*/
			this.up
				.attr({
					fill: currentPage === 1 ?
						navOptions.inactiveColor :
						navOptions.activeColor
				})
				.css({
					cursor: currentPage === 1 ? 'default' : 'pointer'
				});
			this.down
				.attr({
					fill: currentPage === pageCount ?
						navOptions.inactiveColor :
						navOptions.activeColor
				})
				.css({
					cursor: currentPage === pageCount ? 'default' : 'pointer'
				});
			/*= } =*/
			
			this.scrollOffset = -pages[currentPage - 1] + this.initialItemY;

			this.scrollGroup.animate({
				translateY: this.scrollOffset
			});

			this.currentPage = currentPage;
			this.positionCheckboxes();
		}

	}

};

/*
 * LegendSymbolMixin
 */

H.LegendSymbolMixin = {

	/**
	 * Get the series' symbol in the legend
	 *
	 * @param {Object} legend The legend object
	 * @param {Object} item The series (this) or point
	 */
	drawRectangle: function (legend, item) {
		var options = legend.options,
			symbolHeight = legend.symbolHeight,
			square = options.squareSymbol,
			symbolWidth = square ? symbolHeight : legend.symbolWidth;

		item.legendSymbol = this.chart.renderer.rect(
			square ? (legend.symbolWidth - symbolHeight) / 2 : 0,
			legend.baseline - symbolHeight + 1, // #3988
			symbolWidth,
			symbolHeight,
			pick(legend.options.symbolRadius, symbolHeight / 2)
		)
		.addClass('highcharts-point')
		.attr({
			zIndex: 3
		}).add(item.legendGroup);

	},

	/**
	 * Get the series' symbol in the legend. This method should be overridable
	 * to create custom symbols through
	 * Highcharts.seriesTypes[type].prototype.drawLegendSymbols.
	 *
	 * @param {Object} legend The legend object
	 */
	drawLineMarker: function (legend) {

		var options = this.options,
			markerOptions = options.marker,
			radius,
			legendSymbol,
			symbolWidth = legend.symbolWidth,
			symbolHeight = legend.symbolHeight,
			generalRadius = symbolHeight / 2,
			renderer = this.chart.renderer,
			legendItemGroup = this.legendGroup,
			verticalCenter = legend.baseline -
				Math.round(legend.fontMetrics.b * 0.3),
			attr = {};

		// Draw the line
		/*= if (build.classic) { =*/
		attr = {
			'stroke-width': options.lineWidth || 0
		};
		if (options.dashStyle) {
			attr.dashstyle = options.dashStyle;
		}
		/*= } =*/
		
		this.legendLine = renderer.path([
			'M',
			0,
			verticalCenter,
			'L',
			symbolWidth,
			verticalCenter
		])
		.addClass('highcharts-graph')
		.attr(attr)
		.add(legendItemGroup);
		
		// Draw the marker
		if (markerOptions && markerOptions.enabled !== false) {

			// Do not allow the marker to be larger than the symbolHeight
			radius = Math.min(
				pick(markerOptions.radius, generalRadius),
				generalRadius
			);

			// Restrict symbol markers size
			if (this.symbol.indexOf('url') === 0) {
				markerOptions = merge(markerOptions, {
					width: symbolHeight,
					height: symbolHeight
				});
				radius = 0;
			}
			
			this.legendSymbol = legendSymbol = renderer.symbol(
				this.symbol,
				(symbolWidth / 2) - radius,
				verticalCenter - radius,
				2 * radius,
				2 * radius,
				markerOptions
			)
			.addClass('highcharts-point')
			.add(legendItemGroup);
			legendSymbol.isMarker = true;
		}
	}
};

// Workaround for #2030, horizontal legend items not displaying in IE11 Preview,
// and for #2580, a similar drawing flaw in Firefox 26.
// Explore if there's a general cause for this. The problem may be related
// to nested group elements, as the legend item texts are within 4 group
// elements.
if (/Trident\/7\.0/.test(win.navigator.userAgent) || isFirefox) {
	wrap(Highcharts.Legend.prototype, 'positionItem', function (proceed, item) {
		var legend = this,
			// If chart destroyed in sync, this is undefined (#2030)
			runPositionItem = function () {
				if (item._legendItemPos) {
					proceed.call(legend, item);
				}
			};

		// Do it now, for export and to get checkbox placement
		runPositionItem();

		// Do it after to work around the core issue
		setTimeout(runPositionItem);
	});
}
