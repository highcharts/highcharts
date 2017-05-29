
Highcharts.error = function (code) {
    // See https://github.com/highcharts/highcharts/blob/master/errors/errors.xml
    // for error id's
    Highcharts.charts[0].renderer
        .text('Chart error ' + code)
        .attr({
            fill: 'red',
            zIndex: 20
        })
        .add()
        .align({
            align: 'center',
            verticalAlign: 'middle'
        }, null, 'plotBox');
};


Highcharts.chart('container', {

    title: {
        text: 'Demo of Highcharts error handling'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May']
    },

    yAxis: {
        type: 'logarithmic',
        min: 0
    },

    series: [{
        data: [1, 3, 2, -4, 3],
        type: 'column'
    }]

});
