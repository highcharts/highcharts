

// Override the legend symbol creator function
Highcharts.wrap(Highcharts.Series.prototype, 'drawLegendSymbol', function (proceed, legend) {
    proceed.call(this, legend);

    this.legendLine.attr({
        d: ['M', 0, 10, 'L', 5, 5, 8, 10]
    });
    this.negativeLine = this.chart.renderer.path(
            ['M', 8, 10, 'L', 11, 15, 16, 10]
        ).attr({
            stroke: this.options.negativeColor,
            'stroke-width': this.options.lineWidth
        })
        .add(this.legendGroup);
});

// Create the chart
Highcharts.chart('container', {

    title: {
        text: 'Custom legend symbol'
    },

    series: [{
        data: [1, 3, -2, -4],
        color: 'red',
        negativeColor: 'lightblue',
        marker: {
            enabled: false
        }
    }]
});
