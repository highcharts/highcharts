$(function () {
    var perShapeGradient = {
        x1: 0,
        y1: 0,
        x2: 1,
        y2: 0
    };
    var colors = Highcharts.getOptions().colors;
    colors = [{
        linearGradient: perShapeGradient,
        stops: [
                [0, 'rgb(247, 111, 111)'],
                [1, 'rgb(220, 54, 54)']
        ]
    }, {
        linearGradient: perShapeGradient,
        stops: [
                [0, 'rgb(120, 202, 248)'],
                [1, 'rgb(46, 150, 208)']
        ]
    }, {
        linearGradient: perShapeGradient,
        stops: [
                [0, 'rgb(136, 219, 5)'],
                [1, 'rgb(112, 180, 5)']
        ] }
        ];

    $('#container').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text:'Gradients should be individual colors'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar']
        },

        series: [{
            name: name,
            data: [{
                y: 55.11,
                color: colors[0]
            }, {
                y: 21.63,
                color: colors[1]
            }, {
                y: 11.94,
                color: colors[2]
            }],
            color: 'white'
        }],
        legend: { enabled:false },
        yAxis: {
            min: 0,
            title: {
                text: null
            },
            stackLabels: {
                enabled: false
            }
        }
    });
});
