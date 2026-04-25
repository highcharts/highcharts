/* eslint-disable node/no-extraneous-require */
// @TODO: Remove this eslint-disable once highcharts/connectors-morningstar#179
// is merged and released.

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
                chart: {
                    type: 'solidgauge'
                },

                title: {
                    text: 'Solid gauge with require'
                },

                pane: {
                    startAngle: -90,
                    endAngle: 90,
                    background: {
                        innerRadius: '60%',
                        outerRadius: '100%',
                        shape: 'arc'
                    }
                },

                yAxis: {
                    min: 0,
                    max: 100
                },

                series: [{
                    data: [38]
                }]
            });
        });
    });
});