Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>plotOptions.funnel.borderRadius</em>'
    },
    plotOptions: {
        funnel: {
            borderRadius: '1rem'
        }
    },
    series: [{
        data: [
            [
                'Website visits',
                15654
            ],
            [
                'Downloads',
                4064
            ],
            [
                'Requested price list',
                1987
            ],
            [
                'Invoice sent',
                976
            ],
            [
                'Finalized',
                846
            ]
        ],
        name: 'Visitors',
        type: 'funnel'
    }]
});
