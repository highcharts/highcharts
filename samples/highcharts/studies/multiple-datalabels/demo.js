/**
 * A study of multiple data label definitions per point in Highcharts. This is
 * a requested feature that would be nice to have. In that case, TO DO:
 * - The array definition form and the legacy object form must be preserved all
 *   the way down the options inheritance chain: plotOptions.series.dataLabels,
 *   plotOptions[type].dataLabels, series.dataLabels and point.dataLabels.
 * - All references to point.dataLabel must be checked and kept for backwards
 *   compatibility. A new property, point.dataLabels, should hold the multiple
 *   labels.
 */

(function (H) {
    H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {

        H.each(H.splat(this.options.dataLabels), function (options, i) {

            // Store the data label in an array on the point
            H.each(this.points, function (point) {
                if (!H.isArray(point.dataLabels)) {
                    point.dataLabels = [];
                }

                point.dataLabels[i] = point.dataLabel;
                delete point.dataLabel;
            });

            // Run the original function with merged options
            this.options.dataLabels = H.merge(
                H.defaultOptions.plotOptions[this.type].dataLabels,
                options
            );
            proceed.call(this);

            // Restore the legacy pointer
            H.each(this.points, function (point) {
                point.dataLabel = point.dataLabels[i];
            });

        }, this);

    });
}(Highcharts));


Highcharts.chart('container', {
    title: {
        text: 'Study of multiple dataLabels per point in Highcharts'
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [
            ['Apples', 1],
            ['Pears', 4],
            ['Bananas', 3],
            ['Oranges', 5]
        ],
        color: '#871f78',
        type: 'bar',
        dataLabels: [{
            enabled: true,
            style: {
                fontSize: '16px'
            }
        }, {
            enabled: true,
            inside: true,
            align: 'right',
            format: '{point.name}',
            style: {
                fontSize: '16px',
                color: '#ffffff'
            }
        }]
    }]
});
