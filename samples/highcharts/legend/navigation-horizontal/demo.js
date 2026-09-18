Highcharts.chart('container', {

    title: {
        text: 'Horizontal legend navigation'
    },

    accessibility: {
        description: 'A column chart with more series than fit on one line ' +
            'of the legend. The legend items are kept on a single line and ' +
            'paged sideways with the arrows beside them.'
    },

    xAxis: {
        categories: ['Q1', 'Q2', 'Q3', 'Q4']
    },

    yAxis: {
        title: {
            text: 'Revenue (MUSD)'
        }
    },

    legend: {
        verticalAlign: 'top',
        navigation: {
            direction: 'horizontal'
        }
    },

    series: [
        'Amsterdam', 'Berlin', 'Copenhagen', 'Dublin', 'Edinburgh',
        'Frankfurt', 'Gothenburg', 'Helsinki', 'Istanbul', 'Jerusalem'
    ].map((name, i) => ({
        type: 'column',
        name,
        data: [12 + i, 15 - i, 9 + i, 18 - i]
    }))

});
