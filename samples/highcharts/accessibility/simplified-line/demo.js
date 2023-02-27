const chart = Highcharts.chart('container', {
    chart: {
        animation: false
    },
    title: {
        text: 'Crypto coin prices in USD'
    },
    subtitle: {
        text: 'Source: Yahoo Finance'
    },
    data: {
        csv: document.getElementById('csv').textContent
    },
    yAxis: {
        title: {
            text: ''
        },
        accessibility: {
            description: 'Price in USD'
        },
        labels: {
            format: '${value}'
        },
        max: 80000
    },
    xAxis: {
        accessibility: {
            description: 'Time'
        },
        type: 'datetime'
    },
    plotOptions: {
        series: {
            opacity: 0.3,
            marker: {
                enabled: false
            }
        }
    }
});

function updateSimplified(val) {
    for (let i = 0; i < 3; ++i) {
        const sourceSeries = chart.series[i],
            newData = chart.accessibility.simplifyLineSeries(
                sourceSeries,
                parseFloat(val)
            ).map(p => [p.x, p.y]);
        if (chart.series.length < i + 4) {
            chart.addSeries({
                name: sourceSeries.name + ' (simplified)',
                data: newData,
                opacity: 1,
                color: sourceSeries.color,
                label: {
                    enabled: false
                }
            });
        } else {
            chart.series[i + 3].setData(newData, false);
        }
    }
    chart.setTitle(null, {
        text: 'Each line simplified to ' + val + ' data points'
    }, false);
    chart.redraw();
}

document.getElementById('detail').onchange = function () {
    updateSimplified(this.value);
};
updateSimplified(document.getElementById('detail').value);
