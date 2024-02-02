Highcharts.chart('container', {
    chart: {
        type: 'spline',
        events: {
            // Add colorful backgrounds and labels
            load() {
                const {
                    renderer,
                    plotLeft,
                    plotTop,
                    plotHeight,
                    plotWidth
                } = this;

                // Lagging
                renderer.rect(
                    plotLeft,
                    plotTop + plotHeight / 2,
                    plotWidth / 2,
                    plotHeight / 2
                ).attr({
                    fill: 'rgba(255, 0, 0, 0.1)',
                    zIndex: 0
                }).add();
                renderer.text(
                    'Lagging',
                    plotLeft,
                    plotTop + plotHeight - 5
                ).attr({
                    fill: '#ff0000'
                }).add();

                // Improving
                renderer.rect(
                    plotLeft,
                    plotTop,
                    plotWidth / 2,
                    plotHeight / 2
                ).attr({
                    fill: 'rgba(0, 0, 255, 0.1)',
                    zIndex: 0
                }).add();
                renderer.text(
                    'Improving',
                    plotLeft,
                    plotTop + 14
                ).attr({
                    fill: '#0000ff'
                }).add();

                // Leading
                renderer.rect(
                    plotLeft + plotWidth / 2,
                    plotTop,
                    plotWidth / 2,
                    plotHeight / 2
                ).attr({
                    fill: 'rgba(0, 255, 0, 0.1)',
                    zIndex: 0
                }).add();
                renderer.text(
                    'Leading',
                    plotWidth + 14,
                    plotTop + 14
                ).attr({
                    fill: '#00ff00'
                }).add();

                // Weakening
                renderer.rect(
                    plotLeft + (plotWidth / 2),
                    plotTop + plotHeight / 2,
                    plotWidth / 2,
                    plotHeight / 2
                ).attr({
                    fill: 'rgba(255, 255, 0, 0.1)',
                    zIndex: 0
                }).add();
                renderer.text(
                    'Weakening',
                    plotWidth - 9,
                    plotTop + plotHeight - 5
                ).attr({
                    fill: '#ffc600'
                }).add();
            }
        }
    },
    title: {
        text: 'Relative Rotational Graph'
    },
    plotOptions: {
        series: {
            findNearestPointBy: 'xy',
            lineWidth: 2,
            marker: {
                enabled: true,
                radius: 3,
                symbol: 'circle'
            }
        }
    },
    xAxis: {
        min: 96,
        max: 104,
        plotLines: [{
            value: 100,
            width: 2,
            color: '#000000'
        }],
        title: {
            text: 'JdK RS-Ratio'
        },
        gridLineWidth: 1
    },
    yAxis: {
        min: 96,
        max: 104,
        plotLines: [{
            value: 100,
            width: 2,
            color: '#000000'
        }],
        title: {
            text: 'JdK RS-Momentum'
        }
    },
    series: [{
        name: 'Stock 1',
        data: [
            [102, 102],
            [102.25, 101.5],
            [102.5, 101],
            [102.875, 99.5],
            [102.625, 98.25],
            [102.375, 97.875],
            [101.75, 98],
            [101.375, 98]
        ]
    }, {
        name: 'Stock 2',
        data: [
            [101.8, 98.3],
            [101.4, 97.5],
            [100.6, 97.25],
            [99.9, 97.625],
            [99.9, 98.5],
            [99.8, 99.75],
            [99.8, 100],
            [99.9, 102],
            [100, 102.5],
            [100.3, 101]
        ]
    }, {
        name: 'Stock 3',
        data: [
            [97.2, 96.5],
            [97.1, 98],
            [97, 99],
            [97, 99.5],
            [97.05, 100],
            [97.1, 100.5],
            [97.15, 100.8],
            [97.2, 101.3],
            [97.3, 102],
            [97.4, 102.5],
            [97.5, 103],
            [97.45, 102],
            [97.4, 101.5],
            [97.35, 100.5],
            [97.3, 100],
            [97.3, 99],
            [97.35, 98]

        ]
    }, {
        name: 'Stock 4',
        data: [
            [98.5, 98.5],
            [98.7, 99],
            [99, 99.3],
            [99.3, 100],
            [99.5, 100.5],
            [100, 101.3],
            [100.5, 101.8],
            [101.3, 103]
        ]
    }]
});
