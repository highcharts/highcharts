(async () => {
    const usdeur = await fetch(
        'https://www.highcharts.com/samples/data/usdeur.json'
    ).then(response => response.json());

    // Define a custom symbol path for custom navigator handles
    Highcharts.SVGRenderer.prototype.symbols.doublearrow = function (
        x, y, w, h
    ) {
        return [
        // right arrow
            'M', x + w / 2, y,
            'L', x + w / 2, y + h,
            x + w + w / 2, y + h / 2,
            'Z',
            // left arrow
            'M', x + w / 2, y,
            'L', x + w / 2, y + h,
            x - w / 2, y + h / 2,
            'Z'
        ];
    };

    const navigator = Highcharts.navigator('navigator-container', {
        handles: {
            symbols: ['doublearrow', 'doublearrow'],
            backgroundColor: '#666',
            borderColor: '#AAA'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(180,180,255,0.2)',
        xAxis: {
            gridLineColor: '#505053'
        },
        series: [{
            color: '#7798BF',
            lineColor: '#A6C7ED',
            data: usdeur
        }]
    });

    const chart = Highcharts.chart('chart-container', {
        xAxis: {
            type: 'datetime'
        },

        series: [{
            name: 'USD to EUR',
            data: usdeur
        }]
    });

    navigator.bind(chart);
})();