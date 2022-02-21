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

function updateTrends(chart, detail) {
    chart.series.forEach(series => {
        const seriesMetrics = getSeriesDataMetrics(series);
        const xBinSize = getXBinSize(seriesMetrics, detail);
        const data = getTrendDataForSeries(series, xBinSize, seriesMetrics);
        chart.addSeries({
            data,
            color: '#222',
            type: 'spline',
            includeInDataExport: false,
            marker: { enabled: false },
            xBinSize,
            name: 'Trend for Movie ratings'
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
                series.update({
                    accessibility: {
                        enabled: true
                    }
                });
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
        }]
    },
    exporting: {
        enabled: false
    },
    sonification: {
        duration: 1600,
        masterVolume: 0.6,
        defaultInstrumentOptions: {
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
        keyboardNavigation: {
            seriesNavigation: {
                mode: 'serialize'
            }
        },
        screenReaderSection: {
            beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>Scatter plot with trend line.</div><div>{xAxisDescription}</div><div>{yAxisDescription}</div>',
            onViewDataTableClick: function () {
                document.getElementById('dataTable').focus();
            }
        },
        point: {
            descriptionFormatter: function (point) {
                const imdbSegment = point.x.toFixed(1);
                const rt = Math.round(point.y);
                return `Segment around IMDB ${imdbSegment}, ${rt} average Rotten Tomatoes score.`;
            }
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
        spline: {
            tooltip: {
                enabled: false
            },
            enableMouseInteraction: false
        }
    }
});
chart.series[0].update({ name: 'Movie ratings' });

Highcharts.addEvent(chart, 'exportData', function (e) {
    console.log(e.dataRows);
});


/*Highcharts.addEvent(chart, 'aftergetTableAST', function (e) {
    const headerRow = e.tree.children[1].children[0].children;
    headerRow[0].textContent = 'IMDB rating';
    headerRow[1].textContent = 'Rotten Tomatoes score';
});
*/

updateTrends(chart, 7);

document.getElementById('sonifyPlot').onclick = () => sonifySeries(chart.series[0]);
document.getElementById('sonifyTrend').onclick = () => sonifySeries(chart.series[1]);