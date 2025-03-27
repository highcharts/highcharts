Highcharts.chart('container', {
    title: {
        text: 'Null interaction'
    },
    tooltip: {
        nullFormat: `<span>
            <b>
                Null
            </b> value at position <b>
                {point.x}
            </b> in series <b>
                {series.index}
            </b>
        </span>`
    },
    series: [{
        dataLabels: {
            enabled: true,
            nullFormat: 'Null'
        },
        nullInteraction: true,
        data: [1, 2, 3, null, 5, 6, 7]
    }]
});
