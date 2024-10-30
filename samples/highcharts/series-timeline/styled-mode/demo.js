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
                    x: Date.UTC(1951, 5, 22),
                    name: 'New Date 1',
                    label: 'Some new label'
                }, {
                    x: Date.UTC(1957, 9, 4),
                    name: 'New Date 2',
                    label: 'Some new label'
                }, {
                    x: Date.UTC(1959, 0, 4),
                    name: 'New Date 3',
                    label: 'Some new label'
                }, {
                    x: Date.UTC(1961, 3, 12),
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