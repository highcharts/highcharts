// Data retrieved from https://yearbook.enerdata.net/electricity/world-electricity-production-statistics.html
Highcharts.chart('container', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            viewDistance: 25,
            depth: 40
        }
    },

    title: {
        text: ' Electricity production in countries, grouped by continent',
        align: 'left'
    },

    xAxis: {
        labels: {
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },

    yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
            text: 'TWh',
            skew3d: true,
            style: {
                fontSize: '16px'
            }
        }
    },

    tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: '<span style="color:{series.color}">\u25CF</span> ' +
            '{series.name}: {point.y} / {point.stackTotal}'
    },

    plotOptions: {
        series: {
            pointStart: 2018
        },
        column: {
            stacking: 'normal',
            depth: 40
        }
    },

    series: [{
        name: 'South Korea',
        data: [590, 582, 571, 606, 625],
        stack: 'Asia'
    }, {
        name: 'Germany',
        data: [643, 612, 572, 588, 578],
        stack: 'Europe'
    }, {
        name: 'Saudi Arabia',
        data: [378, 367, 363, 408, 433],
        stack: 'Asia'
    }, {
        name: 'France',
        data: [582, 571, 533, 555, 473],
        stack: 'Europe'
    }]
});
