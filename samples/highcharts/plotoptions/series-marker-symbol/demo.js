$(function () {

    // Define a custom symbol path
    Highcharts.SVGRenderer.prototype.symbols.cross = function (x, y, w, h) {
        return ['M', x, y, 'L', x + w, y + h, 'M', x + w, y, 'L', x, y + h, 'z'];
    };
    if (Highcharts.VMLRenderer) {
        Highcharts.VMLRenderer.prototype.symbols.cross = Highcharts.SVGRenderer.prototype.symbols.cross;
    }


    $('#container').highcharts({
        
        title: {
            text: 'Demo of predefined, image and custom marker symbols'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        
        series: [{
            name: 'Predifined symbol',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 316.4, 294.1, 195.6, 154.4],
            marker: {
                symbol: 'triangle'
            }
        }, {
            name: 'Image symbol',
            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
            marker: {
                symbol: 'url(http://highcharts.com/demo/gfx/sun.png)'
            }
        }, {
            name: 'Custom symbol',
            data: [54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6],
            marker: {
                symbol: 'cross',
                lineColor: null, 
                lineWidth: 2
            }
        }]
    });
});