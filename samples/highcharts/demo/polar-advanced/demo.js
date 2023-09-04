const
    colors = Highcharts.getOptions().colors,
    paneOpeningAngles = {
        startAngle: 40.5,
        endAngle: 319.5
    },
    specialSeriesProps = {
        showInLegend: false,
        groupPadding: 0,
        pointPadding: 0
    },
    monthExtremes = {
        min: 0,
        max: 26
    },
    weekExtremes = {
        min: 1,
        max: 5
    },
    toggleableGradient = {
        pattern: undefined,
        radialGradient: [1, 0.25, 0.1],
        stops: [
            [0, '#1f1836'],
            [1, '#45445d']
        ]
    },
    mouseOut = function () {
        const chart = this.series.chart;
        chart.setMidPaneBg({
            backgroundColor: toggleableGradient,
            outerRadius: '75%'
        });
        chart.subtitle.element.style.opacity = 1;
    },
    data = JSON.parse(document.getElementById('data').innerHTML),
    scoreData = data[3],
    countries = ['Ulambaator', 'Sofia', 'Asmara'],
    primaryTeamColor = new Highcharts.Color(colors[9]),
    teamColors = [
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[0]), 0.25),
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[8]), 0.65),
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[3]), 0.85)
    ],
    teamSeries = Array(3).fill({
        type: 'bubble',
        shadow: true,
        maxSize: '4%',
        minSize: '1%',
        point: {
            events: {
                mouseOver: function () {
                    const chart = this.series.chart;
                    chart.subtitle.element.style.opacity = 0;
                    chart.setMidPaneBg({
                        backgroundColor: teamColors[this.series.index],
                        innerRadius: '0%'
                    });
                },
                mouseOut
            }
        },
        colorKey: 't',
        tooltip: {
            headerFormat: (
                '<div class="team-day-display center">' +
                '<span style="margin-bottom: 6rem;">' +
                '<b style="font-size: 1.4rem; color:#000;">Day {point.x}</b>' +
                '</span><span style="width:100%;' +
                'margin-top:-130px;background: transparent; ' +
                'font-size: 2rem; padding: 0.8rem;' +
                'border: 0 outset {series.color}; border-block-end:' +
                '0 outset {series.color};"><b>{series.name}</b></span>'
            ),
            pointFormat: (
                '<span style="margin-top:7rem; position: absolute;' +
                'font-size: 1rem;"><span style="width:100%;' +
                'text-align:center;">Daily Sales:</span><br>' +
                '<span style="line-height:3rem;width:100%;font-size:2rem;' +
                'text-align:center;">{point.z}</span>'
            ),
            footerFormat: '</div>'
        }
    }).map((seriesProps, i) => ({
        ...seriesProps,
        name: countries[i],
        data: data[i],
        color: teamColors[i],
        marker: {
            fillColor: teamColors[i],
            fillOpacity: 1,
            lineColor: '#46465C',
            lineWidth: 2
        }
    })),
    weekLabels = Array(4)
        .fill(0)
        .map((value, index) => ({
            dataLabels: {
                format: 'Week {x}',
                enabled: true,
                inside: true,
                style: {
                    textOutline: undefined,
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    fontStyle: 'normal',
                    letterSpacing: '0.01rem'
                },
                textPath: {
                    enabled: true,
                    attributes: {
                        startOffset: index % 3 ? '75%' : '25%',
                        dy: '2.8%'
                    }
                }
            },
            x: index + 1,
            y: 1.5
        })),
    asColFieldStr = str => (
        '<span class=\"col-display-fieldwrap\">' +
        '<span style=\"color:{point.color}; font-size: 1rem;\">●</span> ' +
        str + '</span>'
    );

Highcharts.chart('container', {
    chart: {
        polar: true,
        height: '100%',
        events: {
            load: function () {
                const midPane = this.pane[1];

                this.setMidPaneBg = function (background) {
                    midPane.update({
                        background: background
                    });
                };
            },
            render: function () {
                if (this.legend.group) {
                    const
                        { chartWidth, legend } = this,
                        { legendWidth, legendHeight } = legend;

                    legend.group.translate(
                        (chartWidth - legendWidth) / 2,
                        legendHeight * 1.25
                    );

                }
            }
        }
    },

    title: {
        text: 'Advanced Polar Chart'
    },

    subtitle: {
        text: 'Sales Team<br>Performance',
        useHTML: 'true',
        align: 'center',
        y: 35,
        verticalAlign: 'middle',
        style: {
            color: 'white',
            textAlign: 'center',
            fontSize: '1.8rem'
        }
    },

    tooltip: {
        animation: false,
        backgroundColor: undefined,
        hideDelay: 0,
        useHTML: true,
        positioner: function (labelWidth, labelHeight) {
            const { chartWidth, chartHeight } = this.chart;
            return {
                x: (chartWidth / 2) - (labelWidth / 2),
                y: (chartHeight / 2) - (labelHeight / 2)
            };
        }
    },
    colorAxis: [{
        minColor: (
            new Highcharts.Color(colors[0])
                .brighten(0.05)
                .get('rgba')
        ),
        maxColor: (
            new Highcharts.Color(colors[5])
                .brighten(0.05)
                .get('rgba')
        ),
        showInLegend: false,
        ...weekExtremes
    },
    {
        minColor: new Highcharts.Color(colors[1]).tweenTo(
            new Highcharts.Color(colors[5]),
            0.5
        ),
        maxColor: new Highcharts.Color(colors[8]).tweenTo(
            new Highcharts.Color(colors[8]),
            0.5
        ),
        showInLegend: false,
        ...monthExtremes
    }
    ],
    pane: [{
        size: '95%',
        innerSize: '60%',
        ...paneOpeningAngles,
        background: {
            backgroundColor: toggleableGradient,
            outerRadius: '60%'
        }
    }, {
        size: '55%',
        innerSize: '45%',
        ...paneOpeningAngles,
        background: {
            borderWidth: 0,
            borderColor: (
                new Highcharts.Color(colors[4]).get('rgba')
            ),
            backgroundColor: toggleableGradient,
            outerRadius: '75%'
        }
    }, {
        size: '100%',
        innerSize: '88%',
        startAngle: 16.5,
        endAngle: 343.5,
        background: {
            borderWidth: 1,
            backgroundColor: '#46465C',
            innerRadius: '55%',
            outerRadius: '100%'
        }
    }],
    xAxis: [{
        pane: 0,
        tickInterval: 1,
        lineWidth: 0,
        gridLineWidth: 0,
        min: 1,
        max: 26,
        labels: {
            enabled: false
        }
    }, {
        pane: 1,
        linkedTo: 0,
        gridLineWidth: 0,
        lineWidth: 0,
        plotBands: Array(3).fill(7).map(
            (weekendOffset, week) => {
                const
                    from = weekendOffset * (week + 1),
                    to = from - 1;
                return {
                    from,
                    to,
                    color: '#BBBAC5'
                };
            }
        ),
        ...monthExtremes,
        labels: {
            enabled: false
        }
    }, {
        pane: 2,
        tickAmount: 4,
        tickInterval: 0.5,
        gridLineWidth: 0,
        lineWidth: 0,
        lineColor: '#BBBAC5',
        ...weekExtremes,
        labels: {
            enabled: false
        }
    }],
    yAxis: [{
        pane: 0,
        tickInterval: 8,
        gridLineWidth: 0.5,
        gridLineDashStyle: 'longdash',
        gridLineColor: '#BBBAC5',
        max: 1800,
        min: -8,
        labels: {
            enabled: false
        },
        title: null
    }, {
        pane: 1,
        reversed: true,
        gridLineWidth: 0,
        gridLineDashStyle: 'dash',
        gridLineColor: '#e6e6e6',
        tickInterval: 100,
        min: 0,
        max: 400,
        labels: {
            enabled: false
        },
        title: null
    }, {
        pane: 2,
        tickInterval: 0.25,
        gridLineWidth: 0,
        gridLineColor: (
            new Highcharts.Color(colors[1]).brighten(0.05).get('rgba')
        ),
        min: -3,
        max: 1,
        labels: {
            enabled: false
        },
        title: null
    }],
    legend: {
        floating: true,
        layout: 'vertical',
        verticalAlign: 'center',
        align: 'center',
        enabled: true,
        backgroundColor: '#1f1836',
        borderColor: (
            'transparent'
        ),
        itemStyle: {
            color: '#FFF',
            fontSize: '1rem'
        },
        width: '26%',
        borderRadius: 8,
        borderWidth: 1.5,
        padding: 8,
        maxHeight: '14%',
        symbolPadding: 12,
        symbolHeight: 12,
        itemMarginBottom: 2,
        itemMarginTop: 1
    },
    plotOptions: {
        columnrange: {
            custom: {
                textSizeClass: 'large-size'
            }
        }
    },
    responsive: {
        rules: [
            {
                condition: {
                    minWidth: 0
                },
                chartOptions: {
                    legend: {
                        itemStyle: {
                            color: '#FFF',
                            fontSize: '0.6em'
                        },
                        width: '26%',
                        borderRadius: 8,
                        borderWidth: 1.5,
                        padding: 4,
                        maxHeight: '14%',
                        symbolPadding: 8,
                        symbolHeight: 8
                    },
                    plotOptions: {
                        columnrange: {
                            custom: {
                                textSizeClass: 'small-size'
                            }
                        }
                    }
                }
            }, {
                condition: {
                    minWidth: 520
                },
                chartOptions: {
                    legend: {
                        itemStyle: {
                            color: '#FFF',
                            fontSize: '0.8em'
                        },
                        width: '26%',
                        borderRadius: 8,
                        borderWidth: 1.3,
                        padding: 6,
                        maxHeight: '14%',
                        symbolPadding: 10,
                        symbolHeight: 10
                    },
                    plotOptions: {
                        columnrange: {
                            custom: {
                                textSizeClass: 'mid-size'
                            }
                        }
                    },
                    subtitle: {
                        text: 'Sales Team<br>Performance',
                        useHTML: 'true',
                        align: 'center',
                        y: 35,
                        verticalAlign: 'middle',
                        style: {
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '1.2rem'
                        }
                    }
                }
            },
            {
                condition: {
                    minWidth: 600
                },
                chartOptions: {
                    legend: {
                        itemStyle: {
                            color: '#FFF',
                            fontSize: '0.9em'
                        },
                        width: '26%',
                        borderRadius: 8,
                        borderWidth: 1.5,
                        padding: 8,
                        maxHeight: '14%',
                        symbolPadding: 12,
                        symbolHeight: 12
                    },
                    plotOptions: {
                        columnrange: {
                            custom: {
                                textSizeClass: 'large-size'
                            }
                        }
                    },
                    subtitle: {
                        text: 'Sales Team<br>Performance',
                        useHTML: 'true',
                        align: 'center',
                        y: 35,
                        verticalAlign: 'middle',
                        style: {
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '2rem'
                        }
                    }
                }
            }
        ]
    },
    series: [
        ...teamSeries, {
            ...specialSeriesProps,
            animation: false,
            name: 'Month',
            type: 'column',
            data: weekLabels,
            xAxis: 2,
            yAxis: 2,
            colorKey: 'x',
            pointPlacement: 'between',
            enableMouseTracking: false,
            pointWidth: 1.2,
            borderRadius: 50
        }, {
            ...specialSeriesProps,
            animation: false,
            name: 'Total',
            type: 'columnrange',
            data: scoreData,
            xAxis: 1,
            yAxis: 1,
            shadow: false,
            pointPlacement: 'on',
            colorAxis: 1,
            colorKey: 'x',
            pointStart: 1,
            borderColor: '#46465C',
            borderWidth: 2,
            point: {
                events: {
                    mouseOver: function () {
                        this.series.chart.setMidPaneBg({
                            backgroundColor: toggleableGradient,
                            outerRadius: '75%'
                        });
                        this.series.chart.subtitle.element.style.opacity = 0;
                    },
                    mouseOut
                }
            },
            tooltip: {
                headerFormat: (
                    '<span style="color:#fff;" class="team-day-display center">' +
          '<span class="{series.options.custom.textSizeClass}">' +
          '<b style="color:{point.color};">Day {point.x}</b></span>'
                ),
                hideDelay: 0,
                pointFormat: (
                    asColFieldStr(
                        '<b>Sales: </b><span>{point.high}</span>'
                    ) +
          asColFieldStr(
              '<b>Average: </b><span>{point.avg}</span>'
          ) +
          asColFieldStr(
              '<b>Highscore: </b><span>{point.highscore}</span>'
          ) +
          asColFieldStr(
              '<b>Top earner: </b><span>{point.topEarner}</span>'
          )
                ),
                footerFormat: (
                    '<i class="col-display-footer center">' +
          'Week {point.week}</i></span>'
                )
            }
        }
    ]
});
