$(function () {

    /**
     * Highcharts X-range series plugin
     */
    (function (H) {
        var defaultPlotOptions = H.getOptions().plotOptions,
            columnType = H.seriesTypes.column,
            each = H.each,
            extendClass = H.extendClass,
            pick = H.pick,
            Point = H.Point,
            Series = H.Series;

        defaultPlotOptions.xrange = H.merge(defaultPlotOptions.column, {
            tooltip: {
                pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
            }
        });
        H.seriesTypes.xrange = H.extendClass(columnType, {
            pointClass: extendClass(Point, {
                // Add x2 and yCategory to the available properties for tooltip formats
                getLabelConfig: function () {
                    var cfg = Point.prototype.getLabelConfig.call(this);

                    cfg.x2 = this.x2;
                    cfg.yCategory = this.yCategory = this.series.yAxis.categories && this.series.yAxis.categories[this.y];
                    return cfg;
                }
            }),
            type: 'xrange',
            forceDL: true,
            parallelArrays: ['x', 'x2', 'y'],
            requireSorting: false,
            animate: H.seriesTypes.line.prototype.animate,

            /**
             * Borrow the column series metrics, but with swapped axes. This gives free access
             * to features like groupPadding, grouping, pointWidth etc.
             */
            getColumnMetrics: function () {
                var metrics,
                    chart = this.chart;

                function swapAxes() {
                    each(chart.series, function (s) {
                        var xAxis = s.xAxis;
                        s.xAxis = s.yAxis;
                        s.yAxis = xAxis;
                    });
                }

                swapAxes();

                this.yAxis.closestPointRange = 1;
                metrics = columnType.prototype.getColumnMetrics.call(this);

                swapAxes();

                return metrics;
            },

            /**
             * Override cropData to show a point where x is outside visible range
             * but x2 is outside.
             */
            cropData: function (xData, yData, min, max) {

                // Replace xData with x2Data to find the appropriate cropStart
                var crop = Series.prototype.cropData.call(this, this.x2Data, yData, min, max);

                // Re-insert the cropped xData
                crop.xData = xData.slice(crop.start, crop.end);

                return crop;
            },

            translate: function () {
                columnType.prototype.translate.apply(this, arguments);
                var series = this,
                    xAxis = series.xAxis,
                    metrics = series.columnMetrics,
                    minPointLength = series.options.minPointLength || 0;

                H.each(series.points, function (point) {
                    var plotX = point.plotX,
                        plotX2 = xAxis.toPixels(H.pick(point.x2, point.x + (point.len || 0)), true),
                        width = plotX2 - plotX,
                        widthDifference;

                    if (minPointLength) {
                        widthDifference = width < minPointLength ? minPointLength - width : 0;
                        plotX -= widthDifference / 2;
                        plotX2 += widthDifference / 2;
                    }

                    plotX = Math.max(plotX, -10);
                    plotX2 = Math.min(Math.max(plotX2, -10), xAxis.len + 10);

                    point.shapeArgs = {
                        x: plotX,
                        y: point.plotY + metrics.offset,
                        width: plotX2 - plotX,
                        height: metrics.width
                    };
                    point.tooltipPos[0] += width / 2;
                    point.tooltipPos[1] -= metrics.width / 2;
                });
            }
        });

        /**
         * Max x2 should be considered in xAxis extremes
         */
        H.wrap(H.Axis.prototype, 'getSeriesExtremes', function (proceed) {
            var axis = this,
                dataMax,
                modMax;

            proceed.call(this);
            if (this.isXAxis) {
                dataMax = pick(axis.dataMax, Number.MIN_VALUE);
                each(this.series, function (series) {
                    each(series.x2Data || [], function (val) {
                        if (val > dataMax) {
                            dataMax = val;
                            modMax = true;
                        }
                    });
                });
                if (modMax) {
                    axis.dataMax = dataMax;
                }
            }
        });
    }(Highcharts));


    // THE CHART
    Highcharts.chart('container', {
        chart: {
            type: 'xrange'
        },
        title: {
            text: 'Highcharts X-range study'
        },
        xAxis: {
            type: 'datetime',
            min: Date.UTC(2014, 11, 3)
        },
        yAxis: {
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true
        },
        series: [{
            name: 'Project 1',
            // pointPadding: 0,
            // groupPadding: 0,
            borderRadius: 5,
            pointWidth: 10,
            data: [{
                x: Date.UTC(2014, 11, 1),
                x2: Date.UTC(2014, 11, 2),
                y: 0
            }, {
                x: Date.UTC(2014, 11, 2),
                x2: Date.UTC(2014, 11, 5),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 8),
                x2: Date.UTC(2014, 11, 9),
                y: 2
            }, {
                x: Date.UTC(2014, 11, 9),
                x2: Date.UTC(2014, 11, 19),
                y: 1
            }, {
                x: Date.UTC(2014, 11, 10),
                x2: Date.UTC(2014, 11, 23),
                y: 2
            }]
        }]

    });
});