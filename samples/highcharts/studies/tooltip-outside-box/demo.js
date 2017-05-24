

/**
 * A Highcharts plugin to display the tooltip in a separate container outside the chart's
 * bounding box, so that it can utilize all space available in the page.
 */
(function (H) {
    H.wrap(H.Tooltip.prototype, 'getLabel', function (proceed) {

        var chart = this.chart,
            options = this.options,
            chartRenderer = chart.renderer,
            box;

        if (!this.label) {

            this.renderer = new H.Renderer(document.body, 0, 0);
            box = this.renderer.boxWrapper;
            box.css({
                position: 'absolute',
                top: '-9999px'
            });
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
        }
        return this.label;
    });

    H.wrap(H.Tooltip.prototype, 'getPosition', function (proceed, boxWidth, boxHeight, point) {
        var chart = this.chart,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            pos;
        point.plotX += this.chart.pointer.chartPosition.left;
        point.plotY += this.chart.pointer.chartPosition.top;

        // Temporary set the chart size to the full document, so that the tooltip positioner picks it up
        chart.chartWidth = $(window).width();
        chart.chartHeight = $(window).height();

        // Compute the tooltip position
        pos = proceed.call(this, boxWidth, boxHeight, point);

        // Reset chart size
        chart.chartWidth = chartWidth;
        chart.chartHeight = chartHeight;

        return pos;
    });

    /**
     * Find the new position and perform the move. This override is identical
     * to the core function, except the anchorX and anchorY arguments to move().
     */
    H.Tooltip.prototype.updatePosition = function (point) {
        var chart = this.chart,
            label = this.label,
            pos = (this.options.positioner || this.getPosition).call(
                this,
                label.width,
                label.height,
                point
            );

        // Set the renderer size dynamically to prevent document size to change
        this.renderer.setSize(
            label.width + (this.options.borderWidth || 0),
            label.height + this.distance,
            false
        );

        // do the move
        this.move(
            Math.round(pos.x),
            Math.round(pos.y || 0), // can be undefined (#3977)
            point.plotX + chart.plotLeft - pos.x,
            point.plotY + chart.plotTop - pos.y
        );
    };

}(Highcharts));


$('#container1').highcharts({

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
        data: [1, 4, 2, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [4, 2, 5, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 5, 3, 1]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 4, 2, 1]
    }]

});


$('#container2').highcharts({

    chart: {
        type: 'line',
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
        data: [1, 4, 2, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [4, 2, 5, 3]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 5, 3, 1]
    }, {
        name: 'Really, really long series name 2',
        data: [6, 4, 2, 1]
    }]

});
