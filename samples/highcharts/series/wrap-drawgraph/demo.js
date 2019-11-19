(function (H) {
    H.wrap(H.Series.prototype, 'drawGraph', function (proceed) {

        // Before the original function
        console.log("We are about to draw the graph:", typeof this.graph);

        // Now apply the original function with the original arguments,
        // which are sliced off this function's arguments
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

        // Add some code after the original function
        console.log("We just finished drawing the graph:", typeof this.graph);

    });
}(Highcharts));

Highcharts.chart({

    chart: {
        renderTo: 'container'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]

});