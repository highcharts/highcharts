

/**
 * A small Highcharts snippet/plugin for adding images to axis labels
 */
(function (H) {
    var iconSize = 32;

    H.wrap(H.Tick.prototype, 'renderLabel', function addImages(proceed) {

        proceed.apply(this, [].slice.call(arguments, 1));

        var tick = this,
            axis = this.axis,
            image = axis.options.images && axis.options.images[this.pos],
            xy = this.label && this.label.xy;

        if (image && xy) {

            // xy is bottom center of the label. Put the image to the left.
            xy.x -= this.label.getBBox().width / 2 + iconSize + 10;
            xy.y -= (iconSize + this.label.getBBox().height) / 2;

            if (!tick.image) {
                tick.image = axis.chart.renderer.image(image, xy.x, xy.y, iconSize, iconSize)
                    .add();
            } else { // Update existing
                tick.image.animate({
                    x: xy.x,
                    y: xy.y
                });
            }

        }
    });
}(Highcharts));



Highcharts.chart('container', {

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
