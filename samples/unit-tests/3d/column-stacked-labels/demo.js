$(function () {

    QUnit.test('3D columns stackLabels render', function (assert) {
        var chart = new Highcharts.Chart({
                chart: {
                  type: 'column',
                  renderTo: 'container',
                  options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 35,
                  },
                },
                yAxis: {
                  stackLabels: {
                    enabled: true,
                  }
                },
                plotOptions: {
                  column: {
                    animation: false,
                    stacking: 'normal',
                    dataLabels: {
                      enabled: true,
                      inside: false,
                    }
                  }
                },
                series: [{
                  data: [3, 3, 3],
                  stack: 'female'
                }]
          });

        var dataLabel = chart.series[0].data[0].dataLabel,
            stackLabel = chart.yAxis[0].stacks.columnfemale[0].label;

        dataLabel.x = dataLabel.translateX + dataLabel.element.getBBox(true).x;
        dataLabel.y = dataLabel.translateY + dataLabel.element.getBBox(true).y;
        stackLabel = stackLabel.element.getBBox(true);

        assert.close(
            dataLabel.x,
            stackLabel.x,
            2,
            'StackLabel x position is the same as datalabel x position'
        );

        assert.close(
            dataLabel.y,
            stackLabel.y,
            2,
            'StackLabel y position is the same as datalabel y position'
        );
    });
});
