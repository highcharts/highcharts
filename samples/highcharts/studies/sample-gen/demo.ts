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
DemoKit.addControl({
    type: 'color',
    path: 'chart.backgroundColor',
    value: '#FFFFFF'
});
DemoKit.addControl({
    type: 'array-of-strings',
    path: 'title.align',
    value: 'center',
    options: ['left', 'center', 'right']
});
DemoKit.addControl({
    type: 'boolean',
    path: 'title.floating'
});
DemoKit.addControl({
    type: 'number',
    path: 'title.x',
    range: [-100, 100]
});

DemoKit.updateOptionsPreview();
Highcharts.addEvent(
    Highcharts.Chart,
    'render',
    DemoKit.updateOptionsPreview
);