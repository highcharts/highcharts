/**
 * Horizontal legend navigation plugin.
 *
 * Keeps the legend items on a single line and pages them sideways with left
 * and right arrows beside them, instead of wrapping them onto new lines.
 * Enable it with `legend.navigation.direction` set to `'horizontal'` on a
 * horizontal legend. Set `legend.maxWidth` or `legend.width` to page within a
 * narrower box than the chart. Right-to-left legends are not supported and
 * keep the default layout.
 *
 * See https://github.com/highcharts/highcharts/issues/7513
 */
(function (H) {
    const { css, merge, relativeLength, wrap } = H,
        legendProto = H.Legend.prototype,
        symbols = H.SVGRenderer.prototype.symbols;

    // `triangle-left` is also defined by the arrow-symbols module, to the same
    // path. `triangle-right` exists nowhere yet
    symbols['triangle-left'] = (x, y, w, h) => [
        ['M', x + w, y],
        ['L', x, y + h / 2],
        ['L', x + w, y + h],
        ['Z']
    ];

    symbols['triangle-right'] = (x, y, w, h) => [
        ['M', x, y],
        ['L', x + w, y + h / 2],
        ['L', x, y + h],
        ['Z']
    ];

    function addTracker(legend, key, arrowSize) {
        const tracker = legend[key] = legend.chart.renderer
            .circle(0, 0, arrowSize * 1.3)
            .translate(arrowSize / 2, arrowSize / 2)
            .add(legend.nav);

        if (!legend.chart.styledMode) {
            tracker.attr('fill', 'rgba(0,0,0,0.0001)');
        }

        return tracker;
    }

    wrap(legendProto, 'setOptions', function (proceed, options) {
        proceed.call(this, options);

        this.horizontalNav = options.layout === 'horizontal' &&
            options.navigation.direction === 'horizontal' &&
            options.navigation.enabled !== false &&
            !options.rtl;
    });

    // Lay the items out on one line by lifting the wrapping limit, then cap
    // the legend box where they would have wrapped, so that paging kicks in
    // on the same width
    wrap(legendProto, 'layoutItem', function (proceed, item) {
        if (!this.horizontalNav) {
            return proceed.call(this, item);
        }

        const maxLegendWidth = this.maxLegendWidth;

        this.maxLegendWidth = Infinity;
        proceed.call(this, item);
        this.maxLegendWidth = maxLegendWidth;

        this.offsetWidth = Math.min(
            this.offsetWidth,
            maxLegendWidth + this.padding
        );
    });

    // Clip the single line of items to one page and put the arrows to the
    // right of them, in place of the up and down arrows below the legend
    wrap(legendProto, 'handleOverflow', function (proceed, legendHeight) {
        if (!this.horizontalNav) {
            return proceed.call(this, legendHeight);
        }

        const {
                allItems, chart, itemX, maxLegendWidth, options, padding, pages
            } = this,
            { renderer } = chart,
            { itemDistance = 20, maxWidth, navigation: navOptions } = options,
            { animation = true } = navOptions,
            arrowSize = navOptions.arrowSize || 12,
            // Room for the arrows and the pager. The page count is not known
            // yet, so reserve by the widest the pager can get - the item count
            // is an upper bound for it
            navSize = 2 * arrowSize +
                15 * (String(allItems.length).length + 1),
            // Where the items end, and the width they would have wrapped at.
            // `render` caps the box by `maxWidth` too, so cap the page with it
            fullWidth = itemX - itemDistance - padding,
            spaceWidth = Math.min(
                maxLegendWidth,
                maxWidth ?
                    relativeLength(maxWidth, chart.chartWidth) - padding :
                    Infinity
            );

        let nav = this.nav;

        pages.length = 0;

        if (spaceWidth > 0 && fullWidth > spaceWidth) {
            const clipWidth = this.clipWidth =
                Math.max(spaceWidth - navSize, 0);

            // The clip rect is full height, so nothing is cut vertically.
            // Saying as much makes the accessibility module hide the item
            // proxies by page index alone
            this.clipHeight = 9999;
            this.currentPage = this.currentPage ?? 1;

            // Pages hold whole items, keyed on the x position their leading
            // edge scrolls to
            allItems.forEach(item => {
                const legendItem = item.legendItem,
                    itemWidth = item.itemWidth - itemDistance;

                if (
                    !pages.length ||
                    legendItem.x + itemWidth - pages[pages.length - 1] >
                        clipWidth
                ) {
                    pages.push(legendItem.x);
                }
                legendItem.pageIx = pages.length - 1;
            });

            if (!this.clipRect) {
                this.clipRect = renderer.clipRect(
                    padding,
                    padding - 2,
                    clipWidth,
                    9999
                );
                this.contentGroup.clip(this.clipRect);
            }

            if (!nav) {
                nav = this.nav = renderer.g()
                    .attr({ zIndex: 1 })
                    .add(this.group);

                this.up = renderer
                    .symbol('triangle-left', 0, 0, arrowSize, arrowSize)
                    .add(nav);
                addTracker(this, 'upTracker', arrowSize)
                    .on('click', () => this.scroll(-1, animation));

                this.pager = renderer.text('', 15, 10)
                    .addClass('highcharts-legend-navigation');

                if (!chart.styledMode) {
                    // The `legend.navigation.style` default carries no color,
                    // so the pager stays black in dark mode. Core has the same
                    // problem with the vertical arrows
                    this.pager.css(merge(
                        { color: 'var(--highcharts-neutral-color-80)' },
                        navOptions.style
                    ));
                }
                this.pager.add(nav);

                this.down = renderer
                    .symbol('triangle-right', 0, 0, arrowSize, arrowSize)
                    .add(nav);
                addTracker(this, 'downTracker', arrowSize)
                    .on('click', () => this.scroll(1, animation));
            }

            this.scroll(0);

        } else if (nav) {
            this.clipRect = this.clipRect.destroy();
            this.contentGroup.clip();
            this.nav = nav.destroy();
            // The core resets to `translateY: 1` and lets the next vertical
            // scroll overwrite it. Nothing overwrites it here
            this.scrollGroup.attr({ translateX: 0 });
            this.clipHeight = this.clipWidth = 0;
        }

        return legendHeight;
    });

    // Leave the page bookkeeping, the pager, the arrow states and the
    // `afterScroll` event to the core, and redo only what pages sideways
    wrap(legendProto, 'scroll', function (proceed, scrollBy, animation) {
        if (!this.horizontalNav) {
            return proceed.call(this, scrollBy, animation);
        }

        const { clipWidth, pages, padding, scrollGroup } = this,
            page = Math.min(this.currentPage + scrollBy, pages.length);

        if (!pages.length || page < 1) {
            return;
        }

        // Swallow the core's vertical scroll of the item group
        this.scrollGroup = { animate: () => {} };
        proceed.call(this, scrollBy, animation);
        this.scrollGroup = scrollGroup;

        this.nav.attr({
            translateX: padding + clipWidth,
            // The pager text is drawn at y 10, so subtract that to line the
            // navigation up with the item labels
            translateY: this.titleHeight + this.initialItemY + this.baseline -
                10
        });

        // Clip to the page, so that no item is cut in half
        this.clipRect.attr({
            width: Math.min(
                (pages[page] ?? Infinity) - pages[page - 1],
                clipWidth
            )
        });

        this.scrollOffset = padding - pages[page - 1];
        scrollGroup.animate({ translateX: this.scrollOffset });
        this.positionCheckboxes();
    });

    wrap(legendProto, 'positionCheckboxes', function (proceed) {
        const alignAttr = this.group?.alignAttr;

        if (!this.horizontalNav || !alignAttr) {
            return proceed.call(this);
        }

        const { pages, titleHeight } = this,
            { translateX, translateY } = alignAttr,
            currentPageIx = this.currentPage - 1,
            offset = this.scrollOffset || 0;

        this.allItems.forEach(({ checkbox, checkboxOffset, legendItem }) => {
            if (checkbox) {
                css(checkbox, {
                    left: translateX + checkboxOffset + checkbox.x - 20 +
                        offset + 'px',
                    top: translateY + titleHeight + checkbox.y + 3 + 'px',
                    // Pages hold whole items, so the page index is enough
                    display: !pages.length ||
                        legendItem.pageIx === currentPageIx ? '' : 'none'
                });
            }
        });
    });
}(Highcharts));


Highcharts.chart('container', {

    title: {
        text: 'Horizontal legend navigation'
    },

    accessibility: {
        description: 'A column chart with more series than fit on one line ' +
            'of the legend. The legend items are kept on a single line and ' +
            'paged sideways with the arrows beside them.'
    },

    xAxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4']
    },

    yAxis: {
        title: {
            text: 'Revenue (MUSD)'
        }
    },

    legend: {
        verticalAlign: 'top',
        navigation: {
            direction: 'horizontal'
        }
    },

    series: [
        'Amsterdam', 'Berlin', 'Copenhagen', 'Dublin', 'Edinburgh',
        'Frankfurt', 'Gothenburg', 'Helsinki', 'Istanbul', 'Jerusalem'
    ].map((name, i) => ({
        type: 'column',
        name,
        data: [12 + i, 15 - i, 9 + i, 18 - i]
    }))

});
