// Define custom series type for displaying low/med/high values using boxplot as a base
Highcharts.seriesType('lowmedhigh', 'boxplot', {
    keys: ['low', 'median', 'high'],
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: ' +
            'Low <b>{point.low} NOK</b> - Median <b>{point.median} NOK</b> - High <b>{point.high} NOK</b><br/>'
    }
}, {
    // Change point shape to a line with three crossing lines for low/median/high
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
            descriptionFormat: '{#unless isNull}{category}, low {low}, median {median}, high {high}{/unless}'
        },
        series: {
            descriptionFormat: '{series.name}, series {seriesNumber} of {chart.series.length} with {series.points.length} data points.'
        },
        typeDescription: 'Low, median, high. Each data point has a low, median and high value, depicted vertically as small ticks.' // Describe the chart type to screen reader users, since this is not a traditional boxplot chart
    },
    xAxis: [{
        accessibility: {
            description: 'Year'
        },
        crosshair: true,
        categories: [2015, 2016, 2017, 2018, 2019, 2020, 2021]
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
            [46240, 56720, 69540],
            [46360, 55050, 67710],
            [47600,  57040, 69250],
            [48610, 59030, 72070],
            [49690, 60770, 75040],
            [50000, 61170, 75660],
            [50500, 63020, 78630]
        ]
    }, {
        name: 'Hospital activities',
        data: [
            [43310, 53510, 71450],
            [44280, 53440, 66040],
            [45790, 55080, 68720],
            [47500, 56660, 70850],
            [48420, 58250, 73430],
            [48560, 58390, 74060],
            [51100, 63050, 78280]
        ]
    }, {
        name: 'Fire service activities',
        data: [
            [null, null, null],
            [37380, 44560, 51450],
            [38020, 47080, 55230],
            [null, null,  null],
            [37360, 44940, 50230],
            [40560, 46800, 55880],
            [42390, 47450, 57400]
        ]
    }]
});

// Remove click events on container to avoid having "clickable" announced by AT
// These events are needed for custom click events, drag to zoom, and navigator
// support.
chart.container.onmousedown = null;
chart.container.onclick = null;
