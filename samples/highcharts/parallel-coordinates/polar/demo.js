var data = [
    [1012518000000, 5, 2311020, 0, 462180, 1, 0],
    [1012950000000, 6, 3232020, 4, 538680, 0, 0],
    [1013122800000, 4.5, 2419020, 3, 537540, 1, 0]
];

Highcharts.chart('container', {
    chart: {
        parallelCoordinates: true,
        parallelAxes: {
            labels: {
                style: {
                    color: '#999999'
                }
            },
            gridLineWidth: 0,
            lineWidth: 2,
            showFirstLabel: false,
            showLastLabel: true
        },
        polar: true
    },
    title: {
        text: 'Marathon runner profiles'
    },
    subtitle: {
        text: 'Highcharts star plot with multivariate data'
    },
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
        '{series.name}: <b>{point.formattedValue}</b><br/>'
    },
    legend: {
        enabled: true,
        borderWidth: 1,
        align: 'right',
        verticalAlign: 'middle',
        layout: 'vertical'
    },
    xAxis: {
        categories: [
            'Training date',
            'Miles for training run',
            'Training time',
            'Shoe brand',
            'Running pace per mile',
            'Short or long',
            'After 2004'
        ],
        labels: {
            distance: 30,
            style: {
                fontWeight: 'bold'
            }
        },
        gridLineWidth: 0
    },
    yAxis: [{
        type: 'datetime',
        tooltipValueFormat: '{value:%Y-%m-%d}'
    }, {
        min: 0,
        tooltipValueFormat: '{value} mile(s)'
    }, {
        type: 'datetime',
        min: 0,
        labels: {
            format: '{value:%H:%M}'
        }
    }, {
        categories: [
            'Other',
            'Adidas',
            'Mizuno',
            'Asics',
            'Brooks',
            'New Balance',
            'Izumi'
        ],
        min: -1
    }, {
        type: 'datetime'
    }, {
        categories: ['&gt; 5miles', '&lt; 5miles'],
        min: -1,
        max: 1
    }, {
        categories: ['Before', 'After'],
        min: -1,
        max: 1
    }],
    series: data.map(function (set, i) {
        return {
            name: 'Runner ' + i,
            data: set
        };
    })
});
