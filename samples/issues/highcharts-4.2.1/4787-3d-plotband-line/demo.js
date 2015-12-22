$(function () {
    var plotBands = getBlotBands(),
        chart = new Highcharts.Chart({
            chart: {
              renderTo: 'container',
              margin: 100,
              type: 'scatter',
              options3d: {
                enabled: true,
                alpha: 13,
                beta: 32,
                depth: 250,
                viewDistance: 5
              }
            },
            plotOptions: {
              scatter: {
                width: 10,
                height: 10,
                depth: 10
              }
            },
            xAxis: {
              min: 0,
              max: 5.5,
              title: null,
              plotBands: plotBands
            },
            yAxis: {
              min: 0,
              max: 5.5,
              title: null,
              plotBands: plotBands
            },
            zAxis: {
              min: 0,
              max: 10,
              showFirstLabel: false
            },
            legend: {
              enabled: false
            },
            series: [{
              data: [
                [1, 6, 5]
              ]
            }]
        });
    
    function getBlotBands () {
        var bands = [];
        Highcharts.each(['left', 'right', 'center'], function (align) {
            Highcharts.each(['top', 'bottom', 'middle'], function (vAlign) {
                bands.push({
                    from: 2,
                    to: 4,
                    color: 'rgba(1, 1, 1, 0.01)',
                    label: {
                        text: "Label",
                        align: align,
                        verticalAlign: vAlign
                    }
                });
            });
        });
        return bands;
    }
});