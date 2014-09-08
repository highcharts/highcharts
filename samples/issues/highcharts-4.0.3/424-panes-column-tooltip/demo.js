jQuery(function () {
    jQuery('#container').highcharts({
        title: {
            text: 'Wrong tooltip pos for column'
        },
        yAxis: [{
            title: {
                text: 'Exchange rate 1'
            },
            height: '40%',
            lineWidth: 2
        }, {
            title: {
                text: 'Exchange rate 2'
            },
            top: '50%',
            height: '50%',
            offset: 0,
            lineWidth: 2
        }],

        series: [{
            name: 'USD to EUR',
            data: [1, 2, 3, 4, 5]
        }, {
            name: 'USD to EUR',
            data: [234, 234, 124, 3546],
            yAxis: 1,
            type: 'column'
        }]
    });
});