Highcharts.chart('container', {
    chart: {
        type: 'pie'
    },

    title: {
        text: 'Charity allocations'
    },

    tooltip: {
        valueSuffix: '%'
    },

    series: [{
        name: 'Allocation',
        borderRadius: 8, // Rounded slice corners
        innerSize: '60%', // Turning the pie into a donut
        // We can show multiple data labels per point
        dataLabels: [{
            format: '{point.name}'
        }, {
            format: '{point.percentage:.0f}%',
            distance: -25 // Placing the label inside
        }],
        data: [
            ['Health care', 34],
            ['Education', 27],
            ['Youth programmes', 22],
            ['Poverty measures', 8],
            ['Elderly care', 6],
            ['Other', 3]
        ]
    }]
});
