Highcharts.chart('container', {
    title: {
        text: 'Demo of various chart options'
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
    yAxis: {
        visible: true,
        lineColor: '#333333',
        lineWidth: 0
    }
});

// GUI components for demo purpose
DemoKit.setupArrayHandler(
    'title.align',
    '.highcharts-demo-button[data-path="title.align"]'
);
DemoKit.setupBooleanHandler(
    'yAxis.visible',
    'toggle-checkbox-yAxis-visible'
);
DemoKit.setupColorHandler(
    'yAxis.lineColor',
    'yAxis-lineColor',
    'yAxis-lineColor-opacity',
    'yAxis-lineColor-value'
);
DemoKit.setupNumberHandler(
    'yAxis.lineWidth',
    'range-input-yAxis-lineWidth',
    'range-value-yAxis-lineWidth'
);

DemoKit.updateOptionsPreview();
Highcharts.addEvent(
    Highcharts.Chart,
    'render',
    DemoKit.updateOptionsPreview
);