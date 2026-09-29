// The speed gauge
Highcharts.chart('container', {

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
        startAngle: -90,
        endAngle: 90,
        background: {
            innerRadius: '60%'
        }
    },

    // the value axis
    yAxis: {
        stops: [
            [0.1, '#55BF3B'], // green
            [0.5, '#DDDF0D'], // yellow
            [0.9, '#DF5353'] // red
        ],
        min: 0,
        max: 200,
        tickAmount: 2,
        labels: {
            y: 16,
            distance: -45
        }
    },

    series: [{
        name: 'Speed',
        data: [{
            name: 'First car',
            radius: '98%',
            innerRadius: '82%',
            y: 80
        }, {
            name: 'Second car',
            radius: '78%',
            innerRadius: '62%',
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
