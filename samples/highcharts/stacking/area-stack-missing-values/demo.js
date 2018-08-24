Highcharts.chart('container', {
    chart: {
        type: 'area'
    },
    title: {
        text: 'Percentage stacking with missing values (#1991)'
    },
    plotOptions: {
        area: {
            stacking: 'percent'
        }
    },

    series: [{
        data: [1, 1, 1, 1]
    }, {
        data: [2, 2]
    }, {
        data: [3, 3, 3, 3]
    }]

});
