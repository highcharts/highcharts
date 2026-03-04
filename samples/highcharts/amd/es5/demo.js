require.config({
    paths: {
        'highcharts/highcharts': 'https://code.highcharts.com/es5/highcharts',
        'highcharts/highcharts-more': 'https://code.highcharts.com/es5/highcharts-more',
        'highcharts/modules/solid-gauge': 'https://code.highcharts.com/es5/modules/solid-gauge',
        'highcharts/modules/exporting': 'https://code.highcharts.com/es5/modules/exporting'
    }
});

require(['highcharts/highcharts'], function (Highcharts) {
    require(['highcharts/highcharts-more'], function () {
        require([
            'highcharts/modules/exporting',
            'highcharts/modules/solid-gauge'
        ], function () {
            Highcharts.chart('container', {
                series: [{
                    data: [1, 2, 3, 4, 5],
                    type: 'solidgauge'
                }]
            });
        });
    });
});