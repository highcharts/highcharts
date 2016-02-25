$(function () {

    /**
     * A Highcharts plugin to display the tooltip in a separate container outside the chart's
     * bounding box, so that it can utilize all space available in the page.
     */
    (function (H) {
        H.wrap(H.Tooltip.prototype, 'init', function (proceed, chart, options) {

            var chartRenderer = chart.renderer;

            if (!this.renderer) {
                var div = this.div = document.createElement('div');
                this.div.style.position = 'absolute';
                this.div.style.left = 0;
                this.div.style.top = 0;
                document.body.appendChild(this.div);
                var ren = this.renderer = new H.Renderer(this.div, 400, 60);
            }
            chart.renderer = this.renderer;
            proceed.call(this, chart, options);
            chart.renderer = chartRenderer;

            this.label.attr({
                x: 0,
                y: 0
            });
            this.label.xSetter = function (value) {
                div.style.left = value + 'px';
            };
            this.label.ySetter = function (value) {
                div.style.top = value + 'px';
            };
        });

        H.wrap(H.Tooltip.prototype, 'getPosition', function (proceed, boxWidth, boxHeight, point) {
            var chart = this.chart,
                chartWidth = chart.chartWidth,
                chartHeight = chart.chartHeight,
                pos;
            point.plotX += this.chart.pointer.chartPosition.left;
            point.plotY += this.chart.pointer.chartPosition.top;
            chart.chartWidth = $(document).width();
            chart.chartHeight = $(document).height();
            pos = proceed.call(this, boxWidth, boxHeight, point);
            chart.chartWidth = chartWidth;
            chart.chartHeight = chartHeight;
            return pos;
        });

    }(Highcharts));


    $('#container').highcharts({

        chart: {
            type: 'column',
            borderWidth: 1
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
