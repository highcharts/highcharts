Highcharts.setOptions({

    lang: {
        decimalPoint: ',',
        thousandsSep: ' '
    }

});

Highcharts.chart('container', {

    chart: {
        renderTo: 'container'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    tooltip: {
        pointFormat: 'Value: {point.y:,.1f} mm'
    },

    series: [{
        data: [1029.9, 1071.5, 1106.4, 1129.2, 1144.0, 1176.0, 1135.6, 1148.5,
            1216.4, 1194.1, 1095.6, 1054.4]
    }]

});