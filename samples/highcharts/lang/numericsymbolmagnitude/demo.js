

Highcharts.setOptions({
    lang: {
        numericSymbols: ['万', '億'],
        numericSymbolMagnitude: 10000
    }
});

Highcharts.chart('container', {

    title: {
        text: 'Numeric symbols magnitude'
    },

    subtitle: {
        text: 'Japanese uses ten thousands (万) as numeric symbol'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [2990, 7150, 10640, 12920, 14400, 17600,
            13560, 14850, 21640, 19410, 9560, 5440],
        type: 'column'
    }]

});
