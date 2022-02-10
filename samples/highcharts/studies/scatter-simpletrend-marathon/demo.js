/* eslint-disable max-len */
// Parse CSV to desired format
var csv = document.getElementById('csv').innerHTML;
var rows = csv.split('\n');
rows.shift();
var series = [[], []];
rows.forEach(function (row) {
    var cols = row.split(',');
    if (cols.length < 6) {
        return;
    }
    var timeArr = cols[1].split(':');
    var time = (
        parseFloat(timeArr[0]) * 60 * 60 +
        parseFloat(timeArr[1]) * 60 +
        parseFloat(timeArr[0])
    ) * 1000;
    var obj = {
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
var chart = Highcharts.chart('container', {
    chart: {
        type: 'scatter'
    },
    sonification: {
        masterVolume: 0.6,
        defaultInstrumentOptions: {
            mapping: {
                pan: 'x',
                duration: 160
            }
        }
    },
    title: {
        text: 'Marathon winning times 1897-2018'
    },
    subtitle: {
        text: 'Source: <a href="https://data.world/newns92/abbott-world-marathon-majors-winners">data.world</a>'
    },
    tooltip: {
        formatter: function () {
            var obj = this.point.custom;
            return '<span style="font-size: 11px">' + this.series.name + ', ' + this.point.x + ', ' + obj.marathon + '</span><br/>' +
            '<span style="color:' + this.series.color + '">\u25CF</span> ' +
            obj.name + ' (' + obj.nationality + '): <b>' + obj.timeStr + '</b><br/>';
        },
        backgroundColor: 'rgba(255, 255, 255, 0.90)',
        stickOnContact: true
    },
    yAxis: {
        title: {
            text: 'Winning time'
        },
        type: 'datetime',
        min: 2 * 60 * 60 * 1000
    },
    xAxis: {
    },
    plotOptions: {
        scatter: {
            sonification: {
                enabled: false
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

function getXBinSize(seriesMetrics) {
    const dataMin = seriesMetrics.xMin;
    const dataMax = seriesMetrics.xMax;
    const range = dataMax - dataMin;
    return range / document.getElementById('detail').value;
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

let trendSeries = [];

function updateTrends() {
    trendSeries.forEach(s => s.remove(false));
    trendSeries = [];
    chart.redraw();

    chart.series.forEach(series => {
        const seriesMetrics = getSeriesDataMetrics(series);
        const xBinSize = getXBinSize(seriesMetrics);
        const data = getTrendDataForSeries(series, xBinSize, seriesMetrics);
        trendSeries.push(chart.addSeries({
            data,
            color: '#222',
            type: 'spline',
            showInLegend: false,
            marker: { enabled: false }
        }, false));
    });
    chart.redraw();
}

updateTrends();

function sonifyTrends() {
    chart.sonify();
}
