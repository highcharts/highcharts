
$(function () {
    QUnit.test("Change of label alignment after add", function (assert) {
        var chart,
            options = {
                chart: {
                    type: 'columnrange'
                },
                yAxis: {
                    min: -20,
                    max: 20
                },
                plotOptions: {
                    columnrange: {
                        //cropThreshold: Number.MAX_VALUE,
                        dataLabels: {
                            //allowOverlap: true,
                            //crop: false,
                            //overflow: 'none',
                            enabled: true,
                            inside: true
                        }
                    }
                },
                series: [{
                    data: [
                        [-10, 40],
                        [-15, 15],
                        [-30, 10],
                        [-20.1, 20.1],
                        [-25, 25],
                        [-125, 125]
                    ]
                }]
            };

        function allLabelsVisible(chart) {

            var allVis = true;

            chart.series[0].points.forEach(function (point) {
                if (point.dataLabelUpper.attr('y') < -10 || point.dataLabel.attr('y') < -10) {
                    allVis = false;
                }
            });

            return allVis;
        }



        chart = $('#container').highcharts(options).highcharts();
        assert.equal(
            allLabelsVisible(chart),
            true,
            'All labels are visible'
        );


        options.chart.inverted = true;
        chart = $('#container').highcharts(options).highcharts();
        assert.equal(
            allLabelsVisible(chart),
            true,
            'All labels are visible when inverted'
        );


    });
});