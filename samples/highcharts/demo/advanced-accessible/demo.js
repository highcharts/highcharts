// Define custom series type for displaying low/med/high values using
// boxplot as a base
Highcharts.seriesType('lowmedhigh', 'boxplot', {
    keys: ['low', 'median', 'high'],
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
            '{series.name}: ' +
            'Low <b>{point.low} NOK</b> - Median <b>{point.median} NOK</b> - ' +
            'High <b>{point.high} NOK</b><br/>'
    }
}, {
    // Change point shape to a line with three crossing lines for
    // low/median/high
    // Stroke width is hardcoded to 1 for simplicity
    drawPoints: function () {
        const series = this;
        this.points.forEach(function (point) {
            let graphic = point.graphic;
            const verb = graphic ? 'animate' : 'attr',
                shapeArgs = point.shapeArgs,
                width = shapeArgs.width,
                left = Math.floor(shapeArgs.x) + 0.5,
                right = left + width,
                crispX = left + Math.round(width / 2) + 0.5,
                highPlot = Math.floor(point.highPlot) + 0.5,
                medianPlot = Math.floor(point.medianPlot) + 0.5,
                // Sneakily draw low marker even if 0
                lowPlot = Math.floor(point.lowPlot) +
                    0.5 - (point.low === 0 ? 1 : 0);

            if (point.isNull) {
                return;
            }

            if (!graphic) {
                point.graphic = graphic = series.chart.renderer
                    .path('point')
                    .add(series.group);
            }

            graphic.attr({
                stroke: point.color || series.color,
                'stroke-width': 1
            });

            graphic[verb]({
                d: [
                    'M', left, highPlot,
                    'H', right,
                    'M', left, medianPlot,
                    'H', right,
                    'M', left, lowPlot,
                    'H', right,
                    'M', crispX, highPlot,
                    'V', lowPlot
                ]
            });
        });
    }
});

// Create chart
const chart = Highcharts.chart('container', {
    chart: {
        type: 'lowmedhigh'
    },
    title: {
        text: 'Monthly earnings, by level of education in Norway',
        align: 'left'
    },
    subtitle: {
        text: 'Source: ' +
            '<a href="https://www.ssb.no/en/statbank/table/11420/" target="_blank">SSB</a>',
        align: 'left'
    },
    accessibility: {
        point: {
            descriptionFormat: '{#unless isNull}{category}, low {low}, ' +
                'median {median}, high {high}{/unless}'
        },
        series: {
            descriptionFormat: '{series.name}, series {seriesNumber} of ' +
                '{chart.series.length} with {series.points.length} data points.'
        },
        typeDescription: 'Low, median, high. Each data point has a low, ' +
            'median and high value, depicted vertically as small ticks.' //
            // Describe the chart type to screen reader users, since this is
            // not a traditional boxplot chart
    },
    xAxis: [{
        accessibility: {
            description: 'Year'
        },
        crosshair: true,
        categories: [2017, 2018, 2019, 2020, 2021, 2022, 2023]
    }],
    yAxis: {
        title: {
            text: 'Monthly earnings (NOK)'
        },
        min: 0
    },
    tooltip: {
        shared: true,
        stickOnContact: true
    },
    plotOptions: {
        series: {
            stickyTracking: true,
            whiskerWidth: 5
        }
    },
    series: [{
        name: 'Scientific research and development',
        data: [
            [48230, 57210, 71900],
            [49360, 58450, 73490],
            [50610, 60240, 75770],
            [51150, 60600, 75950],
            [53060, 63080, 79130],
            [55480, 66210, 82020],
            [58740, 69870, 86360]
        ]
    }, {
        name: 'Hospital activities',
        data: [
            [50830, 66240, 87490],
            [52490, 67620, 89250],
            [53690, 69430, 91790],
            [53720, 69210, 92380],
            [56510, 72640, 97000],
            [58840, 75490, 100400],
            [62280, 79790, 107100]
        ]
    }, {
        name: 'Fire service activities',
        data: [
            [46760, 52350, 61050],
            [47920, 53860, 62090],
            [47900, 51830, 64170],
            [48820, 53330, 64500],
            [50980, 56090, 67870],
            [52870, 58330, 72250],
            [56670, 61110, 79620]
        ]
    }]

});


// Remove click events on container to avoid having "clickable" announced by AT
// These events are needed for custom click events, drag to zoom, and navigator
// support.
chart.container.onmousedown = null;
chart.container.onclick = null;
