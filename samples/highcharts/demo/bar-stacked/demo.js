// Data retrieved from: https://ferjedatabanken.no/statistikk
Highcharts.chart('container', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Ferry passengers by vehicle-type 2024'
    },
    xAxis: {
        categories: [
            'Mai', 'April', 'Mars', 'Februar', 'Januar'
        ]
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Points'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [{
        name: 'Motorcycles',
        data: [1272, 93, 52, 27, 74]
    }, {
        name: 'Null-emission vehicles',
        data: [4916, 3195, 3046, 2398, 2106]
    }, {
        name: 'Conventional vehicles',
        data: [25037, 16518, 15242, 12721, 12213]
    }]
});
