Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    a11y: {
        chartDescriptionSection: {
            chartTitleFormat: '<h1>{chartTitle}</h1>'
        },
        headingLevel: 'h3'
    },
    title: {
        text: 'Sales of Electronic Devices in 2023'
    },
    xAxis: {
        categories: [
            'Laptops', 'Smartphones', 'Tablets', 'Smartwatches', 'Headphones'
        ]
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Units Sold'
        }
    },
    series: [{
        name: 'Sales',
        color: '#019CF9',
        data: [1500, 2500, 1200, 800, 1800]
    }]
});
