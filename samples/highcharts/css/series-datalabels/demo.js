
Highcharts.chart('container', {

    title: {
        text: 'Styling data labels by CSS'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    plotOptions: {
        series: {
            dataLabels: {
                enabled: true,
                borderRadius: 2,
                y: -10,
                shape: 'callout'
            }
        }
    },

    series: [{
        data: [{
            y: 100,
            dataLabels: {
                align: 'right',
                rotation: 45,
                shape: null
            }
        }, {
            y: 300
        }, {
            y: 500,
            dataLabels: {
                className: 'highlight'
            }
        }, {
            y: 400
        }]
    }]

});