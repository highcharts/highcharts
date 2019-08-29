(function (H) {
    // Horizontally align the legend to the X axis by temporarily
    // redefining the spacing box
    H.addEvent(H.Chart, 'render', function () {
        const originalSpacingBox = this.spacingBox;
        const originalGlobalAnimation = this.renderer.globalAnimation;

        // Replace it with a copy
        this.spacingBox = H.merge(
            this.spacingBox,
            { x: this.plotLeft, width: this.plotWidth }
        );

        if (!this.legend.placed) {
            this.renderer.globalAnimation = false;
        }
        this.legend.render();
        this.legend.placed = true;

        // Reset
        this.renderer.globalAnimation = originalGlobalAnimation;
        this.spacingBox = originalSpacingBox;
    });
}(Highcharts));


Highcharts.chart('container', {
    chart: {
        borderWidth: 1
    },
    title: {
        text: 'Legend aligned to the X axis'
    },
    legend: {
        borderWidth: 1
    },
    xAxis: {
        categories: ['Apples', 'Pears', 'Bananas', 'Oranges'],
        title: {
            text: 'X axis'
        }
    },
    series: [{
        data: [1, 4, 3, 5],
        type: 'column'
    }]
});
