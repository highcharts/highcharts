
Highcharts.chart('container', {
    title: {
        text: 'The <em>series.keys</em> option'
    },
    subtitle: {
        text: 'Specifies which array options map to which keys'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    yAxis: {
        max: 100,
        labels: {
            format: '{value}%'
        }
    },
    series: [{
        type: 'column',
        name: 'Browser share',
        keys: ['name', 'y', 'dataLabels.style.visibility'],
        // Hide data labels by default, show them per point
        dataLabels: {
            enabled: true,
            color: '#aa0000',
            style: {
                visibility: 'hidden',
                fontSize: '14px'
            }
        },
        data: [
            ['Firefox', 45.0],
            ['IE', 26.8],
            ['Chrome', 12.8, 'visible'],
            ['Safari', 8.5],
            ['Opera', 6.2],
            ['Others', 0.7]
        ]
    }]
});
