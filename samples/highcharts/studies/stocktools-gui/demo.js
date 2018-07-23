Highcharts.stockChart('container', {
    series: [{
        // line
        showPrice: {
            enabled: true,
            color: 'red'
        },
        // label
        priceIndicator: {
            enabled: true,
            label: {
                enabled: true
            }
        },
        data: [1, 3, 3, 4, 3, 2]
    }]
});
