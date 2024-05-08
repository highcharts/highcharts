Highcharts.setOptions({
    global: {
        buttonTheme: {
            fill: '#333333',
            stroke: '#000000',
            style: {
                color: '#ffffff'
            },
            states: {
                hover: {
                    fill: '#666666',
                    style: {
                        color: '#00ffff'
                    }
                }
            }
        }
    }
});

const chart = Highcharts.chart('container', {

    title: {
        text: 'Global button theme'
    },

    series: [{
        data: [1, 3, 2, 4]
    }]
});

chart.renderer
    .button(
        'General button',
        100,
        90,
        () => console.log('Button clicked')
    )
    .attr({
        zIndex: 10
    })
    .add();
