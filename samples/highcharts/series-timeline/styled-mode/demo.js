Highcharts.chart('container', {
    chart: {
        height: 400,
        styledMode: true
    },

    series: [
        {
            showInLegend: true,
            dataLabels: {
                allowOverlap: false
            },
            type: 'timeline',
            data: [
                {
                    x: '1951-06-22',
                    name: 'New Date 1',
                    label: 'Some new label'
                }, {
                    x: '1957-10-04',
                    name: 'New Date 2',
                    label: 'Some new label'
                }, {
                    x: '1959-01-04',
                    name: 'New Date 3',
                    label: 'Some new label'
                }, {
                    x: '1961-04-12',
                    name: 'New Date 3',
                    label: 'Some new label'
                }
            ]
        }
    ],

    xAxis: {
        type: 'datetime'
    }
});