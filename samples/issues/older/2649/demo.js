$(function () {

    $('#container').highcharts({

        chart: {
            type: 'gauge',

            height: 200
        },


        series: [{
            data: [-20],
            yAxis: 0
        }, {
            data: [-20],
            yAxis: 1
        }],

        yAxis: [{
            id: 'blue-axis',
            min: -20,
            max: 6,
            pane: 0,
            title: {
                text: 'Should be blue',
                y: -40
            }
        }, {
            id: 'red-axis',
            min: -20,
            max: 6,
            pane: 1,
            title: {
                text: 'Should be red',
                y: -40
            }
        }],

        pane: [{
            startAngle: -45,
            endAngle: 45,
            background: {
                backgroundColor: 'blue'
            },
            center: ['25%', '50%']
        }, {
            background: {
                backgroundColor: 'red'
            },
            startAngle: -45,
            endAngle: 45,

            center: ['75%', '50%']
        }],



        plotOptions: {
            gauge: {

                dial: {
                    radius: '100%'
                }
            }
        }

    });
});