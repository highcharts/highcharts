// Give the points a 3D feel by adding a radial gradient
Highcharts.setOptions({
    colors: Highcharts.getOptions().colors.map(function (color) {
        return {
            linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
            stops: [
                [0, Highcharts.Color(color).brighten(0.2).get('rgb')],
                [0.5, color],
                [1, Highcharts.Color(color).brighten(-0.4).get('rgb')]
            ]
        };
    })
});

// Set up the chart
Highcharts.chart('container', {
    chart: {
        type: 'pyramid3d',
        options3d: {
            enabled: true,
            alpha: 10,
            depth: 50,
            viewDistance: 50
        }
    },
    title: {
        text: 'Highcharts Pyramid3D Chart'
    },
    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b> ({point.y:,.0f})',
                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                allowOverlap: true,
                align: 'left',
                y: 20,
                x: 80
            },
            width: '60%',
            height: '80%',
            center: ['50%', '45%']
        }
    },
    series: [{
        name: 'Unique users',
        data: [
            ['Website visits', 15654],
            ['Downloads', 4064],
            ['Requested price list', 1987],
            ['Invoice sent', 976],
            ['Finalized', 846]
        ]
    }]
});