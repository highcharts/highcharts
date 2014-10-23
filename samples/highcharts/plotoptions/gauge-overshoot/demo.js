$(function () {

    $('#container').highcharts({

        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false
        },

        title: {
            text: ''
        },

        pane: {
            startAngle: -110,
            endAngle: 110,
            borderWidth: 1,
            background: [ {
                backgroundColor: '#fff',
                borderWidth: 0,
                outerRadius: '100%',
                innerRadius: '88%'
            }]
        },

        // the value axis
        yAxis: {
            min: -50,
            max: 50,
            lineColor: '#3A3A3A',
            tickColor: '#3A3A3A',
            minorTickColor: '#c0c0bc',
            minorTickPosition: 'outside',
            tickPosition: 'outside',
            tickLength: 12,
            minorTickInterval: 'auto',
            tickWidth: 4,
            minorTickLength: 8,
            minorTickWidth: 0,
            offset: -13,
            lineWidth: 1,
            labels: {
                distance: 27,
                step: 0,
                rotation: 0,
                style: {
                    color: '#3A3A3A',
                    fontWeigth: 'normal'
                }
            },
            title: {
                text: '%'
            },
            plotBands: [{
                from: -50,
                to: 50,
                innerRadius: 103,
                outerRadius: 116,
                color: '#d3e9f7' // light blue
            }, {
                from: 20,
                to: 50,
                innerRadius: 103,
                outerRadius: 116,
                color: '#6fbe6b' // green
            }, {
                from: -50,
                to: -20,
                innerRadius: 103,
                outerRadius: 116,
                color: '#e7797d' // yellow
            }]
        },

        plotOptions: {
            gauge: {
                dial: {
                    baseWidth: 8,
                    backgroundColor: '#1f9fd9',
                    borderColor: '#1f9fd9',
                    borderWidth: 1,
                    rearLength: 0,
                    baseLength: 95,
                    radius: 92
                },
                pivot: {
                    radius: 4,
                    borderWidth: 0,
                    borderColor: '#1f9fd9',
                    backgroundColor: '#1f9fd9'
                },
                dataLabels: {
                    borderWidth: 2,
                    borderColor: '#d3e9f7',
                    padding: 5,
                    borderRadius: 2,
                    verticalAlign: 'center',
                    y: 30,
                    style: {
                        fontWeight: 'normal'
                    }
                },
                wrap: false
            }
        },

        series: [{
            name: 'Speed',
            data: [60],
            tooltip: {
                valueSuffix: ' %'
            },
            overshoot: 5
        }]

    },
        // Add some life
        function (chart) {
            if (!chart.renderer.forExport) {
                setInterval(function () {
                    var point = chart.series[0].points[0],
                        newVal,
                        inc = Math.round((Math.random() - 0.5) * 100);

                    newVal = point.y + inc;
                    if (newVal < -100 || newVal > 100) {
                        newVal = point.y - inc;
                    }

                    point.update(newVal);

                }, 3000);
            }
        });
});