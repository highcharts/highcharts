// Data
const global = [73, 73, 74, 75, 76, 78, 79, 80, 82, 83, 83, 84, 84, 84, 85, 85,
        85, 85, 85, 86, 82, 80],
    africa = [54, 55, 59, 61, 62, 65, 66, 69, 71, 74, 72, 70, 71, 70, 71, 72,
        73, 73, 73, 74, 71, 70],
    europe = [94, 94, 93, 92, 95, 95, 95, 96, 96, 95, 95, 95, 95, 96, 94, 94,
        94, 93, 94, 95, 94, 94],
    seAsia = [64, 65, 65, 66, 66, 71, 72, 73, 75, 78, 80, 82, 83, 85, 87, 88,
        87, 90, 91, 90, 85, 82];

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

    Highcharts.addEvent(Highcharts.Chart, 'load', () => {
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

Highcharts.setOptions({
    chart: {
        marginLeft: 50, // Keep all charts left aligned
        spacingTop: 20,
        spacingBottom: 20,
        type: 'area'
    },
    yAxis: {
        title: {
            text: null
        }
    },
    legend: {
        enabled: false
    },
    colors: ['#36096D'],
    plotOptions: {
        area: {
            fillColor: {
                linearGradient: {
                    x1: 0,
                    x2: 0,
                    y1: 0,
                    y2: 1
                },
                stops: [
                    [0, '#36096D'],
                    [1, '#37D5D6']
                ]
            }
        }
    }
});

Highcharts.chart('container1', {
    chart: {
        otherChartsFollowAxes: true,
        zoomType: 'xy'
    },
    title: {
        text: 'Polio (Pol3) immunization coverage among 1-year-olds (%) '
    },
    subtitle: {
        text: 'Source: https://apps.who.int/gho/data/'
    },
    series: [{
        pointStart: 2000,
        data: global,
        name: 'Global'
    }]
});

Highcharts.chart('container2', {
    title: {
        text: 'Africa'
    },
    series: [{
        pointStart: 2000,
        data: africa,
        name: 'Africa'
    }]
});

Highcharts.chart('container3', {
    title: {
        text: 'Europe'
    },
    series: [{
        pointStart: 2000,
        data: europe,
        name: 'Europe'
    }]
});

Highcharts.lastChartRender = true;
Highcharts.chart('container4', {
    title: {
        text: 'South-East Asia'
    },
    series: [{
        pointStart: 2000,
        data: seAsia,
        name: 'South-East Asia'
    }]
});
