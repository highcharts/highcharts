$(function () {
    /**
    *Function to draw the path
    */
    function getPath(width, height) {
        var path = [],
            centerX = width * 0.5,
            centerY = height * 0.56,
            r = width * 0.35,
            rFraction,
            x,
            y,
            i,
            angle;
        //loop to add points to the path
        for (i = 0; i < 32; i = i + 1) {
            angle = i * Math.PI / 16;
            if (i === 0) {
                path.push('M');
            } else if (i === 1) {
                path.push('L');
            }
            if (i % 4 === 0) {
                rFraction = 1;
            } else if (i % 2 === 0) {
                rFraction = 0.7;
            } else {
                rFraction = 0.5;
            }
            x = centerX + Math.cos(angle) * r * rFraction;
            y = centerY + Math.sin(angle) * r * rFraction;
            path.push(x, y);
        }
        return path;
    }
    /**
    * Function to check if the drawing of the compassrose exists, if so - it updates the path, if not, it draws it.
    */
    function onDraw() {
        var path = getPath(this.chartWidth, this.chartHeight);
        if (this.compassrose) {
            this.compassrose.animate({
                d: path
            });
        } else {
            this.compassrose = this.renderer.path(path)
                .attr({
                    fill: '#666666'
                })
                .add();
        }
    }

    $('#container').highcharts({
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: $('#container').width(),
            events: {
                load: onDraw,
                resize: onDraw
            }
        },
        title: {
            text: "Demo of custom backgroundshape in Highcharts"
        },
        pane: {
            startAngle: 0,
            endAngle: 360,
            background: null
        },
        yAxis: [{
            min: 0,
            max: 360,
            lineWidth: 0,
            minorTickWidth: 0,
            tickWidth: 0,
            labels: {
                enabled: false
            }
        }, {
            categories: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
            min: 0,
            max: 8,
            lineWidth: 0,
            minorTickWidth: 0,
            tickWidth: 0,
            showLastLabel: false,
            labels: {
                style: {
                    color: '#000000'
                },
                distance: 10,
                useHTML: true,
                formatter: function () {
                    var style = '',
                        scale = $('#container').width() * 0.005;
                    if (this.value.length === 1) {
                        style = 'font-size:' + (scale * 1.3) + 'em';
                    } else if (this.value.length === 2) {
                        style = 'font-size:' + (scale * 0.8) + 'em';
                    }
                    return '<span style="' + style + '">' + this.value + '</span>';
                }
            }
        }],
        tooltip: {
            enabled: false
        },
        plotOptions: {
            series: {
                animation: 2000
            },
            gauge: {
                dial: {
                    backgroundColor: '#000000',
                    radius: '100%',
                    baseWidth: 15,
                    borderColor: '#000000',
                    borderWidth: 0,
                    topWidth: 1,
                    baseLength: '10%',
                    rearLength: '20%'
                },
                pivot: {
                    backgroundColor: '#000000',
                    radius: 10
                },
                dataLabels: {
                    enabled: false
                }
            }
        },
        series: [{
            name: 'Direction',
            data: [0]
        }]

    },
        function (chart) {
            if (!chart.renderer.forExport) {
                setInterval(function () {
                    var point = chart.series[0].points[0],
                        newVal,
                        inc = 5 - Math.floor(Math.random() * 10);
                    newVal = point.y + inc;
                    point.update(newVal);

                }, 3000);
            }
        });
});

