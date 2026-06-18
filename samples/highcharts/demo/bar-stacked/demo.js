// Data retrieved from: https://ferjedatabanken.no/statistikk
Highcharts.chart('container', {
    dataTable: {
        columns: {
            Month: ['January', 'February', 'March', 'April', 'May'],
            Motorcycles: [74, 27, 52, 93, 1272],
            'Null-emission vehicles': [2106, 2398, 3046, 3195, 4916],
            'Conventional vehicles': [12213, 12721, 15242, 16518, 25037]
        }
    },
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Ferry passengers by vehicle type 2024',
        align: 'left'
    },
    xAxis: {
        type: 'category'
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            dataMapping: {
                name: 'Month'
            },
            stacking: 'normal',
            dataLabels: {
                enabled: true,
                backgroundColor: 'contrast',
                style: {
                    textOutline: 'none'
                }
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Motorcycles'
        }
    }, {
        dataMapping: {
            y: 'Null-emission vehicles'
        }
    }, {
        dataMapping: {
            y: 'Conventional vehicles'
        }
    }]
});
