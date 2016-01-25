jQuery(function () {
    QUnit.test('Hide label with useHTML', function (assert) {
        var chart = Highcharts.chart('container', {

            chart: {
                type: 'pie'
            },

            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true,
                        style: {
                            color: "blue",
                            "fontSize": "13px"
                        }
                    }
                }
            },

            series: [{
                data: [1, 2, 3, 4]
            }]

        });

        assert.ok(
            document.querySelector('#container .highcharts-data-labels g text').getAttribute('style').indexOf('fill:blue') > -1,
            'Blue text initially'
        );

        // Replace with exported SVG
        document.getElementById('output').innerHTML = chart.getSVGForExport({}, {
            plotOptions: {
                series: {
                    dataLabels: {
                        backgroundColor: '#bebebe',
                        style: {
                            "fontSize": "30px",
                            color: "red"
                        }
                    }
                }
            }
        });
        assert.ok(
            document.querySelector('#output .highcharts-data-labels g text').getAttribute('style').indexOf('fill:red') > -1,
            'Red text in export'
        );

    });
});