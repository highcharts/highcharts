$(function () {

    $('#container').highcharts({

        chart: {
            type: 'gauge'
        },

        title: {
            text: 'Speedometer'
        },
        subtitle: {
            text: 'Arcs were inside out'
        },

        pane: {
            center: ['50%', '15%'],
            size: '140%',
            startAngle: 90,
            endAngle: 270,
            tickInterval: 40,
            background: {
                innerRadius: '0%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 200,
            reversed: true,
            plotBands: [{
                from: 0,
                to: 120,
                color: '#55BF3B' // green
            }, {
                from: 120,
                to: 160,
                color: '#DDDF0D' // yellow
            }, {
                from: 160,
                to: 200,
                color: '#DF5353' // red
            }]
        },

        series: [{
            data: [80]
        }]

    });
});