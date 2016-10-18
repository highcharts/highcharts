$(function () {
    $('#container').highcharts({
        chart: {
            type: 'areasplinerange'
        },

        title: {
            text: 'Area spline range fill issue'
        },

        series: [{
            data: [
                [1, 2],
                [1, 3],
                [1, 2]
            ],
            lineColor: 'black'
        }]

    });

});
