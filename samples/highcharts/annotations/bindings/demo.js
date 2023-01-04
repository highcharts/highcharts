Highcharts.chart('container', {
    navigation: {
        // Informs chart about the HTML elements responsible for adding annotations etc.
        bindingsClassName: 'tools-container'
    },
    series: [{
        data: [2, 5, 1, 6, 7, 8, 5]
    }]
});
