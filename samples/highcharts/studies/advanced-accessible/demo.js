$(function () {

    // Plugin for increasing chart accessibility
    (function (H) {
        H.Chart.prototype.callbacks.push(function (chart) {
            var options = chart.options,
                acsOptions = options.accessibility || {},
                series = chart.series,
                numSeries = series.length,
                numXAxes = chart.xAxis.length,
                numYAxes = chart.yAxis.length,
                titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
                descElement = chart.container.getElementsByTagName('desc')[0],
                textElements = chart.container.getElementsByTagName('text'),
                titleId = 'highcharts-title-' + chart.index,
                descId = 'highcharts-desc-' + chart.index,
                ariaTable,
                tableHeaders,
                chartDesc,
                chartTypes = [],
                chartType,
                typeStartsWithVowel,
                i;

            if (!acsOptions.enabled) {
                return;
            }

            // Hide text elements from screen readers
            for (i = 0; i < textElements.length; ++i) {
                textElements[i].setAttribute('aria-hidden', 'true');
            }

            // Make chart type string
            for (i = 0; i < numSeries; ++i) {
                if (chartTypes.indexOf(series[i].type) < 0) {
                    chartTypes.push(series[i].type);
                }
            }
            chartType = chartTypes[0];
            for (i = 1; i < chartTypes.length - 1; ++i) {
                chartType += ', ' + chartTypes[i];
            }
            if (chartTypes.length > 1) {
                chartType += ' and ' + chartTypes[chartTypes.length - 1] + ' combination';
            }
            typeStartsWithVowel = !chartType || 'aeiouy'.indexOf(chartType.charAt(0)) > -1;

            // Build chart description
            chartDesc = (typeStartsWithVowel ? 'An ' : 'A ') + chartType + ' chart.' +
                        (options.title.text ? ' Title: ' + options.title.text + '.' : '') +
                        (options.subtitle.text ? ' ' + options.subtitle.text + '.' : '');
            chartDesc += acsOptions.description ? ' ' + acsOptions.description : '';
            if (chartDesc.slice(-1) !== '.') {
                chartDesc += '.';
            }

            // Add series info
            if (numSeries) {
                chartDesc += ' The chart displays ' + numSeries + ' series, containing ';
                if (numSeries < 2) {
                    chartDesc += series[0].points.length + ' data point' + (series[0].points.length === 1 ? '.' : 's.');
                } else {
                    for (i = 0; i < numSeries - 1; ++i) {
                        chartDesc += (i > 0 ? ', ' : '') + series[i].points.length;
                    }
                    chartDesc += ' and ' + series[numSeries - 1].points.length + ' data points respectively.';
                }
            } else {
                chartDesc += ' The chart is empty.';
            }

            // Add axis info
            if (numXAxes) {
                chartDesc += ' The chart has ' + numXAxes + (numXAxes > 1 ? ' X-axes' : ' X-axis') + ' displaying ';
                if (numXAxes < 2) {
                    chartDesc += '"' + (chart.xAxis[0].options.title && chart.xAxis[0].options.title.text) + '".';
                } else {
                    for (i = 0; i < numXAxes - 1; ++i) {
                        chartDesc += (i > 0 ? ', "' : '"') + (chart.xAxis[i].options.title &&
                                chart.xAxis[i].options.title.text) + '"';
                    }
                    chartDesc += ' and "' + (chart.xAxis[numXAxes - 1].options.title && chart.xAxis[numXAxes - 1].options.title.text) +
                                '" respectively.';
                }
            }
            if (numYAxes) {
                chartDesc += ' The chart has ' + numYAxes + (numYAxes > 1 ? ' Y-axes' : ' Y-axis') + ' displaying ';
                if (numYAxes < 2) {
                    chartDesc += '"' + (chart.yAxis[0].options.title && chart.yAxis[0].options.title.text) + '".';
                } else {
                    for (i = 0; i < numYAxes - 1; ++i) {
                        chartDesc += (i > 0 ? ', "' : '"') + (chart.yAxis[i].options.title &&
                                chart.yAxis[i].options.title.text) + '"';
                    }
                    chartDesc += ' and "' + (chart.yAxis[numYAxes - 1].options.title && chart.yAxis[numYAxes - 1].options.title.text) +
                                '" respectively.';
                }
            }

            // Add SVG title/desc tags
            titleElement.innerHTML = options.title.text || 'Chart';
            titleElement.id = titleId;
            descElement.innerHTML += '. ' + chartDesc;
            descElement.id = descId;
            descElement.parentNode.insertBefore(titleElement, descElement);
            chart.renderTo.setAttribute('role', 'region');
            chart.renderTo.setAttribute('aria-labelledby', titleId + ' ' + descId);
            chart.renderTo.setAttribute('aria-label', chartDesc);

            // Return string with information about point
            function buildPointInfoString(point) {
                var infoKeys = [
                        ['Name', 'name', '"'], // 3rd element determines whether value should be in quotation marks
                        ['ID', 'id', '"'],
                        ['Category', 'category', '"'],
                        ['X value', 'x'],
                        ['Y value', 'y'],
                        ['Z value', 'z'],
                        ['Value', 'value', '"'],
                        ['Open', 'open'],
                        ['High', 'high'],
                        ['Median', 'median'],
                        ['Low', 'low'],
                        ['Close', 'close'],
                        ['Q1', 'q1'],
                        ['Q3', 'q3']
                    ],
                    infoString = '';

                H.each(infoKeys, function (keyArray) {
                    var quote = keyArray[2] || '',
                        value = point[keyArray[1]];
                    infoString += value !== undefined ? '. ' + keyArray[0] + ' = ' + quote + value + quote : '';
                });
                /*return 'Point ' + (point.index + 1) + ' of ' + point.series.points.length + ', series ' +
                        (point.series.index + 1) + ' of ' + point.series.chart.series.length + infoString;*/

                return (point.index + 1) + ' of ' + point.series.points.length + infoString;
            }

            function buildSeriesInfoString(dataSeries) {
                return 'Series ' + (dataSeries.index + 1) + ' of ' + (dataSeries.chart.series.length) + '.';
            }

            function reverseChildNodes(node) {
                var i = node.childNodes.length;
                while (i--) {
                    node.appendChild(node.childNodes[i]);
                }
            }

            // Put info on series and points of a series
            function setSeriesInfo(dataSeries) {
                var firstPointEl = dataSeries.points && dataSeries.points[0].graphic && dataSeries.points[0].graphic.element,
                    seriesEl = firstPointEl && firstPointEl.parentNode;
                if (seriesEl) {
                    seriesEl.setAttribute('role', 'region');
                    seriesEl.setAttribute('tabindex', '-1');
                    seriesEl.setAttribute('aria-label', buildSeriesInfoString(dataSeries));
                    // For some series types the order of elements do not match the order of points in series
                    if (seriesEl.lastChild === firstPointEl) {
                        reverseChildNodes(seriesEl);
                    }
                }
                H.each(dataSeries.points, function (point) {
                    // Set aria label on point
                    if (point.graphic) {
                        point.graphic.element.setAttribute('role', 'img');
                        point.graphic.element.setAttribute('tabindex', '-1');
                        point.graphic.element.setAttribute('aria-label', buildPointInfoString(point));
                    }
                });
            }
            H.each(series, setSeriesInfo);

            H.wrap(H.Series.prototype, 'drawPoints', function (proceed) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                setSeriesInfo(this);
            });


            /* Add keyboard navigation */

            if (acsOptions.keyboardNavigation && acsOptions.keyboardNavigation.enabled === false) {
                return;
            }

            // Function for highlighting a point
            H.Point.prototype.highlight = function () {
                var point = this,
                    chart = point.series.chart;
                if (point.graphic && point.graphic.element.focus) {
                    point.graphic.element.focus();
                }
                if (!point.isNull) {
                    point.onMouseOver(); // Show the hover marker
                    chart.tooltip.refresh(point); // Show the tooltip
                } else {
                    chart.tooltip.hide(0);
                    // Don't call blur on the element, as it messes up the chart div's focus
                }
                chart.highlightedPoint = point;
            };

            // Function to show the export menu and focus the first item (if exists)
            H.Chart.prototype.showExportMenu = function () {
                var exportList;
                this.exportSVGElements[0].element.onclick();
                exportList = chart.exportDivElements;
                if (exportList) {
                    // Set tabindex on the menu items to allow focusing by script
                    // Set role to give screen readers a chance to pick up the contents
                    for (var i = 0; i < exportList.length; ++i) {
                        if (exportList[i].tagName === 'DIV' &&
                            !(exportList[i].children && exportList[i].children.length)) {
                            exportList[i].setAttribute('role', 'menuitem');
                            exportList[i].setAttribute('tabindex', -1);
                        }
                    }
                    // Set screen reader properties on menu parent div
                    exportList[0].parentNode.setAttribute('role', 'menu');
                    exportList[0].parentNode.setAttribute('aria-label', 'Chart export');
                    // Focus first menu item
                    if (exportList[0].focus) {
                        exportList[0].focus();
                    }
                    exportList[0].onmouseover();
                    this.highlightedExportItem = 0; // Keep reference to focused item index
                }
            };

            // Function to highlight next/previous point in chart
            // Returns true on success, false on failure (no adjacent point to highlight in chosen direction)
            H.Chart.prototype.highlightAdjacentPoint = function (next) {
                var series = this.series,
                    curPoint = this.highlightedPoint,
                    newSeries,
                    newPoint;

                // If no points, return false
                if (!series[0] || !series[0].points) {
                    return false;
                }

                // Use first point if none already highlighted
                if (!curPoint) {
                    series[0].points[0].highlight();
                    return true;
                }

                newSeries = series[curPoint.series.index + (next ? 1 : -1)];
                newPoint = next ?
                    // Try to grab next point
                    curPoint.series.points[curPoint.index + 1] || newSeries && newSeries.points[0] :
                    // Try to grab previous point
                    curPoint.series.points[curPoint.index - 1] ||
                        newSeries && newSeries.points[newSeries.points.length - 1];

                // If there is no adjacent point, we return false
                if (newPoint === undefined) {
                    return false;
                }

                // Recursively skip null points
                if (newPoint.isNull && this.options.accessibility.keyboardNavigation &&
                        this.options.accessibility.keyboardNavigation.skipNullPoints) {
                    this.highlightedPoint = newPoint;
                    return this.highlightAdjacentPoint(next);
                }

                // There is an adjacent point, highlight it
                newPoint.highlight();
                return true;
            };

            H.addEvent(chart.renderTo, 'keydown', function (ev) {
                var e = ev || window.event,
                    keyCode = e.which || e.keyCode,
                    highlightedExportItem = chart.highlightedExportItem,
                    newSeries,
                    fakeEvent,
                    doExporting = chart.options.exporting && chart.options.exporting.enabled !== false,
                    exportList,
                    reachedEnd,
                    i;

                function highlightExportItem(i) {
                    if (exportList[i] && exportList[i].tagName === 'DIV' &&
                            !(exportList[i].children && exportList[i].children.length)) {
                        if (exportList[i].focus) {
                            exportList[i].focus();
                        }
                        exportList[highlightedExportItem].onmouseout();
                        exportList[i].onmouseover();
                        chart.highlightedExportItem = i;
                        return true;
                    }
                }

                function hideExporting() {
                    for (var a = 0; a < exportList.length; ++a) {
                        H.fireEvent(exportList[a], 'mouseleave');
                    }
                    exportList[highlightedExportItem].onmouseout();
                    chart.highlightedExportItem = 0;
                    chart.renderTo.focus();
                    chart.isExporting = false;
                }

                // Tab = right, Shift+Tab = left
                if (keyCode === 9) {
                    keyCode = e.shiftKey ? 37 : 39;
                }

                if (!chart.isExporting) {
                    switch (keyCode) {
                    case 37: // Left
                    case 39: // Right
                        if (!chart.highlightAdjacentPoint(keyCode === 39)) {
                            if (keyCode === 39 && doExporting) {
                                // Start export menu navigation
                                chart.highlightedPoint = null;
                                chart.isExporting = true;
                                chart.showExportMenu();
                            } else {
                                // Try to return as if user tabbed or shift+tabbed
                                // Some browsers won't allow mutation of event object, but try anyway
                                e.which = e.keyCode = 9;
                                return;
                            }
                        }
                        break;

                    case 38: // Up
                    case 40: // Down
                        if (chart.highlightedPoint) {
                            newSeries = series[chart.highlightedPoint.series.index + (keyCode === 38 ? -1 : 1)];
                            if (newSeries && newSeries.points[0]) {
                                newSeries.points[0].highlight();
                            } else if (keyCode === 40 && doExporting) {
                                // Start export menu navigation
                                chart.highlightedPoint = null;
                                chart.isExporting = true;
                                chart.showExportMenu();
                            }
                        }
                        break;

                    case 13: // Enter
                    case 32: // Spacebar
                        if (chart.highlightedPoint) {
                            chart.highlightedPoint.firePointEvent('click');
                        }
                        break;

                    default: return;
                    }
                } else {
                    // Keyboard nav for exporting menu
                    exportList = chart.exportDivElements;
                    switch (keyCode) {
                    case 37: // Left
                    case 38: // Up
                        i = highlightedExportItem = highlightedExportItem || 0;
                        reachedEnd = true;
                        while (i--) {
                            if (highlightExportItem(i)) {
                                reachedEnd = false;
                                break;
                            }
                        }
                        if (reachedEnd) {
                            hideExporting();
                            // Wrap to last point
                            if (series && series.length) {
                                newSeries = series[series.length - 1];
                                if (newSeries.points.length) {
                                    newSeries.points[newSeries.points.length - 1].highlight();
                                }
                            }
                        }
                        break;

                    case 39: // Right
                    case 40: // Down
                        highlightedExportItem = highlightedExportItem || 0;
                        reachedEnd = true;
                        for (var ix = highlightedExportItem + 1; ix < exportList.length; ++ix) {
                            if (highlightExportItem(ix)) {
                                reachedEnd = false;
                                break;
                            }
                        }
                        if (reachedEnd) {
                            hideExporting();
                            // Try to return as if user tabbed
                            // Some browsers won't allow mutation of event object, but try anyway
                            e.which = e.keyCode = 9;
                            e.shiftKey = false;
                            return;
                        }
                        break;

                    case 13: // Enter
                    case 32: // Spacebar
                        if (highlightedExportItem !== undefined) {
                            fakeEvent = document.createEvent('Events');
                            fakeEvent.initEvent('click', true, false);
                            exportList[highlightedExportItem].onclick(fakeEvent);
                        }
                        break;

                    default: return;
                    }
                }
                e.preventDefault();
            });
        });
    }(Highcharts));


    // Set up demo charts

    $('#container').highcharts({
        chart: {
            type: 'area'
        },

        accessibility: {
            enabled: true,
            description: 'Chart displays arbitrary values throughout the year, with a clear drop during the winter months.',
            keyboardNavigation: {
                skipNullPoints: true
            }
        },

        title: {
            text: 'Accessible Highcharts'
        },

        subtitle: {
            text: 'A hidden but machine readable HTML table contains this chart\'s data'
        },

        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        }, {}, { title: { text: 'This is a test' } }],

        plotOptions: {
            series: {
                point: {
                    events: {
                        click: function () {
                            alert('Clicked point with value ' + this.y);
                        }
                    }
                }
            }
        },

        series: [{
            data: [29.9, 110, 43, 0]
        }, //*
        {
            data: [29.9, 71.5, null, 106.4, 129.2, null, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'column'
        }, //*/
        //*
        {
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'pie'
        }//*/
        ]
    });

});
