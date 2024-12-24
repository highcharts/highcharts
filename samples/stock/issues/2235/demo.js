Highcharts.chart('container', {

    title: {
        text: 'Regression since 3.0.3 caused gap not to apply'
    },

    series: [{
        data: [
            ['2013-09-01', 1],
            ['2013-09-02', 1],
            // gap
            ['2013-09-04', 1],
            ['2013-09-05', 1]
        ],
        gapSize: 1,
        type: 'area'
    }],

    xAxis: {
        ordinal: false,
        type: 'datetime'
    }
});
