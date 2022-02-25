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

function getDescribedTrendData(data, chartExtremes) {
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

    const describedData = [];
    data.forEach((values, ix) => {
        const nextValues = data[ix + 1];
        const yVal = values[1];
        const nextYVal = nextValues && nextValues[1];
        let desc = '';

        if (ix === 0) {
            desc = `First of ${data.length} trend segments.`;
        } else if (!nextValues) {
            desc = 'End of trend line.';
        } else {
            desc = `${ix + 1}.`;
        }

        if (yVal === min && minCount < 2) {
            desc += ' This is the lowest point.';
        }

        if (yVal === max && maxCount < 2) {
            desc += ' This is the highest point.';
        }

        if (nextYVal !== undefined) {
            const totalDiff = chartExtremes.dataMax - chartExtremes.dataMin;
            const diffToNext = nextYVal - yVal;
            const absDiff = Math.abs(diffToNext);
            const neutralThreshold = totalDiff / data.length;

            if (absDiff < neutralThreshold / 25) {
                desc += ' Trending flat.';
            } else {
                const direction = diffToNext > 0 ? 'up' : 'down';
                if (absDiff > neutralThreshold / 0.8) {
                    desc += ` Trending ${direction} sharply.`;
                } else if (absDiff < neutralThreshold / 5) {
                    desc += ` Trending ${direction} slightly.`;
                } else {
                    desc += ` Trending ${direction}.`;
                }
            }
        }

        describedData.push({
            x: values[0],
            y: values[1],
            trendDesc: desc
        });
    });

    return describedData;
}

function updateTrends(chart, detail) {
    chart.series.forEach(series => {
        const seriesMetrics = getSeriesDataMetrics(series);
        const xBinSize = getXBinSize(seriesMetrics, detail);
        const data = getTrendDataForSeries(series, xBinSize, seriesMetrics);
        const describedData = getDescribedTrendData(data, {
            dataMin: chart.yAxis[0].dataMin,
            dataMax: chart.yAxis[0].dataMax
        });
        chart.addSeries({
            data: describedData,
            color: '#222',
            type: 'spline',
            xBinSize,
            name: 'Trend description for ' + series.name
        });
    });
    chart.redraw();
}

function announce(text) {
    const liveReg = document.getElementById('announce');
    liveReg.textContent = text;
    setTimeout(() => (liveReg.textContent = ''), 4000);
}

function sonifyChart(chart, firstSeriesIx, secondSeriesIx) {
    focusResetElement = document.activeElement;
    const firstSeries = chart.series[firstSeriesIx === undefined ? 2 : firstSeriesIx];
    const secondSeries = chart.series[secondSeriesIx === undefined ? 3 : secondSeriesIx];

    announce('Playing ' + firstSeries.name);

    firstSeries.update({
        accessibility: {
            enabled: false
        }
    });
    secondSeries.update({
        accessibility: {
            enabled: false
        }
    });

    setTimeout(function () {
        firstSeries.sonify({
            onEnd: function () {
                setTimeout(() => announce('Playing ' + secondSeries.name), 300);
                setTimeout(function () {
                    secondSeries.sonify({
                        onEnd: function () {
                            setTimeout(() => {
                                const series = secondSeries;
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
                                firstSeries.update({
                                    accessibility: {
                                        enabled: true
                                    }
                                });
                                secondSeries.update({
                                    accessibility: {
                                        enabled: true
                                    }
                                });
                            }, 400);
                        }
                    });
                }, 1500);
            }
        });
    }, 800);
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
                pointDescriptionEnabledThreshold: false
            },
            keyboardNavigation: {
                seriesNavigation: {
                    mode: 'serialize'
                }
            },
            screenReaderSection: {
                beforeChartFormat: 'Marathon winning times 1897-2018, interactive scatter plot with trend lines. The chart has 4 data series, displaying Male class, Trend description for Male class, Female class, and Trend description for Female class. The X axis, displaying years, has data ranging from 1897 to 2018. The Y axis, displaying winning times, has data ranging from 2:02:57 to 3:30:00.'
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
            }
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

const lowestChart = makeChart('lowestContainer', 3, 'Lowest detail');
const lowChart = makeChart('lowContainer', 5, 'Low detail');
const mediumChart = makeChart('mediumContainer', 8, 'Medium detail');
const highChart = makeChart('highContainer', 12, 'High detail');
const highestChart = makeChart('highestContainer', 20, 'Highest detail');

function setChartDuration() {
    const speed = parseFloat(document.getElementById('speed').value);
    const getDuration = numPoints => Math.max(numPoints * (11 - speed) * 60, 350);
    lowestChart.update({ sonification: { duration: getDuration(3) } });
    lowChart.update({ sonification: { duration: getDuration(5) } });
    mediumChart.update({ sonification: { duration: getDuration(8) } });
    highChart.update({ sonification: { duration: getDuration(12) } });
    highestChart.update({ sonification: { duration: getDuration(20) } });
}

setChartDuration();

document.getElementById('lowestDetailSonify').onclick = () => sonifyChart(lowestChart);
document.getElementById('lowDetailSonify').onclick = () => sonifyChart(lowChart);
document.getElementById('mediumDetailSonify').onclick = () => sonifyChart(mediumChart);
document.getElementById('highDetailSonify').onclick = () => sonifyChart(highChart);
document.getElementById('highestDetailSonify').onclick = () => sonifyChart(highestChart);
document.getElementById('plotSonify').onclick = () => sonifyChart(highestChart, 0, 1);
document.getElementById('speed').onchange = setChartDuration;

document.addEventListener('keydown', function (e) {
    if (e.keyCode === 27) {
        lowestChart.cancelSonify();
        lowChart.cancelSonify();
        mediumChart.cancelSonify();
        highChart.cancelSonify();
        highestChart.cancelSonify();
    }
});