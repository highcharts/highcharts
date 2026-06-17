Highcharts.chart('container', {
    dataTable: {
        columns: {
            Year: [2020, 2021, 2022, 2023],
            Cost: [11, 13, 12, 14],
            Revenue: [12, 15, 14, 18]
        }
    },
    chart: {
        type: 'column'
    },
    title: {
        text: 'DataTable as option'
    },
    plotOptions: {
        series: {
            dataMapping: {
                x: 'Year'
            }
        }
    },
    series: [{
        dataMapping: {
            y: 'Cost'
        }
    }, {
        dataMapping: {
            y: 'Revenue'
        }
    }]
});
