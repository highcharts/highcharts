$(function () {

    // Plugin for increasing chart accessibility
    (function (H) {
        H.Chart.prototype.callbacks.push(function (chart) {
            var options = chart.options,
                series = chart.series,
                numSeries = series.length,
                numXAxes = chart.xAxis.length,
                numYAxes = chart.yAxis.length,
                div = document.createElement('div'),
                tableSummary = document.createElement('caption'),
                titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title'),
                descElement = chart.container.getElementsByTagName('desc')[0],
                textElements = chart.container.getElementsByTagName('text'),
                titleId = 'highcharts-title-' + chart.index,
                descId = 'highcharts-desc-' + chart.index,
                tooltipInfo = document.createElement('div'),
                tooltipInfoId = 'highcharts-tooltip-info-' + chart.index,
                ariaTable,
                tableHeaders,
                chartDesc,
                chartTypes = [],
                chartType,
                typeStartsWithVowel,
                i;

            if (options.accessibility && options.accessibility.enabled === false) {
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
            chartDesc = (typeStartsWithVowel ? 'An ' : 'A ') + chartType + ' chart.'
                        + (options.title.text ? ' Title: ' + options.title.text + '.' : '')
                        + (options.subtitle.text ? ' ' + options.subtitle.text + '.' : '');
            chartDesc += options.accessibility.description ? ' ' + options.accessibility.description : '';
            if (chartDesc.slice(-1) !== '.') {
                chartDesc += '.';
            }

            // Add axis info
            if (numXAxes) {
                chartDesc += ' The chart has ' + numXAxes + (numXAxes > 1 ? ' X-axes' : ' X-axis') + ' displaying ';
                if (numXAxes < 2) {
                    chartDesc += '"' + (chart.xAxis[0].options.title && chart.xAxis[0].options.title.text) + '".';
                } else {
                    for (i = 0; i < numXAxes - 1; ++i) {
                        chartDesc += (i > 0 ? ', "' : '"') + (chart.xAxis[i].options.title
                                && chart.xAxis[i].options.title.text) + '"';
                    }
                    chartDesc += ' and "' + (chart.xAxis[numXAxes - 1].options.title && chart.xAxis[numXAxes - 1].options.title.text)
                                + '" respectively.';
                }
            }
            if (numYAxes) {
                chartDesc += ' The chart has ' + numYAxes + (numYAxes > 1 ? ' Y-axes' : ' Y-axis') + ' displaying ';
                if (numYAxes < 2) {
                    chartDesc += '"' + (chart.yAxis[0].options.title && chart.yAxis[0].options.title.text) + '".';
                } else {
                    for (i = 0; i < numYAxes - 1; ++i) {
                        chartDesc += (i > 0 ? ', "' : '"') + (chart.yAxis[i].options.title
                                && chart.yAxis[i].options.title.text) + '"';
                    }
                    chartDesc += ' and "' + (chart.yAxis[numYAxes - 1].options.title && chart.yAxis[numYAxes - 1].options.title.text)
                                + '" respectively.';
                }
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

            // Add SVG title/desc tags
            titleElement.innerHTML = options.title.text || 'Chart';
            titleElement.id = titleId;
            descElement.innerHTML += '. ' + chartDesc;
            descElement.id = descId;
            descElement.parentNode.insertBefore(titleElement, descElement);

            // Create table
            div.innerHTML = chart.getTable();
            ariaTable = div.getElementsByTagName('table')[0];
            tableHeaders = ariaTable.getElementsByTagName('th');
            chart.container.parentNode.appendChild(div);
            tableSummary.innerHTML = chartDesc;
            if (ariaTable.firstChild) {
                ariaTable.insertBefore(tableSummary, ariaTable.firstChild);
            } else {
                ariaTable.appendChild(tableSummary);
            }

            // Add tooltip info div
            tooltipInfo.id = chart.tooltipInfoDiv = tooltipInfoId;
            tooltipInfo.role = 'region';
            tooltipInfo['aria-live'] = 'assertive';
            div.insertBefore(tooltipInfo, ariaTable);

    /*
            // Hide table and tooltip info
            div.style.position = 'absolute';
            div.style.left = '-9999em';
            div.style.width = '1px';
            div.style.height = '1px';
            div.style.overflow = 'hidden';
    //*/

            // Set accessibility attributes
            chart.renderTo.setAttribute('aria-labelledby', titleId + ' ' + descId);
            ariaTable.setAttribute('aria-label', 'A tabular view of the chart "' + titleElement.innerHTML + '"');
            for (i = 0; i < tableHeaders.length; ++i) {
                tableHeaders[i].setAttribute('scope', 'col');
            }

            /* Add keyboard navigation */

            if (options.accessibility && options.accessibility.keyboardNavigation === false) {
                return;
            }

            // Function for highlighting a point. Returns highlighted point
            H.Point.prototype.highlight = function () {
                var point = this,
                    tooltipKeys = [
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
                    tooltipString = '';
                H.each(tooltipKeys, function (keyArray) {
                    var value = point[keyArray[1]],
                        quote = keyArray[2] || '';
                    tooltipString += value !== undefined ? '. ' + keyArray[0] + ': ' + quote + value + quote : '';
                });
                document.getElementById(point.series.chart.tooltipInfoDiv).innerHTML = '"' +
                    (point.series.name || point.series.index + 1) + '", type: ' + point.series.type +
                    '. Data point ' + (point.index + 1) + tooltipString; // Update tooltip info div
                point.onMouseOver(); // Show the hover marker
                point.series.chart.tooltip.refresh(point); // Show the tooltip
            };

            // Keep track of which point is highlighted
            H.wrap(H.Point.prototype, 'onMouseOver', function (proceed) {
                this.series.chart.highlightedPoint = this;
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
            });

            // Function to show the export menu and focus the first item (if exists)
            H.Chart.prototype.showExportMenu = function () {
                var exportList, ix;
                this.exportSVGElements[0].element.onclick();
                exportList = chart.exportDivElements;
                if (exportList) {
                    // Set tabindex on the menu items to allow focusing by script
                    for (ix = 0; ix < exportList.length; ++ix) {
                        exportList[i].setAttribute('tabindex', -1);
                    }
                    exportList[0].focus();
                    exportList[0].onmouseover();
                    this.highlightedExportItem = 0; // Keep reference to focused item index
                }
            };

            // Function to highlight next/previous point in chart, optionally wrapping around to first point.
            // Returns true on success, false on failure (no adjacent point to highlight in chosen direction)
            H.Chart.prototype.highlightAdjacentPoint = function (next, wrap) {
                var curSeries = this.series,
                    curPoint = this.highlightedPoint,
                    newSeries,
                    newPoint;

                // If no points, return false
                if (!curSeries[0] || !curSeries[0].points) {
                    return false;
                }

                // Use first point if none already highlighted
                if (!curPoint) {
                    curSeries[0].points[0].highlight();
                    return true;
                }

                newSeries = curSeries[curPoint.series.index + (next ? 1 : -1)];
                newPoint = next ?
                    // Try to grab next point
                    curPoint.series.points[curPoint.index + 1] || newSeries && newSeries.points[0] :
                    // Try to grab previous point
                    curPoint.series.points[curPoint.index - 1] ||
                        newSeries && newSeries.points[newSeries.points.length - 1];

                // If there is no adjacent point, we either wrap to first/last point in chart, or return false
                if (!newPoint) {
                    if (!wrap) {
                        return false;
                    }
                    newPoint = next ? curSeries[0].points[0] :
                        curSeries[curSeries.length - 1].points[curSeries[curSeries.length - 1].points.length - 1];
                }

                // There is an adjacent point, highlight it
                newPoint.highlight();
                return true;
            };

            H.addEvent(chart.renderTo, 'keydown', function (ev) {
                var e = ev || window.event,
                    shift = e.shiftKey,
                    highlightedExportItem = chart.highlightedExportItem,
                    wrap = true,
                    newSeries,
                    fakeEvent,
                    doExporting = chart.options.exporting && chart.options.exporting.enabled !== false,
                    exportList,
                    reachedEnd,
                    ix;

                // Tab = right, Shift+Tab = left
                if (e.which === 9) {
                    e.which = shift ? 37 : 39;
                    wrap = false;
                }

                if (!chart.isExporting) {
                    switch (e.which) {
                    case 37: // Left
                    case 39: // Right
                        if (!chart.highlightAdjacentPoint(e.which === 39, !doExporting && wrap)) {
                            if (doExporting && wrap) {
                                // Start export menu navigation
                                chart.isExporting = true;
                                chart.showExportMenu();
                            } else {
                                // Return as if user tabbed or shift+tabbed
                                e.which = e.keyCode = 9;
                                shift = e.which === 37;
                                return;
                            }
                        }
                        break;

                    case 38: // Up
                    case 40: // Down
                        if (chart.highlightedPoint) {
                            newSeries = series[chart.highlightedPoint.series.index + (e.which === 38 ? 1 : -1)];
                            if (newSeries && newSeries.points[0]) {
                                newSeries.points[0].highlight();
                            } else if (doExporting) {
                                // Start export menu navigation
                                chart.isExporting = true;
                                chart.showExportMenu();
                            }
                        }
                        break;

                    case 13: // Enter
                        if (chart.highlightedPoint) {
                            chart.highlightedPoint.firePointEvent('click');
                        }
                        break;

                    default: return;
                    }
                } else {
                    // Keyboard nav for exporting menu
                    switch (e.which) {
                    case 37: // Left
                    case 38: // Up
                        exportList = chart.exportDivElements;
                        ix = highlightedExportItem = highlightedExportItem || 0;
                        reachedEnd = true;
                        while (ix--) {
                            if (exportList[ix] && exportList[ix].tagName === 'DIV'
                                    && !(exportList[ix].children && exportList[ix].children.length)) {
                                exportList[ix].focus();
                                exportList[chart.highlightedExportItem].onmouseout();
                                exportList[ix].onmouseover();
                                chart.highlightedExportItem = ix;
                                reachedEnd = false;
                                break;
                            }
                        }
                        if (reachedEnd) {
                            chart.isExporting = false;
                            /*for (var i = 0; i < chart.exportDivElements.length; ++i) {
                                HighchartsAdapter.fireEvent(chart.exportDivElements[i], 'mouseleave');
                            }*/
                            HighchartsAdapter.fireEvent(document, 'mouseup');
                            exportList[chart.highlightedExportItem].onmouseout();
                            chart.highlightedExportItem = 0;
                            chart.renderTo.focus();
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
                        exportList = chart.exportDivElements;
                        highlightedExportItem = highlightedExportItem || 0;
                        reachedEnd = true;
                        for (ix = highlightedExportItem + 1; ix < exportList.length; ++ix) {
                            if (exportList[ix] && exportList[ix].tagName === 'DIV'
                                    && !(exportList[ix].children && exportList[ix].children.length)) {
                                exportList[ix].focus();
                                exportList[chart.highlightedExportItem].onmouseout();
                                exportList[ix].onmouseover();
                                chart.highlightedExportItem = ix;
                                reachedEnd = false;
                                break;
                            }
                        }
                        if (reachedEnd) {
                            chart.isExporting = false;
                            for (ix = 0; ix < chart.exportDivElements.length; ++ix) {
                                HighchartsAdapter.fireEvent(chart.exportDivElements[ix], 'mouseleave');
                            }
                            exportList[chart.highlightedExportItem].onmouseout();
                            chart.highlightedExportItem = 0;
                            chart.renderTo.focus();
                            if (!wrap) {
                                // Return as if user tabbed
                                e.which = e.keyCode = 9;
                                shift = false;
                                return;
                            }
                            series[0].points[0].highlight(); // Otherwise highlight first point to wrap
                        }
                        break;

                    case 13: // Enter
                        if (highlightedExportItem !== undefined) {
                            fakeEvent = document.createEvent('Events');
                            fakeEvent.initEvent('click', true, false);
                            chart.exportDivElements[highlightedExportItem].onclick(fakeEvent);
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
            description: 'Chart displays arbitrary values throughout the year, with a clear drop during the winter months.' // Content description for screen readers
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
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
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
