Highcharts.chart('container', {

    chart: {
        type: 'heatmap'
    },

    colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    },

    series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        data: [
            [0, 0, 5],
            [0, 1, null],
            [1, 0, 3],
            [1, 1, 9]
        ],
        dataLabels: {
            enabled: true,
            color: '#000000',
            nullFormat: 'N/A'
        }
    }],

    tooltip: {
        nullFormat: 'Value is not available.',
        backgroundColor: '#fff'
    }

});
