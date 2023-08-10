Highcharts.chart('container', {

    title: {
        text: 'Daytime temperatures in the capitals'
    },

    exporting: {
        showTable: true,
        csv: {
            uniqueNames: true
        }
    },

    xAxis: {
        categories: ['Morning', 'Midday', 'Evening']
    },

    yAxis: {
        title: {
            text: 'Temperature (°C)'
        }
    },

    series: [{
        name: 'Canberra',
        data: [18, 32, 22]
    }, {
        name: 'Washington',
        data: [12, 23, 15]
    }, {
        name: 'Paris',
        data: [10, 17, 12]
    }]

});
