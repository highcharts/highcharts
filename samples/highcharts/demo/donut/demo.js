Highcharts.chart('container', {
    chart: {
        type: 'pie',
        seriesGroupShadow: {
            color: 'var(--highcharts-neutral-color-100, #000000)'
        },
        backgroundColor: {
            linearGradient: { x1: 0, x2: 1, y1: 0, y2: 1 },
            stops: [[
                0,
                'color-mix(in srgb, var(--highcharts-color-2,' +
                    ' #4CAF50), transparent 60%)'
            ], [
                0.3,
                'color-mix(in srgb, var(--highcharts-neutral-color-10,' +
                    ' #e6e6e6), transparent 60%)'
            ], [
                0.7,
                'color-mix(in srgb, var(--highcharts-neutral-color-10,' +
                    ' #e6e6e6), transparent 60%)'
            ], [
                1,
                'color-mix(in srgb, var(--highcharts-color-7,' +
                    ' #E94E77), transparent 60%)'
            ]]
        }
    },

    title: {
        text: 'Charity allocations'
    },

    credits: {
        position: {
            align: 'left',
            x: 10
        },
        style: {
            color: 'var(--highcharts-neutral-color-60, #666666)'
        }
    },

    tooltip: {
        valueSuffix: '%'
    },

    series: [{
        name: 'Allocation',
        colors: [
            'var(--highcharts-color-2, #4CAF50)',
            'var(--highcharts-color-7, #E94E77)',
            'var(--highcharts-color-0, #5BC0EB)',
            'var(--highcharts-color-8, #FDE74C)',
            'var(--highcharts-color-3, #FFA07A)',
            'var(--highcharts-color-4, #A9A9A9)'
        ],
        borderWidth: 5,
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
