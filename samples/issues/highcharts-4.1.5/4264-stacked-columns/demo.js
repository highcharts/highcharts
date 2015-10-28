$(function () {
    QUnit.test('Column outside plot area', function (assert) {
        var chart;

        $('#container').highcharts({
            chart: {
                type: 'column',
                zoomType: 'xy'
            },
            title: {
                text: 'Historic World Population by Region'
            },
            subtitle: {
                text: 'Source: Wikipedia.org'
            },
            xAxis: {
                categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania', 'a', 'b', 'c'],
                title: {
                    text: null
                },
                min: 0
            },
            yAxis: {
                min: -290,
                max: -230,
                title: {
                    text: 'Population (millions)',
                    align: 'high'
                },
                labels: {
                    overflow: 'justify'
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    animation: false
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                shadow: true
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Year 1800',
                data: [107, -31, 63]
            }, {
                name: 'Year 1900',
                data: [133, -156, 97]
            }, {
                name: 'Year 2008',
                data: [-97, -91, 44]
            }]
        });

        chart = $('#container').highcharts();


        assert.equal(
            chart.series[0].points[0].graphic.attr('y') + chart.series[0].points[0].graphic.attr('height') < 0,
            true,
            'Column is above plot area'
        );

    });

});