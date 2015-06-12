$(function () {

    // The speed gauge
    $('#container-speed').highcharts({

        chart: {
            type: 'solidgauge'
        },

        credits: {
            enabled: false
        },

        title: {
            text: 'Speed'
        },

        subtitle: {
            text: 'Individual point radius in Highcharts'
        },

        pane: {
            center: ['50%', '85%'],
            size: '140%',
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                innerRadius: '60%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },

        // the value axis
        yAxis: {
            stops: [
                [0.1, '#55BF3B'], // green
                [0.5, '#DDDF0D'], // yellow
                [0.9, '#DF5353'] // red
            ],
            lineWidth: 0,
            minorTickInterval: null,
            min: 0,
            max: 200,
            tickPixelInterval: 400,
            tickWidth: 0,
            labels: {
                y: 16
            }
        },

        series: [{
            name: 'Speed',
            data: [{
                name: 'First car',
                radius: 98,
                innerRadius: 82,
                y: 80
            }, {
                name: 'Second car',
                radius: 78,
                innerRadius: 62,
                y: 120
            }],
            dataLabels: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{point.name}: <b>{point.y}</b> km/h'
            }
        }]
    });


});