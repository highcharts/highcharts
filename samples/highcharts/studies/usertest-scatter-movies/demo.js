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
            name: 'Trend description for Movie ratings'
        });
    });
    chart.redraw();
}

function sonifySeries(series) {
    const chart = series.chart;
    focusResetElement = document.activeElement;
    series.update({
        accessibility: {
            enabled: false
        }
    });

    setTimeout(() =>
        series.sonify({
            onEnd: function () {
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
                setTimeout(() => {
                    series.update({
                        accessibility: {
                            enabled: true
                        }
                    });
                }, 100);
            }
        }),
    400);
}

// Configure the visualization
const chart = Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },
    data: {
        csv: document.getElementById('csv').innerHTML,
        seriesMapping: [{
            x: 1,
            y: 0,
            title: 2
        }],
        parsed: function (columns) {
            const rows = [];
            for (let i = 1; i < columns[0].length; ++i) {
                const row = columns.map(c => c[i]);
                rows.push(row);
            }
            rows.sort((a, b) => a[1] - b[1]);

            columns.forEach((col, colIx) => {
                for (let i = 1; i < col.length; ++i) {
                    col[i] = rows[i - 1][colIx];
                }
            });
        }
    },
    exporting: {
        enabled: false
    },
    sonification: {
        duration: 5000 - parseFloat(document.getElementById('speed').value) * 400,
        masterVolume: 0.4,
        defaultInstrumentOptions: {
            minFrequency: 349,
            maxFrequency: 1568,
            mapping: {
                pan: 'x',
                duration: 260
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
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        },
        screenReaderSection: {
            beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>Scatter plot with trend line. The chart has two data series, displaying Movie ratings and Trend description for Movie ratings.</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div>'
        },
        series: {
            pointDescriptionEnabledThreshold: false
        }
    },
    lang: {
        accessibility: {
            endOfChartMarker: ''
        }
    },
    title: {
        text: 'Movie ratings on IMDB vs Rotten Tomatoes'
    },
    tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.90)',
        formatter: function () {
            const p = this.point.options;
            if (this.series.type === 'spline') {
                return false;
            }
            return `<span style="color:${this.series.color}">\u25CF</span> <span style="font-size: 11px">${p.title}</span><br>IMDB: ${p.x}<br>Rotten Tomatoes: ${p.y}`;
        }
    },
    yAxis: {
        title: {
            text: 'Rotten Tomatoes score'
        },
        accessibility: {
            rangeDescription: 'Data range: 24 to 97.'
        },
        min: 20,
        max: 100
    },
    legend: {
        enabled: false
    },
    xAxis: {
        crosshair: {
            enabled: true
        },
        title: {
            text: 'IMDB score'
        },
        accessibility: {
            rangeDescription: 'Data range: 4.4 to 9.0.'
        },
        min: 2,
        max: 10
    },
    plotOptions: {
        series: {
            states: {
                inactive: {
                    enabled: false
                }
            }
        },
        scatter: {
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        return `${point.options.title}. IMDB rating ${point.options.x}. Rotten Tomatoes score ${point.options.y}.`;
                    }
                }
            }
        },
        spline: {
            tooltip: {
                enabled: false
            },
            includeInDataExport: false,
            marker: { enabled: false },
            enableMouseInteraction: false,
            accessibility: {
                point: {
                    descriptionFormatter: function (point) {
                        return point.options.trendDesc;
                    }
                }
            }
        }
    }
});
chart.series[0].update({ name: 'Movie ratings' });

updateTrends(chart, 7);

document.getElementById('speed').onchange = () => chart.update({
    sonification: {
        duration: 5000 - parseFloat(document.getElementById('speed').value) * 400
    }
});
document.getElementById('sonifyPlot').onclick = () => sonifySeries(chart.series[0]);
document.getElementById('sonifyTrend').onclick = () => sonifySeries(chart.series[1]);