Highcharts.chart('container', {

    chart: {
        type: 'gauge'
    },

    title: {
        text: 'Custom Pivot'
    },

    pane: {
        startAngle: -150,
        endAngle: 150,
        innerSize: '70%'
    },


    yAxis: {
        min: 0,
        max: 100,
        plotBands: [{
            from: 0,
            to: 60,
            color: 'lightgreen'
        }, {
            from: 60,
            to: 100,
            color: 'lightcoral'
        }],
        tickWidth: 0,
        minorTickWidth: 0
    },

    plotOptions: {
        gauge: {
            dataLabels: {
                // Render inside the pivot
                verticalAlign: 'middle',
                y: 0,
                zIndex: 3
            },
            dial: {
                radius: '60%',
                baseLength: '70%',
                baseWidth: '60%',
                backgroundColor: 'green',
                borderRadius: 0,
                topWidth: 0
            },
            pivot: {
                radius: '50%',
                borderWidth: 5,
                borderColor: 'green',
                backgroundColor: 'white'
            }
        }
    },


    series: [{
        data: [80]
    }]

});