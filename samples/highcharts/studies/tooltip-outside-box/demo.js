$(function () {

    /**
     * A Highcharts plugin to display the tooltip in a separate container outside the chart's
     * bounding box, so that it can utilize all space available in the page.
     */
    (function (H) {
        H.wrap(H.Tooltip.prototype, 'init', function (proceed, chart, options) {

            var chartRenderer = chart.renderer,
                box;

            if (!this.renderer) {
                this.renderer = new H.Renderer(document.body, 400, 60);
                box = this.renderer.boxWrapper;
                box.css({
                    position: 'absolute',
                    top: '-9999px'
                });
            }
            chart.renderer = this.renderer;
            proceed.call(this, chart, options);
            chart.renderer = chartRenderer;

            this.label.attr({
                x: 0,
                y: 0
            });
            this.label.xSetter = function (value) {
                box.element.style.left = value + 'px';
            };
            this.label.ySetter = function (value) {
                box.element.style.top = value + 'px';
            };
        });

        H.wrap(H.Tooltip.prototype, 'getPosition', function (proceed, boxWidth, boxHeight, point) {
            var chart = this.chart,
                chartWidth = chart.chartWidth,
                chartHeight = chart.chartHeight,
                pos;
            point.plotX += this.chart.pointer.chartPosition.left;
            point.plotY += this.chart.pointer.chartPosition.top;

            // Temporary set the chart size to the full document, so that the tooltip positioner picks it up
            chart.chartWidth = $(document).width();
            chart.chartHeight = $(document).height();

            // Compute the tooltip position
            pos = proceed.call(this, boxWidth, boxHeight, point);

            // Reset chart size
            chart.chartWidth = chartWidth;
            chart.chartHeight = chartHeight;

            return pos;
        });

        /**
         * Find the new position and perform the move
         */
        /* Problem: anchor is offset from point
        H.Tooltip.prototype.updatePosition = function (point) {
            var chart = this.chart,
                label = this.label,
                pos = (this.options.positioner || this.getPosition).call(
                    this,
                    label.width,
                    label.height,
                    point
                );

            // do the move
            this.move(
                Math.round(pos.x),
                Math.round(pos.y || 0), // can be undefined (#3977)
                point.plotX + chart.plotLeft - chart.pointer.chartPosition.left,
                point.plotY + chart.plotTop - chart.pointer.chartPosition.top
            );
        };
        */

    }(Highcharts));


    $('#container').highcharts({

        chart: {
            type: 'column',
            borderWidth: 1
        },

        title: {
            text: 'Tooltip outside the box'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr']
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Really, really long series name 1',
            data: [1,4,2,3]
        }, {
            name: 'Really, really long series name 2',
            data: [4,2,5,3]
        }, {
            name: 'Really, really long series name 2',
            data: [6,5,3,1]
        }, {
            name: 'Really, really long series name 2',
            data: [6,4,2,1]
        }]

    });
});
