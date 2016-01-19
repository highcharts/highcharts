$(function () {

    // Uncomment to style it like Apple Watch
    /*
    if (!Highcharts.theme) {
        Highcharts.setOptions({
            chart: {
                backgroundColor: 'black'
            },
            colors: ['#F62366', '#9DFF02', '#0CCDD6'],
            title: {
                style: {
                    color: 'silver'
                }
            },
            tooltip: {
                style: {
                    color: 'silver'
                }
            }
        });
    }
    */

    Highcharts.chart('container', {

        chart: {
            type: 'solidgauge'
        },

        title: {
            text: 'Activity',
            style: {
                fontSize: '24px'
            }
        },

        tooltip: {
            borderWidth: 0,
            backgroundColor: 'none',
            shadow: false,
            style: {
                fontSize: '16px'
            },
            pointFormat: '{series.name}<br><span style="font-size:2em; color: {point.color}; font-weight: bold">{point.y}%</span>'
        },

        pane: {
            startAngle: 0,
            endAngle: 360,
            background: [{ // Track for Move
                outerRadius: '112%',
                innerRadius: '88%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0.3).get(),
                borderWidth: 0
            }, { // Track for Exercise
                outerRadius: '87%',
                innerRadius: '63%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[1]).setOpacity(0.3).get(),
                borderWidth: 0
            }, { // Track for Stand
                outerRadius: '62%',
                innerRadius: '38%',
                backgroundColor: Highcharts.Color(Highcharts.getOptions().colors[2]).setOpacity(0.3).get(),
                borderWidth: 0
            }]
        },

        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickPositions: []
        },

        plotOptions: {
            solidgauge: {
                borderWidth: '34px',
                dataLabels: {
                    borderWidth: 0,
                    enabled: true,
                    useHTML: true,
                    format: '<i class="fa {point.series.options.icon}"></i>',
                    style: {
                        fontSize: '30px',
                        fontWeight: 'bold'
                    },
                    zIndex: 4
                },
                stickyTracking: false
            }
        },

        series: [{
            name: 'Move',
            borderColor: Highcharts.getOptions().colors[0],
            data: [{
                color: Highcharts.getOptions().colors[0],
                radius: '100%',
                innerRadius: '100%',
                y: 80
            }],
            dataLabels: {
                x: -5,
                y: -165
            },
            icon: 'fa-angle-right'
        }, {
            name: 'Exercise',
            borderColor: Highcharts.getOptions().colors[1],
            data: [{
                color: Highcharts.getOptions().colors[1],
                radius: '75%',
                innerRadius: '75%',
                y: 65
            }],
            dataLabels: {
                x: -5,
                y: -130
            },
            icon: 'fa-angle-double-right'
        }, {
            name: 'Stand',
            borderColor: Highcharts.getOptions().colors[2],
            data: [{
                color: Highcharts.getOptions().colors[2],
                radius: '50%',
                innerRadius: '50%',
                y: 50
            }],
            dataLabels: {
                x: -5,
                y: -95
            },
            icon: 'fa-angle-up'
        }]
    });


});
