

/**
 * A Highcharts plugin to display the tooltip in a separate container outside the chart's
 * bounding box, so that it can utilize all space available in the page.
 */
(function (H) {

    var offset = 6;

    H.wrap(H.Tooltip.prototype, 'getLabel', function (proceed) {

        var chart = this.chart,
            options = this.options,
            chartRenderer = chart.renderer,
            container;

        if (!this.label) {

            // Add a HTML container, otherwise useHTML won't work
            this.container = container = H.doc.createElement('div');
            container.style.position = 'absolute';
            container.style.top = '-9999px';
            container.style.pointerEvents = 'none';

            H.doc.body.appendChild(container);

            this.renderer = new H.Renderer(this.container, 0, 0);
            chart.renderer = this.renderer;
            proceed.call(this, chart, options);
            chart.renderer = chartRenderer;

            this.label.attr({
                x: offset,
                y: offset
            });
            this.label.xSetter = function (value) {
                container.style.left = value + 'px';
            };
            this.label.ySetter = function (value) {
                container.style.top = value + 'px';
            };
        }
        return this.label;
    });

    H.wrap(
        H.Tooltip.prototype,
        'getPosition',
        function (proceed, boxWidth, boxHeight, point) {
            var chart = this.chart,
                pos,
                doc = H.doc,
                documentElement = doc.documentElement,
                plusWidth = documentElement.clientWidth - chart.chartWidth,
                plusHeight = Math.max(
                    doc.body.scrollHeight, documentElement.scrollHeight,
                    doc.body.offsetHeight, documentElement.offsetHeight,
                    documentElement.clientHeight
                ) - chart.chartHeight;

            point.plotX += this.chart.pointer.chartPosition.left;
            point.plotY += this.chart.pointer.chartPosition.top;

            // Temporary set the chart referece to a mock object, so that the
            // tooltip positioner picks it up
            this.chart = {
                // -24 to prevent scrollbars
                chartWidth: chart.chartWidth + plusWidth - 24,
                chartHeight: chart.chartHeight + plusHeight,
                plotWidth: chart.plotWidth + plusWidth,
                plotHeight: chart.plotHeight + plusHeight,
                plotTop: chart.plotTop - offset,
                plotLeft: chart.plotLeft - offset,
                inverted: chart.inverted
            };

            // Compute the tooltip position
            pos = proceed.call(this, boxWidth, boxHeight, point);

            // Reset chart reference
            this.chart = chart;

            return pos;
        }
    );

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
            label.width + (this.options.borderWidth || 0) + this.distance + offset,
            label.height + this.distance + offset,
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


Highcharts.chart('container1', {

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


Highcharts.chart('container2', {

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


Highcharts.chart('container3', {

    chart: {
        type: 'bar',
        borderWidth: 1
    },

    title: {
        text: 'useHTML = true'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr']
    },

    legend: {
        enabled: false
    },

    tooltip: {
        useHTML: true
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
