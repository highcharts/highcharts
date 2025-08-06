Highcharts.chart('container', {
    title: {
        text: 'Null interaction'
    },
    tooltip: {
        nullFormat: `<b>No data</b> at position <b>{point.x}</b> in
            <b>{series.name}</b>`
    },
    series: [{
        dataLabels: {
            enabled: true,
            nullFormat: 'No data'
        },
        nullInteraction: true,
        data: [1, 2, 3, null, 5, 6, 7]
    }]
});
