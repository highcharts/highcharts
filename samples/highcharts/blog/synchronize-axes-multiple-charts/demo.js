// Highcharts plugin that makes all chart's x and y axes to follow the main
// chart's axes.
(() => {
    function syncAxis(e) {
        Highcharts.charts.forEach(chart => {
            const mainChart = Highcharts.charts[0];

            if (chart !== mainChart) {
                if (chart[e.target.coll][0].setExtremes) {
                    chart[e.target.coll][0].update({
                        min: e.min,
                        max: e.max,
                        tickPositions: this.tickPositions
                    });
                }
            }
        });
    }

    Highcharts.addEvent(Highcharts.Axis, 'afterSetExtremes', e => {
        if (e.target.chart.options.chart.otherChartsFollowAxes) {
            syncAxis.call(e.target, e);
        }
    });

    Highcharts.addEvent(Highcharts.Chart, 'load', e => {
        const mainChart = Highcharts.charts[0];

        if (
            mainChart.options.chart.otherChartsFollowAxes &&
            Highcharts.lastChartRender
        ) {
            mainChart.xAxis[0].setExtremes(
                mainChart.xAxis[0].min,
                mainChart.xAxis[0].max
            );
            mainChart.yAxis[0].setExtremes(
                mainChart.yAxis[0].min,
                mainChart.yAxis[0].max
            );
        }
    });
})();

(async () => {
    const res = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/activity.json'
    );
    const data = await res.json();
    const datasets = data.datasets;

    Highcharts.setOptions({
        chart: {
            marginLeft: 40, // Keep all charts left aligned
            spacingTop: 20,
            spacingBottom: 20
        }
    });

    Highcharts.chart('container1', {
        chart: {
            otherChartsFollowAxes: true,
            zoomType: 'xy'
        },
        title: {
            text: 'Main chart'
        },
        series: [{
            data: datasets[0].data.map(value => value * 20),
            name: datasets[0].name
        }]
    });

    Highcharts.chart('container2', {
        title: {
            text: 'Extra data 1'
        },
        series: [{
            data: datasets[1].data,
            name: datasets[1].name,
            type: 'area'
        }]
    });

    Highcharts.chart('container3', {
        title: {
            text: 'Extra data 2'
        },
        series: [{
            data: datasets[2].data,
            name: datasets[2].name,
            type: 'area'
        }]
    });

    Highcharts.lastChartRender = true;
    Highcharts.chart('container4', {
        title: {
            text: 'Extra data 3'
        },
        series: [{
            data: datasets[2].data.reverse(),
            name: datasets[2].name,
            type: 'column'
        }]
    });
})();
