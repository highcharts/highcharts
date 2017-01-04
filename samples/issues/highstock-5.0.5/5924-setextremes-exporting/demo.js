$(function () {
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        }
    }, function (chart) {

        if (!chart.renderer.forExport) {
          // Bypass test for identical innerHTML
            chart.renderer.g('highcharts-' + window.which).add();

            var data = [71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4];
            var data2 = [710.5, 1260.4, 1490.2, 1240.0, 1460.0, 1250.6, 1280.5,
                2460.4, 1440.1, 450.60, 544.4];

            chart.addAxis({
                id: 'ax1',
                min: 3,
                max: 50,
                startOnTick: false,
                endOnTick: false
            }, false);
            chart.addAxis({
                id: 'ax2'
            }, false);
            chart.addSeries({
                yAxis: 'ax1',
                data: data
            }, false);
            chart.addSeries({
                yAxis: 'ax2',
                data: data2
            });



            for (var i = 0; i < chart.yAxis.length; ++i) {
                chart.yAxis[i].setExtremes(
                    0,
                    chart.yAxis[i].getExtremes().dataMax
                );
            }
        }
    });
});
