Highcharts.chart('container', {
    chart: {
        type: 'pie',
        backgroundColor: '#222'
    },

    title: {
        text: 'Charity allocations',
        style: {
            color: '#fff'
        }
    },

    colors: ['#4CAF50', '#E94E77', '#5BC0EB', '#FDE74C', '#FFA07A', '#A9A9A9'],

    tooltip: {
        valueSuffix: '%'
    },

    series: [{
        name: 'Allocation',
        colorByPoint: true,
        borderColor: '#222',
        borderWidth: 3,
        borderRadius: 8, // Rounded slice corners
        innerSize: '60%', // Turning the pie into a donut
        dataLabels: {
            format: '{point.name}: {point.percentage:.0f}%'
        },
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
