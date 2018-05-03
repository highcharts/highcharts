QUnit.test('Item width after update. #6646', function (assert) {

    var chart = Highcharts.chart('container', {
        chart: {
            marginLeft: 300
        },

        legend: {
            floating: true,
            layout: 'horizontal',
            align: 'left',
            verticalAlign: 'top',
            x: 0,
            y: 25,
            padding: 5,
            width: 300,
            border: '1px',
            itemWidth: 130,
            itemStyle: {
                width: '85px',
                color: '#707070',
                'font-family': 'Arial',
                'font-weight': 'normal',
                'font-size': '14px'
            },
            labelFormatter: function () {
                return '<span class="label-text">' + this.name + '</span>';
            },
            itemMarginTop: 5,
            title: {
                text: 'Metrics for graph',
                color: '#333333'
            },
            useHTML: true
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            name: 'A little longer name for two lines',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            name: 'short',
            data: [95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1]
        }, {
            name: 'just a name',
            data: [95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1]
        }]
    }, function (chart) {

        $(".highcharts-legend .highcharts-series-0 span")
          .trigger('mouseover')
          .trigger('mouseout');


        for (var i = chart.series.length - 1; i > -1; i--) {
            chart.series[i].remove();
        }

        chart.addSeries({
            name: 'new series longer name',
            data: [194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]
        });
        chart.addSeries({
            name: 'just a name',
            data: [95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1]
        });

    });

    assert.strictEqual(
        chart.legend.itemStyle.width,
        '85px',
        'Width is applied.'
    );

});