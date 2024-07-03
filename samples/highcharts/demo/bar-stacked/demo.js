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
            'January', 'February', 'March', 'April', 'May'
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
        data: [74, 27, 52, 93, 1272]
    }, {
        name: 'Null-emission vehicles',
        data: [2106, 2398, 3046, 3195, 4916]
    }, {
        name: 'Conventional vehicles',
        data: [12213, 12721, 15242, 16518, 25037]
    }]
});
