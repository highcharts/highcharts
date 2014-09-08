$(function () {

    $('#container').highcharts({

        chart: {
            type: 'gauge'
        },

        pane: {
            startAngle: -150,
            endAngle: 150
        },


        yAxis: {
            min: 0,
            max: 100
        },

        plotOptions: {
            gauge: {
                pivot: {
                    radius: 10,
                    borderWidth: 1,
                    borderColor: 'gray',
                    backgroundColor: {
                        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
                        stops: [
                            [0, 'white'],
                            [1, 'gray']
                        ]
                    }
                }
            }
        },


        series: [{
            data: [80]
        }]

    });
});