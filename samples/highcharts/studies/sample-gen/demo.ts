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
    xAxis: {
        visible: true,
        lineColor: '#333333',
        lineWidth: 5
    }
});

// GUI components for demo purpose
DemoKit.setupArrayHandler(
    'title.align',
    '.highcharts-demo-button[data-path="title.align"]'
);
DemoKit.setupBooleanHandler(
    'xAxis.visible',
    'toggle-checkbox-xAxis-visible', true
);
DemoKit.setupColorHandler(
    'xAxis.lineColor',
    'xAxis-lineColor',
    'xAxis-lineColor-opacity',
    'xAxis-lineColor-value', '#333333'
);
DemoKit.setupNumberHandler(
    'xAxis.lineWidth',
    'range-input-xAxis-lineWidth',
    'range-value-xAxis-lineWidth', 5
);

DemoKit.updateOptionsPreview();
Highcharts.addEvent(
    Highcharts.Chart,
    'render',
    DemoKit.updateOptionsPreview
);