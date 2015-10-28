(function ($) {

    /**
     * Create the chart
     * @returns {undefined}
     */
    function addChart() {
        $('#container').highcharts({
            title: {
                text: 'This chart is injected from a crossdomain JS file'
            },
            series: [{
                data: [1, 3, 2, 4]
            }]
        });
    }


    // Below this line is functionality to load scripts and apply the chart
    if (!$) {
        return;
    }

    if (typeof Highcharts === 'undefined') {
        $.getScript('//code.highcharts.com/highcharts.js', addChart);
    } else {
        addChart();
    }

}(window.jQuery));
