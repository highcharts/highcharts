console.clear();
var logger = {
    list: [],
    add: function (obj) {
        var copy = {},
            prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                copy[prop] = obj[prop];
            }
        }
        this.list.push(copy);
        if (this.list.length >= 2) {
            this.compare();
        }
    },
    compare: function () {
        var obj1 = this.list[0],
            obj2 = this.list[1],
            prop;

        for (prop in obj2) {
            if (obj2.hasOwnProperty(prop)) {
                if (obj1.hasOwnProperty(prop)) {
                    if (obj2[prop] !== obj1[prop]) {
                        console.log(prop + ': ' + obj1[prop] + ' <-old|new-> ' + obj2[prop]);
                    }
                } else {
                    console.log(prop + ': ' + obj2[prop] + ' does not exist in old');
                }
            }
        }
        for (prop in obj1) {
            if (obj1.hasOwnProperty(prop) && !obj2.hasOwnProperty(prop)) {
                console.log(prop + ': ' + obj1[prop] + ' does not exist in new');
            }
        }
    }
};
$(function () {

    /************************************
     * Highcharts X-range series module *
     ************************************/
    (function (H) {
        var defaultPlotOptions = H.getOptions().plotOptions,
            columnType = H.seriesTypes.column,
            each = H.each,
            extendClass = H.extendClass,
            pick = H.pick,
            Point = H.Point;

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
            translate: function () {
                columnType.prototype.translate.apply(this, arguments);
                var series = this,
                    xAxis = series.xAxis,
                    metrics = series.columnMetrics,
                    minPointLength = series.options.minPointLength || 0;

                H.each(series.points, function (point) {
                    var barWidth = Math.min(
                            xAxis.translate(H.pick(point.x2, point.x + (point.len || 0))) - point.plotX,
                            xAxis.len
                        ),
                        barWidthDifference = barWidth < minPointLength ? minPointLength - barWidth : 0;

                    point.shapeArgs = {
                        x: Math.max(0, point.plotX) - barWidthDifference / 2,
                        y: point.plotY + metrics.offset,
                        width: barWidth + barWidthDifference,
                        height: metrics.width
                    };
                    point.tooltipPos[0] += barWidth / 2;
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

    /**********************************
     * Highcharts GridAxis module *
     **********************************/
    (function (H) {
        // Enum for which side the axis is on.
        // Maps to axis.side
        var axisSide = {
            top: 0,
            right: 1,
            bottom: 2,
            left: 3,
            0: "top",
            1: "right",
            2: "bottom",
            3: "left"
        };

        /**
         * Checks if an axis is the outer axis in its dimension. Since
         * axes are placed outwards in order, the axis with the highest
         * index is the outermost axis.
         *
         * Example: If there are multiple x-axes at the top of the chart,
         * this function returns true if the axis supplied is the last
         * of the x-axes.
         *
         * @return true if the axis is the outermost axis in its dimension;
         *         false if not
         */
        H.Axis.prototype.isOuterAxis = function () {
            var axis = this,
                thisIndex = -1,
                isOuter = true;

            H.each(this.chart.axes, function (otherAxis, index) {
                if (otherAxis.side === axis.side) {
                    if (otherAxis === axis) {
                        // Get the index of the axis in question
                        thisIndex = index;

                        // Check thisIndex >= 0 in case thisIndex has
                        // not been found yet
                    } else if (thisIndex >= 0 && index > thisIndex) {
                        // There was an axis on the same side with a
                        // higher index. Exit the loop.
                        isOuter = false;
                        return;
                    }
                }
            });
            // There were either no other axes on the same side,
            // or the other axes were not farther from the chart
            return isOuter;
        };

        /**
         * Shortcut function to Tick.label.getBBox().width.
         *
         * @return {number} width - the width of the tick label
         */
        H.Tick.prototype.getLabelWidth = function () {
            return this.label.getBBox().width;
        };

        /**
         * Add custom date formats
         */
        H.dateFormats = {
            // Week number
            W: function (timestamp) {
                var date = new Date(timestamp),
                    day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(),
                    dayNumber;
                date.setDate(date.getUTCDate() + 4 - day);
                dayNumber = Math.floor((date.getTime() - new Date(date.getUTCFullYear(), 0, 1, -6)) / 86400000);
                return 1 + Math.floor(dayNumber / 7);
            },
            // First letter of the day of the week, e.g. 'M' for 'Monday'.
            E: function (timestamp) {
                return Highcharts.dateFormat('%a', timestamp, true).charAt(0);
            }
        };

        /**
         * Prevents adding the last tick label if the axis type is datetime.
         *
         * Since datetime labels are normally placed at starts and ends of a
         * period of time, and this module converts labels to
         *
         * @param proceed - the original function
         */
        H.wrap(H.Tick.prototype, 'addLabel', function (proceed) {
            var axis = this.axis,
                tickPositions = axis.tickPositions;

            if (axis.options.type !== 'datetime' || this.pos !== tickPositions[tickPositions.length - 1]) {
                proceed.apply(this);
            }
        });

        /**
         * Center tick labels vertically and horizontally between ticks
         *
         * @param proceed - the original function
         *
         * @return {object} object - an object containing x and y positions
         *                         for the tick
         */
        H.wrap(H.Tick.prototype, 'getLabelPosition', function (proceed, x, y, label) {
            var returnValue = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
                axis = this.axis,
                tickInterval = axis.options.tickInterval || 1,
                newPos,
                axisHeight,
                fontSize,
                labelMetrics;

            // Only center tick labels if axis has option grid: true
            if (axis.options.grid) {
                fontSize = axis.options.labels.style.fontSize;
                labelMetrics = axis.chart.renderer.fontMetrics(fontSize, label);
                axisHeight = axis.axisGroup.getBBox().height;

                if (axis.horiz && axis.options.categories === undefined) {
                    // Center x position
                    newPos = this.pos + tickInterval / 2;
                    returnValue.x = axis.translate(newPos) + axis.left;

                    // Center y position
                    if (axis.side === axisSide.top) {
                        returnValue.y = y - (axisHeight / 2) + (labelMetrics.h / 2) - Math.abs(labelMetrics.h - labelMetrics.b);
                    } else {
                        returnValue.y = y + (axisHeight / 2) + (labelMetrics.h / 2) - Math.abs(labelMetrics.h - labelMetrics.b);
                    }
                } else {
                    // Center y position
                    if (axis.options.categories === undefined) {
                        newPos = this.pos + (tickInterval / 2);
                        returnValue.y = axis.translate(newPos) + axis.top + (labelMetrics.b / 2);
                    }

                    // Center x position
                    if (axis.side === axisSide.left) {
                        returnValue.x = returnValue.x + (this.getLabelWidth() / 2) - (axis.maxLabelLength / 2);
                    } else {
                        returnValue.x = returnValue.x - (this.getLabelWidth() / 2) + (axis.maxLabelLength / 2);
                    }
                }
            }
            return returnValue;
        });

        /**
         * Replicates category axis translation to all axis types.
         *
         * @param proceed - the original function
         */
        H.wrap(H.Axis.prototype, 'setAxisTranslation', function (proceed) {
            // Call the original setAxisTranslation() to perform all other calculations

            if (this.options.grid && !this.options.categories) {
                this.minPointOffset = 0.5;
                this.pointRangePadding = 1;

                this.translationSlope = this.transA = this.len / ((this.max - this.min + this.pointRangePadding) || 1);
                this.transB = this.horiz ? this.left : this.bottom; // translation addend
                this.minPixelPadding = this.transA * this.minPointOffset;

                // Ensure that linear axes get a minPixelPadding of 0
                if (this.options.type === 'linear') {
                    this.minPixelPadding = 0;
                }
            } else {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        });

        /**
         * Prevents rotation of labels when squished, as rotating them would not
         * help.
         *
         * @param proceed - the original function
         */
        H.wrap(H.Axis.prototype, 'renderUnsquish', function (proceed) {
            if (this.options.grid) {
                this.labelRotation = 0;
                this.options.labels.rotation = 0;
            }
            proceed.apply(this);
        });

        /**
         * Draw an extra line on the far side of the the axisLine,
         * creating cell roofs of a grid.
         *
         * @param proceed - the original function
         */
        H.wrap(H.Axis.prototype, 'render', function (proceed) {
            var labelPadding,
                distance,
                lineWidth,
                linePath,
                yStart,
                yEnd,
                xStart,
                xEnd;

            if (this.options.grid) {
                labelPadding = (Math.abs(this.defaultLeftAxisOptions.labels.x) * 2);
                distance = this.maxLabelLength + labelPadding;
                lineWidth = this.options.lineWidth;

                // Draw vertical ticks extra long to create cell walls
                if (!this.horiz) {
                    this.options.tickLength = distance;
                }

                if (this.options.id === 'thisGuy') {
                    logger.add(this);
                }

                // Call original Axis.render() to obtain this.axisLine and this.axisGroup
                proceed.apply(this);

                if (this.isOuterAxis() && this.axisLine) {
                    if (this.horiz) {
                        // -1 to avoid adding distance each time the chart updates
                        distance = this.axisGroup.getBBox().height - 1;
                    }

                    if (lineWidth) {
                        linePath = this.getLinePath(lineWidth);
                        yStart = linePath.indexOf('M') + 2;
                        yEnd = linePath.indexOf('L') + 2;
                        xStart = linePath.indexOf('M') + 1;
                        xEnd = linePath.indexOf('L') + 1;

                        // Negate distance if top or left axis
                        if (this.side === axisSide.top || this.side === axisSide.left) {
                            distance = -distance;
                        }

                        // If axis is horizontal, reposition line path vertically
                        if (this.horiz) {
                            linePath[yStart] = linePath[yStart] + distance;
                            linePath[yEnd] = linePath[yEnd] + distance;
                        } else {
                            // If axis is vertical, reposition line path horizontally
                            linePath[xStart] = linePath[xStart] + distance;
                            linePath[xEnd] = linePath[xEnd] + distance;
                        }

                        if (!this.axisLineExtra) {
                            this.axisLineExtra = this.chart.renderer.path(linePath)
                                .attr({
                                    stroke: this.options.lineColor,
                                    'stroke-width': lineWidth,
                                    zIndex: 7
                                })
                                .add(this.axisGroup);
                        } else {
                            this.axisLineExtra.animate({
                                d: linePath
                            });
                        }

                        // show or hide the line depending on options.showEmpty
                        this.axisLine[this.showAxis ? 'show' : 'hide'](true);
                    }
                }
            } else {
                proceed.apply(this);
            }
        });

        /**
         * Wraps chart rendering with the following customizations:
         * 1. Prohibit timespans of multitudes of a time unit
         * 2. Draw cell walls on vertical axes
         *
         * @param proceed - the original function
         */
        H.wrap(H.Chart.prototype, 'render', function (proceed) {
            // 25 is optimal height for default fontSize (11px)
            // 25 / 11 ≈ 2.28
            var fontSizeToCellHeightRatio = 25 / 11,
                fontMetrics,
                fontSize;

            H.each(this.axes, function (axis) {
                if (axis.options.grid) {
                    fontSize = axis.options.labels.style.fontSize;
                    fontMetrics = axis.chart.renderer.fontMetrics(fontSize);

                    // Prohibit timespans of multitudes of a time unit,
                    // e.g. two days, three weeks, etc.
                    if (axis.options.type === 'datetime') {
                        axis.options.units = [
                            ['millisecond', [1]],
                            ['second', [1]],
                            ['minute', [1]],
                            ['hour', [1]],
                            ['day', [1]],
                            ['week', [1]],
                            ['month', [1]],
                            ['year', null]
                        ];
                    }

                    // Make tick marks taller, creating cell walls of a grid.
                    // Use cellHeight axis option if set
                    axis.options.tickLength = axis.options.cellHeight || fontMetrics.h * fontSizeToCellHeightRatio;
                    if (!axis.horiz) {
                        axis.options.tickWidth = 1;
                        if (!axis.options.lineWidth) {
                            axis.options.lineWidth = 1;
                        }
                    }
                }
            });

            // Call original Chart.render()
            proceed.apply(this);
        });

    }(Highcharts));


    // THE CHART
    $('#container').highcharts({
        chart: {
            type: 'xrange',
            marginLeft: 150,
            marginRight: 150
        },
        title: {
            text: 'Highcharts GridAxis'
        },
        xAxis: [{
            grid: true,
            type: 'datetime',
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}'
            },
            min: Date.UTC(2014, 10, 17),
            max: Date.UTC(2014, 10, 30)
        }, {
            grid: true,
            categories: ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'],
            min: 0,
            max: 12
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1.5em'
                }
            },
            linkedTo: 0
        }, {
            grid: true,
            type: 'datetime',
            opposite: true,
            tickInterval: 1000 * 60 * 60 * 24 * 7, // Week
            labels: {
                format: '{value:Week %W}',
                style: {
                    fontSize: '1.5em'
                }
            },
            linkedTo: 0
        }, {
            grid: true,
            tickInterval: 1,
            min: 0
        }],
        yAxis: [{
            title: '',
            categories: ['Prototyping', 'Development', 'Testing'],
            reversed: true,
            opposite: true,
            grid: true
        }, {
            title: '',
            id: 'thisGuy',
            grid: true,
            reversed: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '2em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }, {
            title: '',
            grid: true,
            reversed: true,
            tickInterval: 1000 * 60 * 60 * 24, // Day
            type: 'datetime',
            labels: {
                format: '{value:%E}',
                style: {
                    fontSize: '1em'
                }
            },
            min: Date.UTC(2014, 10, 18),
            max: Date.UTC(2014, 10, 21)
        }],
        series: [{
            name: 'Project 1',
            borderRadius: 10,
            xAxis: 0,
            data: [{
                x: Date.UTC(2014, 10, 18),
                x2: Date.UTC(2014, 10, 25),
                y: 0
            }, {
                x: Date.UTC(2014, 10, 20),
                x2: Date.UTC(2014, 10, 25),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 26),
                x2: Date.UTC(2014, 10, 28),
                y: 0
            }, {
                x: Date.UTC(2014, 10, 23),
                x2: Date.UTC(2014, 10, 26),
                y: 2
            }]
        }, {
            name: 'Project 2',
            borderRadius: 10,
            visible: false,
            xAxis: 0,
            data: [{
                x: Date.UTC(2014, 10, 24),
                x2: Date.UTC(2014, 10, 27),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 27),
                x2: Date.UTC(2014, 10, 28),
                y: 2
            }, {
                x: Date.UTC(2014, 10, 27),
                x2: Date.UTC(2014, 10, 28),
                y: 1
            }, {
                x: Date.UTC(2014, 10, 18),
                x2: Date.UTC(2014, 10, 19),
                y: 2
            }]
        }, {
            name: 'Project 3',
            borderRadius: 10,
            xAxis: 1,
            yAxis: 2,
            data: [{
                x: 7,
                x2: 9,
                y: Date.UTC(2014, 10, 19)
            }, {
                x: 7,
                x2: 12,
                y: Date.UTC(2014, 10, 20)
            }, {
                x: 12,
                x2: 13,
                y: Date.UTC(2014, 10, 21)
            }]
        }, {
            name: 'Project 4',
            borderRadius: 10,
            xAxis: 4,
            data: [{
                x: 1,
                x2: 2,
                y: 1
            }, {
                x: 3,
                x2: 4,
                y: 2
            }]
        }]
    });
});
