$(function () {

    // Plugin for increasing chart accessibility
    (function (H) {
        H.Chart.prototype.callbacks.push(function (chart) {
            var options = chart.options,
                series = chart.series,
                numSeries = series.length,
                numXAxes = chart.xAxis.length,
                numYAxes = chart.yAxis.length,
           //     div = document.createElement('div'),
                tableSummary = document.createElement('caption'),
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
            chartDesc = (typeStartsWithVowel ? 'An ' : 'A ') + chartType + ' chart.' +
                        (options.title.text ? ' Title: ' + options.title.text + '.' : '') +
                        (options.subtitle.text ? ' ' + options.subtitle.text + '.' : '');
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
            /*
            titleElement.innerHTML = options.title.text || 'Chart';
            titleElement.id = titleId;
            descElement.innerHTML += '. ' + chartDesc;
            descElement.id = descId;
            descElement.parentNode.insertBefore(titleElement, descElement);*/
           // chart.renderTo.setAttribute('aria-labelledby', titleId + ' ' + descId);
            chart.renderTo.setAttribute('role', 'region');
            chart.renderTo.setAttribute('aria-label', chartDesc);

/*
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
            ariaTable.setAttribute('aria-label', 'A tabular view of the chart "' + titleElement.innerHTML + '"');
            for (i = 0; i < tableHeaders.length; ++i) {
                tableHeaders[i].setAttribute('scope', 'col');
            }
*/

    /*
            // Hide table and tooltip info
            // Consider using Highcharts.css()???
            div.style.position = 'absolute';
            div.style.left = '-9999em';
            div.style.width = '1px';
            div.style.height = '1px';
            div.style.overflow = 'hidden';
    //*/

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
                return 'Point ' + (point.index + 1) + ' of ' + point.series.points.length + ', series ' +
                        (point.series.index + 1) + ' of ' + point.series.chart.series.length + infoString;
            }

            // Put info on points of a series
            function setPointInfo(dataSeries) {
                H.each(dataSeries.points, function (point) {

                // Wrap point element in <a> tag
/*                    var origEl = point.graphic.element,
                        parent = origEl.parentNode,
                        linkEl = document.createElement('a');

                    linkEl.setAttribute('tabindex', '-1');
                    linkEl.setAttribute('aria-label', buildPointInfoString(point));
                    linkEl.appendChild(origEl.cloneNode(true));

                    parent.insertBefore(linkEl, origEl);
                    parent.removeChild(origEl);
*/

/*
                    // Add descriptive child element
                    //var infoEl = document.createElement('desc');
                    //var infoEl = document.createElement('title');
                    var infoEl = document.createElement('text');
                    infoEl.innerHTML = 'Info: ' + buildPointInfoString(point);
                    point.graphic.element.appendChild(infoEl);
                    // TODO: Add aria-describedby/aria-labelledby='id' to point graphic & SVG root (or container??). NB: aria-describedby might not be widely supported
//*/

                    // Set aria label on point
                    point.graphic.element.setAttribute('role', 'img');
                    point.graphic.element.setAttribute('tabindex', '-1');
                    point.graphic.element.setAttribute('aria-label', buildPointInfoString(point));

                });
            }
            H.each(series, setPointInfo);

            H.wrap(H.Series.prototype, 'drawPoints', function (proceed) {
                proceed.apply(this, Array.prototype.slice.call(arguments, 1));
                setPointInfo(this);
            });


            /* Add keyboard navigation */

            if (options.accessibility && options.accessibility.keyboardNavigation === false) {
                return;
            }

            // Function for highlighting a point
            H.Point.prototype.highlight = function () {
                var point = this;
                point.graphic.element.focus();
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
                var exportList;
                this.exportSVGElements[0].element.onclick();
                exportList = chart.exportDivElements;
                if (exportList) {
                    // Set tabindex on the menu items to allow focusing by script
                    for (var i = 0; i < exportList.length; ++i) {
                        exportList[i].setAttribute("tabindex", -1);
                    }
                    exportList[0].focus();
                    exportList[0].onmouseover();
                    this.highlightedExportItem = 0; // Keep reference to focused item index
                }
            };

            // Function to highlight next/previous point in chart, optionally wrapping around to first point.
            // Returns true on success, false on failure (no adjacent point to highlight in chosen direction)
            H.Chart.prototype.highlightAdjacentPoint = function (next, wrap) {
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

                // If there is no adjacent point, we either wrap to first/last point in chart, or return false
                if (!newPoint) {
                    if (!wrap) {
                        return false;
                    }
                    newPoint = next ? series[0].points[0] :
                        series[series.length - 1].points[series[series.length - 1].points.length - 1];
                }

                // There is an adjacent point, highlight it
                newPoint.highlight();
                return true;
            };

            H.addEvent(chart.renderTo, 'keydown', function (ev) {
                var e = ev || window.event,
                    keyCode = e.which,
                    highlightedExportItem = chart.highlightedExportItem,
                    wrap = true,
                    newSeries,
                    fakeEvent,
                    doExporting = chart.options.exporting && chart.options.exporting.enabled !== false,
                    exportList,
                    reachedEnd,
                    i;

                // Tab = right, Shift+Tab = left
                if (keyCode === 9) {
                    keyCode = e.shiftKey ? 37 : 39;
                    wrap = false; // Don't wrap on tab, only on arrow keys
                }

                if (!chart.isExporting) {
                    switch (keyCode) {
                    case 37: // Left
                    case 39: // Right
                        if (!chart.highlightAdjacentPoint(keyCode === 39, !doExporting && wrap)) {
                            if (doExporting && wrap) {
                                // Start export menu navigation
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
                            newSeries = series[chart.highlightedPoint.series.index + (keyCode === 38 ? 1 : -1)];
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
                    switch (keyCode) {
                    case 37: // Left
                    case 38: // Up
                        exportList = chart.exportDivElements;
                        i = highlightedExportItem = highlightedExportItem || 0;
                        reachedEnd = true;
                        while (i--) {
                            if (exportList[i] && exportList[i].tagName === 'DIV' &&
                                    !(exportList[i].children && exportList[i].children.length)) {
                                exportList[i].focus();
                                exportList[chart.highlightedExportItem].onmouseout();
                                exportList[i].onmouseover();
                                chart.highlightedExportItem = i;
                                reachedEnd = false;
                                break;
                            }
                        }
                        if (reachedEnd) {
                            chart.isExporting = false;
                            H.fireEvent(document, 'mouseup');
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
                        for (var ix = highlightedExportItem + 1; ix < exportList.length; ++ix) {
                            if (exportList[ix] && exportList[ix].tagName === 'DIV' &&
                                    !(exportList[ix].children && exportList[ix].children.length)) {
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
                            for (var a = 0; a < chart.exportDivElements.length; ++a) {
                                H.fireEvent(chart.exportDivElements[a], 'mouseleave');
                            }
                            exportList[chart.highlightedExportItem].onmouseout();
                            chart.highlightedExportItem = 0;
                            chart.renderTo.focus();
                            if (!wrap) {
                                // Try to return as if user tabbed
                                // Some browsers won't allow mutation of event object, but try anyway
                                e.which = e.keyCode = 9;
                                e.shiftKey = false;
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
