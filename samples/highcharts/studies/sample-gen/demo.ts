Highcharts.chart('container', {
    title: {
        text: 'Demo of various chart options',
        align: 'center'
    },
    series: [
        {
            type: 'column',
            data: [
                1,
                3,
                2,
                4
            ],
            colorByPoint: true
        }
    ],
    chart: {
        backgroundColor: '#FFFFFF'
    }
});

// GUI components for demo purpose
HighchartsControls.addControl({
    type: 'color',
    path: 'chart.backgroundColor',
    value: '#FFFFFF'
});
HighchartsControls.addControl({
    type: 'array-of-strings',
    path: 'title.align',
    value: 'center',
    options: ['left', 'center', 'right']
});
HighchartsControls.addControl({
    type: 'boolean',
    path: 'title.floating'
});
HighchartsControls.addControl({
    type: 'number',
    path: 'title.x',
    range: [-100, 100]
});

HighchartsControls.updateOptionsPreview();
Highcharts.addEvent(
    Highcharts.Chart,
    'render',
    HighchartsControls.updateOptionsPreview
);