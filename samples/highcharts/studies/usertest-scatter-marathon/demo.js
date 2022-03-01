/* eslint-disable max-len */

let focusResetElement = null;

function getSeriesDataMetrics(series) {
    let xMin = Infinity;
    let xMax = -Infinity;
    let i = series.xData.length;
    while (i--) {
        const x = series.xData[i];
        xMin = x < xMin ? x : xMin;
        xMax = x > xMax ? x : xMax;
    }
    return {
        xMin,
        xMax
    };
}

function getXBinSize(seriesMetrics, detail) {
    const dataMin = seriesMetrics.xMin;
    const dataMax = seriesMetrics.xMax;
    const range = dataMax - dataMin;
    return range / detail;
}

function getTrendDataForSeries(series, xBinSize, seriesMetrics) {
    const xBins = [];
    if (series.points.length < 2) {
        return [];
    }

    const xBinStart = seriesMetrics.xMin;
    const xBinMaxIx = Math.ceil((seriesMetrics.xMax - xBinStart) / xBinSize - 1);

    series.points.forEach(point => {
        const pointBinIx = Math.min(xBinMaxIx, Math.floor((point.x - xBinStart) / xBinSize));
        xBins[pointBinIx] = xBins[pointBinIx] || [];
        xBins[pointBinIx].push(point.y);
    });

    const data = [];
    const avg = arr => arr.reduce((acc, cur) => acc + cur, 0) / arr.length;
    xBins.forEach((binContent, ix) => {
        data.push([
            xBinStart + ix * xBinSize + xBinSize / 2,
            avg(binContent)
        ]);
    });

    return data;
}

function buildDescTreeFromData(data, chartExtremes, xAxis, yAxis) {
    const xValueDecimals = chartExtremes.xMax - chartExtremes.xMin > 10 ? 0 : 1;
    const yValueDecimals = chartExtremes.dataMax - chartExtremes.dataMin > 10 ? 0 : 1;
    let min = Infinity;
    let max = -Infinity;
    let i = data.length;
    while (i--) {
        min = Math.min(min, data[i][1]);
        max = Math.max(max, data[i][1]);
    }

    let minCount = 0;
    let maxCount = 0;
    data.forEach(values => {
        if (values[1] === min) {
            ++minCount;
        }
        if (values[1] === max) {
            ++maxCount;
        }
    });

    const descItems = [];
    data.forEach((values, ix) => {
        const nextValues = data[ix + 1];
        const yVal = values[1];
        const nextYVal = nextValues && nextValues[1];
        const descItem = {};
        const xValRounded = Math.round((values[0] + Number.EPSILON) * Math.pow(1, xValueDecimals)) / Math.pow(1, xValueDecimals);
        const yValRounded = Math.round((values[1] + Number.EPSILON) * Math.pow(1, yValueDecimals)) / Math.pow(1, yValueDecimals);
        const dateFormat = (val, axis) => (axis.options.type === 'datetime' ? Highcharts.dateFormat('%H:%M:%S', val) : val);

        descItem.x = dateFormat(xValRounded, xAxis);
        descItem.y = dateFormat(yValRounded, yAxis);

        if (ix === 0) {
            descItem.isStart = true;
            descItem.x = chartExtremes.xMin;
        } else if (!nextValues) {
            descItem.isEnd = true;
            descItem.x = chartExtremes.xMax;
        }

        if (yVal === min) {
            descItem.isLowest = true;
            if (minCount > 1) {
                descItem.hasMultipleLowest = true;
            }
        }

        if (yVal === max) {
            descItem.isHighest = true;
            if (maxCount > 1) {
                descItem.hasMultipleHighest = true;
            }
        }

        if (nextYVal !== undefined) {
            const totalDiff = chartExtremes.dataMax - chartExtremes.dataMin;
            const diffToNext = nextYVal - yVal;
            const absDiff = Math.abs(diffToNext);
            const neutralThreshold = totalDiff / data.length;

            if (absDiff < neutralThreshold / 25) {
                descItem.trend = 0;
            } else {
                const up = diffToNext > 0;
                if (absDiff > neutralThreshold / 0.8) {
                    descItem.trend = up ? 3 : -3;
                } else if (absDiff < neutralThreshold / 5) {
                    descItem.trend = up ? 1 : -1;
                } else {
                    descItem.trend = up ? 2 : -2;
                }
            }
        }

        descItems.push(descItem);
    });

    return descItems;
}

function compressDescTree(descItems) {
    const compressed = [];

    descItems.forEach((desc, ix) => {
        if (desc.isEnd) {
            compressed.push(desc);
        } else {
            const prev = descItems[ix - 1];
            if (!prev || desc.trend !== prev.trend) {
                compressed.push(desc);
            }
        }
    });

    return compressed;
}

function describeSeriesTrend(series, descItems) {
    let desc;
    const getAxisName = axis =>
        axis.options.accessibility && axis.options.accessibility.description ||
        axis.options.title && axis.options.title.text ||
        (axis.coll === 'xAxis' ? 'x axis value' : 'y axis value');

    const xAxisName = getAxisName(series.xAxis);
    const yAxisName = getAxisName(series.yAxis);

    let orderDenomination;
    switch (series.index) {
    case 0:
        orderDenomination = 'first';
        break;
    case 1:
        orderDenomination = 'second';
        break;
    default:
        orderDenomination = 'next';
        break;
    }

    desc = `<p>The ${orderDenomination} data series is showing ${series.name}, with ${series.points.length} data points.</p><ul role="list">`;

    descItems.forEach((point, ix) => {
        if (point.isEnd) {
            return;
        }

        desc += '<li>';
        const nextPoint = descItems[ix + 1];
        const nextX = nextPoint && nextPoint.x;

        if (point.isStart) {
            desc += `It starts at ${xAxisName} ${point.x}`;
            if (point.isHighest || point.isLowest) {
                desc += `, where it is ${point.isHighest ? 'highest' : 'lowest'} on average`;
            }
            desc += `, with ${yAxisName} averaging around ${point.y}.`;
            desc += '</li><li>';
        }

        desc += ix % 2 === 0 ? 'From there ' : 'Then ';

        const trend = point.trend;
        if (trend === 0) {
            desc += ` it stays flat until around ${xAxisName} ${nextX}`;
        } else {
            let trendModifier;
            const absTrend = Math.abs(trend);
            if (absTrend === 1) {
                trendModifier = ' slightly';
            } else if (absTrend === 2) {
                trendModifier = '';
            } else if (absTrend === 3) {
                trendModifier = ' sharply';
            }
            desc += ` it goes ${trend > 0 ? 'up' : 'down'}${trendModifier} until around ${xAxisName} ${nextX}`;
        }

        if (nextPoint && nextPoint.isEnd) {
            desc += ', where it ends';
        }

        if (nextPoint && (nextPoint.isHighest || nextPoint.isLowest)) {
            desc += nextPoint.isEnd ? ', and is ' : ', where it is ';
            desc += `${nextPoint.isHighest ? 'highest' : 'lowest'} on average, with ${yAxisName} averaging around ${nextPoint.y}`;
        } else if (nextPoint.isEnd) {
            desc += `, with ${yAxisName} averaging around ${nextPoint.y}`;
        }

        desc += '.';
        desc += '</li>';
    });

    desc += '</ul>';

    return desc;
}

function getSeriesStats(series) {
    const getAxisName = axis =>
        axis.options.accessibility && axis.options.accessibility.description ||
        axis.options.title && axis.options.title.text ||
        (axis.coll === 'xAxis' ? 'x axis value' : 'y axis value');
    const dateFormat = (val, axis) => (axis.options.type === 'datetime' ? Highcharts.dateFormat('%H:%M:%S', val) : val);
    let min = Infinity;
    let max = -Infinity;
    let curMin;
    let curMax;

    series.points.forEach(p => {
        if (p.y < min) {
            min = p.y;
            curMin = p;
        } else if (p.y > max) {
            max = p.y;
            curMax = p;
        }
    });

    const yMinDesc = dateFormat(min, series.yAxis);
    const yMaxDesc = dateFormat(max, series.yAxis);

    return `<p>Overall, the minimum ${getAxisName(series.yAxis)} for ${series.name} is ${yMinDesc}, at ${getAxisName(series.xAxis)} ${curMin.x}. ` +
        `The maximum is ${yMaxDesc}, at ${getAxisName(series.xAxis)} ${curMax.x}.</p>`;
}


function updateTrends(chart, detail) {
    let computerDesc = '<p>Computer generated description:</p>';
    chart.series.forEach(series => {
        const seriesMetrics = getSeriesDataMetrics(series);
        const xBinSize = getXBinSize(seriesMetrics, detail);
        const data = getTrendDataForSeries(series, xBinSize, seriesMetrics);
        const descItems = buildDescTreeFromData(data, {
            dataMin: chart.yAxis[0].dataMin,
            dataMax: chart.yAxis[0].dataMax,
            xMin: seriesMetrics.xMin,
            xMax: seriesMetrics.xMax
        }, series.xAxis, series.yAxis);
        const trendDesc = describeSeriesTrend(series, compressDescTree(descItems));
        const statsDesc = getSeriesStats(series);

        chart.addSeries({
            data,
            color: '#222',
            type: 'spline',
            xBinSize,
            name: 'Trend line for ' + series.name,
            accessibility: {
                exposeAsGroupOnly: true
            }
        });

        computerDesc += trendDesc + statsDesc;
    });
    chart.redraw();

    setTimeout(() => {
        const beforeRegion = chart.accessibility.components.infoRegions.screenReaderSections.before.element;
        const div = document.createElement('div');
        div.setAttribute('aria-hidden', false);
        div.classList.add('sr-only');
        div.innerHTML = computerDesc;
        beforeRegion.parentNode.insertBefore(div, beforeRegion.nextSibling);
    }, 10);
}

function announce(text) {
    const liveReg = document.getElementById('announce');
    liveReg.textContent = text;
    setTimeout(() => (liveReg.textContent = ''), 4000);
}

function sonifyChart(chart, seriesIx) {
    focusResetElement = document.activeElement;
    const series = chart.series[seriesIx];

    announce('Playing ' + series.name);

    series.update({
        accessibility: {
            enabled: false
        }
    });

    setTimeout(function () {
        series.sonify({
            onEnd: function () {
                setTimeout(() => {
                    if (chart) {
                        chart.xAxis[0].hideCrosshair();
                        if (chart.tooltip) {
                            chart.tooltip.hide(0);
                        }
                        if (series) {
                            series.setState('');
                            series.points.forEach(p => p.setState(''));
                        }
                        if (chart.focusElement) {
                            chart.focusElement.removeFocusBorder();
                        }
                    }

                    if (focusResetElement) {
                        focusResetElement.focus();
                    }
                    series.update({
                        accessibility: {
                            enabled: true
                        }
                    });
                }, 400);
            }
        });
    }, 1200);
}

function makeChart(container, detail, title) {

    // Parse CSV to desired format
    const csv = document.getElementById('csv').innerHTML;
    const rows = csv.split('\n');
    rows.shift();
    const series = [[], []];
    rows.forEach(function (row) {
        const cols = row.split(',');
        if (cols.length < 6) {
            return;
        }
        const timeArr = cols[1].split(':');
        const time = (
            parseFloat(timeArr[0]) * 60 * 60 +
            parseFloat(timeArr[1]) * 60 +
            parseFloat(timeArr[0])
        ) * 1000;
        const obj = {
            x: parseFloat(cols[0]),
            y: time,
            custom: {
                nationality: cols[3],
                name: cols[4],
                marathon: cols[5],
                timeStr: cols[1]
            }
        };
        series[cols[2] === 'Male' ? 0 : 1].push(obj);
    });

    // Configure the visualization
    const chart = Highcharts.chart(container, {
        chart: {
            type: 'scatter',
            marginRight: 125
        },
        sonification: {
            duration: 600,
            masterVolume: 0.5,
            defaultInstrumentOptions: {
                minFrequency: 349,
                maxFrequency: 1568,
                mapping: {
                    pan: 'x',
                    duration: 160
                }
            },
            events: {
                onPointStart: function (_, point) {
                    if (point.highlight) {
                        try {
                            point.highlight();
                        } catch (_) {} // eslint-disable-line
                    }
                }
            }
        },
        accessibility: {
            series: {
                pointDescriptionEnabledThreshold: false,
                descriptionFormatter: function (series) {
                    if (series.name.indexOf('Trend') === 0) {
                        return series.name + '.';
                    }
                    return false;
                }
            },
            keyboardNavigation: {
                seriesNavigation: {
                    mode: 'serialize'
                }
            },
            screenReaderSection: {
                beforeChartFormat: 'Marathon winning times 1897-2018, interactive scatter plot with trend lines. The chart has 4 data series, showing Male class, Female class, Trend line for Male class, and Trend line for Female class. The chart has 1 X axis showing years, and 1 Y axis showing winning times.'
            }
        },
        lang: {
            accessibility: {
                endOfChartMarker: ''
            }
        },
        legend: {
            layout: 'proximate',
            align: 'right',
            rtl: true
        },
        exporting: {
            csv: {
                dateFormat: '%H:%M:%S'
            },
            sourceWidth: 900,
            sourceHeight: 500
        },
        title: {
            text: title
        },
        subtitle: {
            text: 'Marathon winning times 1897-2018'
        },
        tooltip: {
            formatter: function () {
                var obj = this.point.custom;
                if (this.point.custom) {
                    return '<span style="font-size: 11px">' + this.series.name + ', ' + this.point.x + ', ' + obj.marathon + '</span><br/>' +
                    '<span style="color:' + this.series.color + '">\u25CF</span> ' +
                    obj.name + ' (' + obj.nationality + '): <b>' + obj.timeStr + '</b><br/>';
                }
                return false;
            },
            backgroundColor: 'rgba(255, 255, 255, 0.90)'
        },
        yAxis: {
            title: {
                text: 'Winning time'
            },
            type: 'datetime',
            min: 2 * 60 * 60 * 1000
        },
        xAxis: {
            crosshair: {
                enabled: true
            },
            accessibility: {
                description: 'Year'
            }
        },
        plotOptions: {
            series: {
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            },
            spline: {
                showInLegend: false,
                enableMouseInteraction: false,
                includeInDataExport: false,
                marker: { enabled: false },
                accessibility: {
                    point: {
                        descriptionFormatter: function (point) {
                            return point.options.trendDesc;
                        }
                    }
                }
            },
            scatter: {
                accessibility: {
                    point: {
                        descriptionFormatter: function (point) {
                            const time = Highcharts.dateFormat('%H:%M:%S', point.y);
                            const year = Math.round(point.x);
                            return `${year}, winning time ${time}. ${point.custom.name}`;
                        }
                    }
                }
            }
        },
        series: [{
            name: 'Male class',
            data: series[0],
            color: 'rgba(65, 122, 177, 0.8)'
        }, {
            name: 'Female class',
            data: series[1],
            color: 'rgba(127, 61, 61, 0.8)'
        }]
    });

    updateTrends(chart, detail);

    return chart;
}

const lowChart = makeChart('lowContainer', 8, 'Low detail');
const mediumChart = makeChart('mediumContainer', 12, 'Medium detail');
const highChart = makeChart('highContainer', 20, 'High detail');

function setChartDuration() {
    const speed = parseFloat(document.getElementById('speed').value);
    const getDuration = numPoints => Math.max(numPoints * (11 - speed) * 70, 350);
    lowChart.update({ sonification: { duration: getDuration(8) } });
    mediumChart.update({ sonification: { duration: getDuration(12) } });
    highChart.update({ sonification: { duration: getDuration(20) } });
}

setChartDuration();

document.getElementById('lowDetailSonifyMale').onclick = () => sonifyChart(lowChart, 2);
document.getElementById('lowDetailSonifyFemale').onclick = () => sonifyChart(lowChart, 3);
document.getElementById('mediumDetailSonifyMale').onclick = () => sonifyChart(mediumChart, 2);
document.getElementById('mediumDetailSonifyFemale').onclick = () => sonifyChart(mediumChart, 3);
document.getElementById('highDetailSonifyMale').onclick = () => sonifyChart(highChart, 2);
document.getElementById('highDetailSonifyFemale').onclick = () => sonifyChart(highChart, 3);
document.getElementById('plotSonifyMale').onclick = () => sonifyChart(highChart, 0);
document.getElementById('plotSonifyFemale').onclick = () => sonifyChart(highChart, 1);
document.getElementById('speed').onchange = setChartDuration;

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) {
        lowChart.cancelSonify();
        mediumChart.cancelSonify();
        highChart.cancelSonify();
    }
});
