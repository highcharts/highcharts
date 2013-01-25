$(function () {
    var chart = new Highcharts.Chart({

        chart: {
            renderTo: 'container'
        },

        title: {
            text: 'Custom tick positions'
        },

        subtitle: {
            text: 'through axis.tickPositions and axis.tickPositioner'
        },

        xAxis: {
            tickPositions: [0, 1, 2, 4, 8]
        },

        yAxis: {
            tickPositioner: function (min, max) {
                var positions = [],
                    tick = Math.floor(min),
                    increment = Math.ceil((max - min) / 6);

                for (; tick - increment <= max; tick += increment) {
                    positions.push(tick);
                }
                return positions;
            }
        },
        
        series: [{
            data: [
                [0, 1],
                [1, 3],
                [2, 2],
                [4, 4],
                [8, 3]
            ]
        }]
    });
});