$(function () {

    /**
     * A small Highcharts snippet/plugin for adding images to axis labels
     */
    (function (H) {
        function addImages(proceed) {

            proceed.call(this);

            var chart = this,
                axis = chart.xAxis[0],
                images = axis.options.images;
            H.each(axis.tickPositions, function (pos) {
                var tick = axis.ticks[pos],
                    x,
                    y;
                if (images[pos]) {
                    x = axis.toPixels(pos) - 40;
                    y = chart.plotTop + chart.plotHeight + 0;
                    if (!tick.image) {
                        tick.image = chart.renderer.image(images[pos], x, y, 32, 32)
                        .add();
                    } else { // Update existing
                        tick.image.animate({
                            x: x,
                            y: y
                        });
                    }
                }
            });
        }

        H.wrap(H.Chart.prototype, 'render', addImages);
        H.wrap(H.Chart.prototype, 'redraw', addImages);
    }(Highcharts));



    $('#container').highcharts({

        title: {
            text: 'Highcharts snippet to add images to axis labels'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar'],
            images: [
                'https://www.highcharts.com/samples/graphics/sun.png',
                'https://www.highcharts.com/samples/graphics/snow.png',
                'https://www.highcharts.com/samples/graphics/sun.png'
            ],
            labels: {
                x: 16
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]

    });
});
