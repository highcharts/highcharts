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
                tableId = 'highcharts-data-table-' + chart.index,
                oldColumnHeaderFormatter = options.exporting && options.exporting.csv && options.exporting.csv.columnHeaderFormatter,
                topLevelColumns = [],
                chartTitle = options.title.text || 'Chart',
                chartDesc,
                chartTypes = [],
                i;

            if (!acsOptions.enabled) {
                return;
            }

            // Get label for axis (x or y)
            function getAxisLabel(axis) {
                return axis.userOptions && axis.userOptions.description || axis.axisTitle && axis.axisTitle.textStr ||
                        axis.options.id || axis.categories && 'categories' || 'Undeclared';
            }

            // Hide text elements from screen readers
            for (i = 0; i < textElements.length; ++i) {
                textElements[i].setAttribute('aria-hidden', 'true');
            }

            // Enumerate chart types
            for (i = 0; i < numSeries; ++i) {
                if (chartTypes.indexOf(series[i].type) < 0) {
                    chartTypes.push(series[i].type);
                }
            }

            // Build chart description
            chartDesc = (chartTypes.length === 1 && acsOptions.typeDescription !== null ?
                            (acsOptions.typeDescription || chartTypes[0]) + ' chart. ' : '') +
                        (acsOptions.description ? acsOptions.description : '');
            chartDesc += (chartDesc.slice(-1) !== '.' ? '.' : '') +
                        (!numSeries ? ' The chart is empty.' : '');

            // Add axis info - but not for pies
            if (numXAxes && !(chartTypes.length === 1 && chartTypes[0] === 'pie')) {
                chartDesc += ' The chart has ' + numXAxes + (numXAxes > 1 ? ' X axes' : ' X axis') + ' displaying ';
                if (numXAxes < 2) {
                    chartDesc += getAxisLabel(chart.xAxis[0]) + '.';
                } else {
                    for (i = 0; i < numXAxes - 1; ++i) {
                        chartDesc += (i > 0 ? ', ' : '') + getAxisLabel(chart.xAxis[i]);
                    }
                    chartDesc += ' and ' + getAxisLabel(chart.xAxis[numXAxes - 1]) + '.';
                }
            }

            if (numYAxes && !(chartTypes.length === 1 && chartTypes[0] === 'pie')) {
                chartDesc += ' The chart has ' + numYAxes + (numYAxes > 1 ? ' Y axes' : ' Y axis') + ' displaying ';
                if (numYAxes < 2) {
                    chartDesc += getAxisLabel(chart.yAxis[0]) + '.';
                } else {
                    for (i = 0; i < numYAxes - 1; ++i) {
                        chartDesc += (i > 0 ? ', ' : '') + getAxisLabel(chart.yAxis[i]);
                    }
                    chartDesc += ' and ' + getAxisLabel(chart.yAxis[numYAxes - 1]) + '.';
                }
            }

            // Add SVG title/desc tags
            titleElement.textContent = chartTitle;
            titleElement.id = titleId;
            descElement.textContent = chartDesc + ' ' + descElement.textContent;
            descElement.id = descId;
            descElement.parentNode.insertBefore(titleElement, descElement);
            chart.renderTo.setAttribute('role', 'region');
            chart.renderTo.setAttribute('aria-describedby', descId);
            chart.renderTo.setAttribute('aria-label', chartTitle);

            // Return string with information about point
            function buildPointInfoString(point) {
                var commonKeys = ['name', 'id', 'category', 'x', 'value', 'y'],
                    specialKeys = ['z', 'open', 'high', 'q3', 'median', 'q1', 'low', 'close'],
                    infoString,
                    hasSpecialKey = false;

                for (var i = 0; i < specialKeys.length; ++i) {
                    if (point[specialKeys[i]] !== undefined) {
                        hasSpecialKey = true;
                        break;
                    }
                }

                // If the point has one of the less common properties defined, display all that are defined
                if (hasSpecialKey) {
                    H.each(commonKeys.concat(specialKeys), function (key) {
                        var value = point[key];
                        if (value !== undefined) {
                            infoString += '. ' + key + ', ' + value;
                        }
                    });
                } else {
                    // Pick and choose properties for a succint label
                    infoString = (point.name || point.category || point.id || 'x, ' + point.x) + ', ' +
                        (point.value !== undefined ? point.value : point.y);
                }

                return (point.index + 1) + '. ' + infoString + (point.description ? '. ' + point.description : '');
            }

            // Return string with information about series
            function buildSeriesInfoString(dataSeries) {
                return (dataSeries.name ? dataSeries.name + ', ' : '') +
                     'series ' + (dataSeries.index + 1) + ' of ' + (dataSeries.chart.series.length) + '. ' +
                    (chartTypes.length > 1 && dataSeries.type ? dataSeries.type + ' series with ' : '') +
                    (dataSeries.points.length + ' points. ') +
                    (dataSeries.description ? dataSeries.description : '') +
                    (numYAxes > 1 && dataSeries.yAxis ? 'Y axis = ' + getAxisLabel(dataSeries.yAxis) : '') +
                    (numXAxes > 1 && dataSeries.xAxis ? 'X axis = ' + getAxisLabel(dataSeries.xAxis) : '');
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
                        point.graphic.element.setAttribute('aria-label', acsOptions.pointInfoFormatter && acsOptions.pointInfoFormatter(point) ||
                            buildPointInfoString(point));
                    }
                });
            }
            H.each(series, setSeriesInfo);

            H.wrap(H.Series.prototype, 'drawPoints', function (proceed) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                setSeriesInfo(this);
            });

            /* Wrap table functionality */

            // Keep track of columns
            options.exporting = H.merge(options.exporting, {
                csv: {
                    columnHeaderFormatter: function (series, key, keyLength) {
                        var prevCol = topLevelColumns[topLevelColumns.length - 1];
                        if (keyLength > 1) {
                            // Populate a list of columns to add in addition to the ones added by the export-csv module
                            // Objects don't preserve order, so use array
                            if ((prevCol && prevCol.text) !== series.name) {
                                topLevelColumns.push({
                                    text: series.name,
                                    span: keyLength
                                });
                            }
                        }
                        if (oldColumnHeaderFormatter) {
                            return oldColumnHeaderFormatter.call(this, series, key, keyLength);
                        }
                        return keyLength > 1 ? key : series.name;
                    }
                }
            });

            // Add ID and title/caption to table HTML
            H.wrap(H.Chart.prototype, 'getTable', function (proceed) {
                return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
                    .replace('<table>', '<table id="' + tableId + '" summary="Table representation of chart. ' +
                        (acsOptions.description ? acsOptions.description : '') + '"><caption>' + chartTitle + '</caption>');
            });

            // Add accessibility attributes and top level columns
            H.wrap(H.Chart.prototype, 'viewData', function (proceed) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                var table = document.getElementById(tableId),
                    body = table.getElementsByTagName('tbody')[0],
                    firstRow = body.firstChild.children,
                    columnHeaderRow = '<tr><th scope="col" aria-hidden="true"></th>',
                    cell,
                    newCell,
                    i;

                // Create row headers
                for (i = 0; i < body.children.length; ++i) {
                    cell = body.children[i].firstChild;
                    newCell = document.createElement('th');
                    newCell.setAttribute('scope', 'row');
                    newCell.innerHTML = cell.innerHTML;
                    cell.parentNode.replaceChild(newCell, cell);
                }

                // Set scope for column headers
                for (i = 0; i < firstRow.length; ++i) {
                    if (firstRow[i].tagName === 'TH') {
                        firstRow[i].setAttribute('scope', 'col');
                    }
                }

                // Add top level columns
                for (i = 0; i < topLevelColumns.length; ++i) {
                    columnHeaderRow += '<th scope="col" colspan="' + topLevelColumns[i].span + '">' +
                         topLevelColumns[i].text + '</th>';
                }
                body.insertAdjacentHTML('afterbegin', columnHeaderRow);
            });


            /* Add keyboard navigation */

            if (acsOptions.keyboardNavigation && acsOptions.keyboardNavigation.enabled === false) {
                return;
            }

            // Make chart reachable by tab
            chart.renderTo.setAttribute('tabindex', '0');

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
        accessibility: {
            enabled: true,
            description: 'Chart displays arbitrary values throughout the year, with a clear drop during the winter months.',
            keyboardNavigation: {
                skipNullPoints: true
            },
            pointInfoFormatter: function (point) {
                return point.category + ', low ' + point.low + ', average ' + point.median + ', high ' + point.high;
            }
        },
        chart: {
            type: 'boxplot'
        },
        title: {
            text: 'Daily company fruit consumption 2015'
        },
        xAxis: [{
            description: 'Months of the year',
            categories: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }],
        yAxis: {
            title: {
                text: 'Fruits consumed'
            },
            min: 0
        },
        plotOptions: {
            series: {
                keys: ['low', 'median', 'high']
            }
        },
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}:<br/>Low: <b>{point.low}</b><br/>Avg: <b>{point.median}</b><br/>High: <b>{point.high}</b><br/>'
        },
        series: [{
            name: 'Plums',
            data: [
             [0, 8, 19],
             [1, 11, 23],
             [3, 16, 28],
             [2, 15, 28],
             [1, 15, 27],
             [0, 9, 21],
             [1, 6, 15],
             [2, 5, 12],
             [1, 6, 19],
             [2, 8, 21],
             [2, 9, 22],
             [1, 11, 19]
            ]
        }, {
            name: 'Bananas',
            data: [
             [0, 3, 6],
             [1, 2, 4],
             [0, 2, 5],
             [2, 2, 5],
             [1, 3, 6],
             [0, 1, 3],
             [1, 1, 2],
             [0, 1, 3],
             [1, 1, 3],
             [0, 2, 4],
             [1, 2, 5],
             [1, 3, 5]
            ]
        }, {
            name: 'Apples',
            data: [
             [1, 4, 6],
             [2, 4, 5],
             [1, 3, 6],
             [2, 3, 6],
             [1, 3, 4],
             [0, 2, 4],
             [0, 1, 2],
             [0, 1, 2],
             [0, 1, 2],
             [0, 2, 4],
             [1, 2, 4],
             [1, 3, 4]
            ]
        }]
    });
});
