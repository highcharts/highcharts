Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Stacked and grouped columns'
    },

    subtitle: {
        text: 'With null points and <em>centerInCategory</em>'
    },

    xAxis: {
        categories: ['One', 'Two', 'Three', 'Four', 'Five']
    },

    plotOptions: {
        column: {
            centerInCategory: true,
            stacking: 'normal'
        }
    },

    series: [
        // first stack
        {
            data: [29.9, null, 106.4, 129.2, 144.0],
            stack: 0
        }, {
            data: [30, null, 135.6, 148.5, 216.4],
            stack: 0
        // second stack
        }, {
            data: [106.4, 129.2, 144.0, null, 71.5],
            stack: 1
        }, {
            data: [148.5, 216.4, 30, null, 135.6],
            stack: 1
        }
    ]
});