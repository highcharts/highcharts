Highcharts.chart('container-1', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Highcharts gauge defauls'
    },

    series: [{
        data: [27]
    }]

});

Highcharts.chart('container-2', {

    chart: {
        type: 'solidgauge'
    },

    title: {
        text: 'Highcharts solid gauge defauls'
    },

    series: [{
        data: [27]
    }]

});
