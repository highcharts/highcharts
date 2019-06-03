Highcharts.chart('container', {
    chart: {
        type: 'pyramid'
    },
    title: {
        text: 'Sales pyramid',
        x: -50
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> ({point.y:,.0f})',
                color: ( // theme
                    Highcharts.defaultOptions &&
                    Highcharts.defaultOptions.plotOptions &&
                    Highcharts.defaultOptions.plotOptions.series &&
                    Highcharts.defaultOptions.plotOptions.series.dataLabels &&
                    Highcharts.defaultOptions.plotOptions.series.dataLabels.color
                ) || 'black',
                softConnector: true
            },
            center: ['40%', '50%'],
            width: '80%'
        }
    },
    legend: {
        enabled: false
    },
    series: [{
        name: 'Unique users',
        data: [
            ['Website visits',      15654],
            ['Downloads',            4064],
            ['Requested price list', 1987],
            ['Invoice sent',          976],
            ['Finalized',             846]
        ]
    }]
});