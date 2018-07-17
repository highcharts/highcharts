Highcharts.chart('container', {
    chart: {
        parallelCoordinates: true,
        inverted: true
    },

    title: {
        text: 'Highcharts Parallel Coordinates with <em>tooltipValueFormat</em> set'
    },

    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.formattedValue}</b><br/>'
    },
    xAxis: {
        opposite: false,
        offset: 25,
        categories: [
            'yAxis.tooltipValueFormat:<br>{value:%Y-%m-%d}',
            'yAxis.labels.format:<br>{value:%H:%M}',
            'category',
            'datetime',
            'logarithmic'
        ],
        labels: {
            style: {
                fontWeight: 'bold'
            }
        }
    },
    yAxis: [{
        type: 'datetime',
        tooltipValueFormat: '{value:%Y-%m-%d}'
    }, {
        type: 'datetime',
        labels: {
            format: '{value:%H:%M}'
        }
    }, {
        categories: ['Main', 'Stage', 'Test']
    }, {
        type: 'datetime'
    }, {
        type: 'logarithmic'
    }],
    series: [{
        data: [Date.UTC(2000, 0, 12), Date.UTC(2015, 0, 1, 15, 20), 0, Date.UTC(2018, 0, 1), 0.5]
    }, {
        data: [Date.UTC(2000, 0, 18), Date.UTC(2015, 0, 1, 11, 56), 2, Date.UTC(2017, 0, 1), 15600]
    }, {
        data: [Date.UTC(2000, 0, 21), Date.UTC(2015, 0, 1, 22, 44), 1, Date.UTC(2016, 0, 1), 5000]
    }]
});