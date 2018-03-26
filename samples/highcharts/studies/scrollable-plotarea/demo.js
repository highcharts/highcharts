
/**
 * Highcharts plugin to make the Y axis stay fixed when scrolling the chart
 * horizontally on mobile devices. Supports left and right side axes.
 */
(function (H) {
    var Chart = H.Chart,
        each = H.each;

    H.wrap(H.Chart.prototype, 'setChartSize', function (proceed, skipAxes) {

        var chart = this,
            scrollablePlotArea = this.options.chart.scrollablePlotArea,
            scrollableMinWidth =
                scrollablePlotArea && scrollablePlotArea.minWidth,
            scrollablePixels;

        proceed.call(this, skipAxes);

        if (scrollableMinWidth) {

            // The amount of pixels to scroll, the difference between chart
            // width and scrollable width
            this.scrollablePixels = scrollablePixels = Math.max(
                0,
                scrollableMinWidth - this.chartWidth
            );

            if (scrollablePixels) {
                this.plotWidth += scrollablePixels;
                this.clipBox.width += scrollablePixels;

                if (!skipAxes) {
                    each(this.axes, function (axis) {
                        if (axis.side === 1) {
                            // Get the plot lines right in getPlotLinePath,
                            // temporarily set it to the adjusted plot width.
                            axis.getPlotLinePath = function () {
                                var right = this.right,
                                    path;
                                this.right = right - chart.scrollablePixels;
                                path = H.Axis.prototype.getPlotLinePath.apply(
                                    this,
                                    arguments
                                );
                                this.right = right;
                                return path;
                            };

                        } else {
                            // Apply the corrected plotWidth
                            axis.setAxisSize();
                            axis.setAxisTranslation();
                        }
                    });
                }
            }
        }
    });

    H.addEvent(Chart.prototype, 'render', function () {
        if (this.scrollablePixels) {
            if (this.setUpScrolling) {
                this.setUpScrolling();
            }
            this.applyFixed();

        } else if (this.fixedDiv) { // Has been in scrollable mode
            this.applyFixed();
        }
    });

    Chart.prototype.setUpScrolling = function () {

        // Add the necessary divs to provide scrolling
        this.scrollingContainer = H.createElement('div', {
            'className': 'highcharts-scrolling'
        }, {
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch'
        }, this.renderTo);

        this.innerContainer = H.createElement('div', {
            'className': 'highcharts-inner-container'
        }, null, this.scrollingContainer);

        // Now move the container inside
        this.innerContainer.appendChild(this.container);

        // Don't run again
        this.setUpScrolling = null;
    };

    Chart.prototype.applyFixed = function () {
        var container = this.container,
            fixedRenderer,
            scrollableWidth;

        // First render
        if (!this.fixedDiv) {

            this.fixedDiv = H.createElement(
                'div',
                {
                    className: 'highcharts-fixed'
                },
                {
                    position: 'absolute',
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    zIndex: 2
                },
                null,
                true
            );
            this.renderTo.insertBefore(
                this.fixedDiv,
                this.renderTo.firstChild
            );

            this.fixedRenderer = fixedRenderer = new H.Renderer(
                this.fixedDiv,
                0,
                0
            );

            // Mask
            this.scrollableMask = fixedRenderer.path()
                .attr({
                    fill: Highcharts.color(
                        this.options.chart.backgroundColor || '#fff'
                    ).setOpacity(0.85).get(),
                    zIndex: -1
                })
                .addClass('highcharts-scrollable-mask')
                .add();

            H.each([
                this.inverted ?
                    '.highcharts-xaxis' :
                    '.highcharts-yaxis',
                this.inverted ?
                    '.highcharts-xaxis-labels' :
                    '.highcharts-yaxis-labels',
                '.highcharts-credits',
                '.highcharts-legend',
                '.highcharts-subtitle',
                '.highcharts-title'
            ], function (className) {
                H.each(container.querySelectorAll(className), function (elem) {
                    fixedRenderer.box.appendChild(elem);
                    elem.style.pointerEvents = 'auto';
                });
            });
        }

        this.fixedRenderer.setSize(
            this.chartWidth,
            this.chartHeight
        );

        scrollableWidth = this.chartWidth + this.scrollablePixels;
        this.container.style.width = scrollableWidth + 'px';
        this.renderer.boxWrapper.attr({
            width: scrollableWidth,
            height: this.chartHeight,
            viewBox: [0, 0, scrollableWidth, this.chartHeight].join(' ')
        });

        // Set scroll position
        var options = this.options.chart.scrollablePlotArea;
        if (options.scrollPositionX) {
            this.scrollingContainer.scrollLeft =
                this.scrollablePixels * options.scrollPositionX;
        }

        // Mask behind the left and right side
        var axisOffset = this.axisOffset,
            maskTop = this.plotTop - axisOffset[0] - 1,
            maskBottom = this.plotTop + this.plotHeight + axisOffset[2],
            maskPlotRight = this.plotLeft + this.plotWidth -
                this.scrollablePixels;

        this.scrollableMask.attr({
            d: this.scrollablePixels ? [
                // Left side
                'M', 0, maskTop,
                'L', this.plotLeft - 1, maskTop,
                'L', this.plotLeft - 1, maskBottom,
                'L', 0, maskBottom,
                'Z',

                // Right side
                'M', maskPlotRight, maskTop,
                'L', this.chartWidth, maskTop,
                'L', this.chartWidth, maskBottom,
                'L', maskPlotRight, maskBottom,
                'Z'
            ] : ['M', 0, 0]
        });
    };
}(Highcharts));

Highcharts.chart('container', {
    chart: {
        type: 'spline',
        scrollablePlotArea: {
            minWidth: 700,
            scrollPositionX: 1
        }
    },
    title: {
        text: 'Scrollable plot area'
    },
    subtitle: {
        text: 'Open on mobile and scroll sideways'
    },
    xAxis: {
        type: 'datetime',
        labels: {
            overflow: 'justify'
        }
    },
    yAxis: {
        tickWidth: 1,
        title: {
            text: 'Wind speed (m/s)'
        },
        lineWidth: 1,
        opposite: true
    },
    tooltip: {
        valueSuffix: ' m/s'
    },

    plotOptions: {
        spline: {
            lineWidth: 4,
            states: {
                hover: {
                    lineWidth: 5
                }
            },
            marker: {
                enabled: false
            },
            pointInterval: 3600000, // one hour
            pointStart: Date.UTC(2015, 4, 31, 0, 0, 0)
        }
    },
    series: [{
        name: 'Hestavollane',
        data: [0.2, 0.8, 0.8, 0.8, 1, 1.3, 1.5, 2.9, 1.9, 2.6, 1.6, 3, 4, 3.6, 5.5, 6.2, 5.5, 4.5, 4, 3.1, 2.7, 4, 2.7, 2.3, 2.3, 4.1, 7.7, 7.1, 5.6, 6.1, 5.8, 8.6, 7.2, 9, 10.9, 11.5, 11.6, 11.1, 12, 12.3, 10.7, 9.4, 9.8, 9.6, 9.8, 9.5, 8.5, 7.4, 7.6]

    }, {
        name: 'Vik',
        data: [0, 0, 0.6, 0.9, 0.8, 0.2, 0, 0, 0, 0.1, 0.6, 0.7, 0.8, 0.6, 0.2, 0, 0.1, 0.3, 0.3, 0, 0.1, 0, 0, 0, 0.2, 0.1, 0, 0.3, 0, 0.1, 0.2, 0.1, 0.3, 0.3, 0, 3.1, 3.1, 2.5, 1.5, 1.9, 2.1, 1, 2.3, 1.9, 1.2, 0.7, 1.3, 0.4, 0.3]
    }]
});