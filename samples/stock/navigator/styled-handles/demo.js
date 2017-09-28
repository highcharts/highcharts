// Define a custom symbol path
Highcharts.SVGRenderer.prototype.symbols.doublearrow = function (x, y, w, h) {
    return [
        // right arrow
        'M', x + w / 2 + 1, y,
        'L', x + w / 2 + 1, y + h,
        x + w + w / 2 + 1, y + h / 2,
        'Z',
        // left arrow
        'M', x + w / 2 - 1, y,
        'L', x + w / 2 - 1, y + h,
        x - w / 2 - 1, y + h / 2,
        'Z'
    ];
};
if (Highcharts.VMLRenderer) {
    Highcharts.VMLRenderer.prototype.symbols.doublearrow = Highcharts.SVGRenderer.prototype.symbols.doublearrow;
}

Highcharts.stockChart('container', {

    navigator: {
        handles: {
            symbols: ['doublearrow', 'doublearrow'],
            lineWidth: 1,
            width: 9,
            height: 17
        }
    },

    rangeSelector: {
        selected: 2
    },

    series: [{
        name: 'USDEUR',
        data: usdeur
    }]
});