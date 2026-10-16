Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>plotOptions.xrange.borderRadius</em>'
    },
    yAxis: {
        title: {
            text: ''
        },
        categories: ['Prototyping', 'Development', 'Testing'],
        reversed: true
    },
    plotOptions: {
        xrange: {
            borderRadius: '1rem'
        }
    },
    series: [
        {
            data: [
                {
                    x: 0,
                    x2: 4,
                    y: 0
                },
                {
                    x: 3,
                    x2: 9,
                    y: 1
                },
                {
                    x: 7,
                    x2: 10,
                    y: 2
                }
            ],
            name: 'Project',
            type: 'xrange'
        }
    ]
});
