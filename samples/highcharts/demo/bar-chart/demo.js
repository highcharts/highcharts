Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },

    title: {
        text: 'Historic World Population by Region',
        align: 'left'
    },

    subtitle: {
        text: 'Source: <a ' +
            'href="https://en.wikipedia.org/wiki/List_of_continents_and_continental_subregions_by_population"' +
            'target="_blank">Wikipedia.org</a>',
        align: 'left'
    },

    xAxis: {
        categories: ['Africa', 'America', 'Asia', 'Europe'],
        gridLineWidth: 1,
        lineWidth: 0
    },

    yAxis: {
        title: {
            text: ''
        },
        labels: {
            format: '{value} M'
        },
        crosshair: true,
        gridLineWidth: 0,
        maxPadding: 0.05,
        endOnTick: false
    },

    tooltip: {
        valueSuffix: ' millions'
    },

    plotOptions: {
        bar: {
            dataLabels: {
                enabled: true
            },
            pointPadding: 0.05,
            groupPadding: 0.1
        }
    },

    series: [{
        name: 'Year 1990',
        data: [632, 727, 3202, 721]
    }, {
        name: 'Year 2000',
        data: [814, 841, 3714, 726]
    }, {
        name: 'Year 2021',
        data: [1393, 1031, 4695, 745]
    }]
});
