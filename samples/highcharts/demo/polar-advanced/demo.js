Highcharts.theme = {
    colors: ['#8087E8', '#A3EDBA', '#F19E53', '#6699A1',
        '#E1D369', '#87B4E7', '#DA6D85', '#BBBAC5'],
    chart: {
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
            stops: [
                [0, '#1f1836'],
                [1, '#45445d']
            ]
        },
        style: {
            fontFamily: 'IBM Plex Sans, sans-serif'
        }
    },
    title: {
        style: {
            fontSize: '22px',
            fontWeight: '500',
            color: '#fff'
        }
    },
    subtitle: {
        style: {
            fontSize: '16px',
            fontWeight: '400',
            color: '#fff'
        }
    },
    credits: {
        style: {
            color: '#f0f0f0'
        }
    },
    caption: {
        style: {
            color: '#f0f0f0'
        }
    },
    tooltip: {
        borderWidth: 0,
        backgroundColor: '#f0f0f0',
        shadow: true
    },
    legend: {
        backgroundColor: 'transparent',
        itemStyle: {
            fontWeight: '400',
            fontSize: '12px',
            color: '#fff'
        },
        itemHoverStyle: {
            fontWeight: '700',
            color: '#fff'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#46465C',
                style: {
                    fontSize: '13px'
                }
            },
            marker: {
                lineColor: '#333'
            }
        },
        boxplot: {
            fillColor: '#505053'
        },
        candlestick: {
            lineColor: null,
            upColor: '#DA6D85',
            upLineColor: '#DA6D85'
        },
        errorbar: {
            color: 'white'
        },
        dumbbell: {
            lowColor: '#f0f0f0'
        },
        map: {
            borderColor: 'rgba(200, 200, 200, 1)',
            nullColor: '#78758C'

        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        },
        drillUpButton: {
            theme: {
                fill: '#fff'
            }
        }
    },
    xAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#fff',
                fontSize: '12px'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        title: {
            style: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        gridLineColor: '#707073',
        labels: {
            style: {
                color: '#fff',
                fontSize: '12px'
            }
        },
        lineColor: '#707073',
        minorGridLineColor: '#505053',
        tickColor: '#707073',
        tickWidth: 1,
        title: {
            style: {
                color: '#fff',
                fontWeight: '300'
            }
        }
    },
    mapNavigation: {
        enabled: true,
        buttonOptions: {
            theme: {
                fill: '#46465C',
                'stroke-width': 1,
                stroke: '#BBBAC5',
                r: 2,
                style: {
                    color: '#fff'
                },
                states: {
                    hover: {
                        fill: '#000',
                        'stroke-width': 1,
                        stroke: '#f0f0f0',
                        style: {
                            color: '#fff'
                        }
                    },

                    select: {
                        fill: '#000',
                        'stroke-width': 1,
                        stroke: '#f0f0f0',
                        style: {
                            color: '#fff'
                        }
                    }
                }
            },
            verticalAlign: 'bottom'
        }
    },
    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#46465C',
            stroke: '#BBBAC5',
            'stroke-width': 1,
            style: {
                color: '#fff'
            },
            states: {
                hover: {
                    fill: '#1f1836',
                    style: {
                        color: '#fff'
                    },
                    'stroke-width': 1,
                    stroke: 'white'
                },
                select: {
                    fill: '#1f1836',
                    style: {
                        color: '#fff'
                    },
                    'stroke-width': 1,
                    stroke: 'white'
                }
            }
        },
        inputBoxBorderColor: '#BBBAC5',
        inputStyle: {
            backgroundColor: '#2F2B38',
            color: '#fff'
        },
        labelStyle: {
            color: '#fff'
        }
    },
    navigator: {
        handles: {
            backgroundColor: '#BBBAC5',
            borderColor: '#2F2B38'
        },
        outlineColor: '#CCC',
        maskFill: 'rgba(255,255,255,0.1)',
        series: {
            color: '#A3EDBA',
            lineColor: '#A3EDBA'
        },
        xAxis: {
            gridLineColor: '#505053'
        }
    },
    scrollbar: {
        barBackgroundColor: '#BBBAC5',
        barBorderColor: '#808083',
        buttonArrowColor: '#2F2B38',
        buttonBackgroundColor: '#BBBAC5',
        buttonBorderColor: '#2F2B38',
        rifleColor: '#2F2B38',
        trackBackgroundColor: '#78758C',
        trackBorderColor: '#2F2B38'
    }
};
Highcharts.setOptions(Highcharts.theme);

const
    colors = Highcharts.getOptions().colors,
    paneOpeningAngles = { startAngle: 40.5, endAngle: 319.5 },
    toggleableGradient = {
        pattern: undefined,
        radialGradient: [1, 0.25, 0.1],
        stops: [
            [0, colors[6]],
            [1, colors[4]]
        ]
    },
    specialSeriesProps = {
        showInLegend: false,
        groupPadding: 0,
        pointPadding: 0
    },
    monthExtremes = { min: 0, max: 26 },
    weekExtremes = { min: 1, max: 5 },
    bubbleEvents = {
        mouseOver: function () {
            const
                { chartWidth, chartHeight } = this.series.chart,
                width = chartWidth / 10,
                height = chartHeight / 2,
                bgColor = this.series.color;

            this.series.chart.pane[1].update({
                background: {
                    backgroundColor: {
                        pattern: {
                            opacity: 1,
                            backgroundColor: colors[8],
                            width,
                            height,
                            color: bgColor,
                            path: {
                                fill: bgColor,
                                d: `M 0 ${width} H ${width} V ${
                                    (height * (width % height))
                                } H 0 L 0 ${height} Z`
                            }
                        }
                    },
                    innerRadius: '0%'
                }
            });

        },
        mouseOut: function () {
            this.series
                .chart.pane[1].update({
                    background: {
                        backgroundColor: toggleableGradient,
                        innerRadius: '100%'
                    }
                });
        }
    },
    data = JSON.parse(document.getElementById('data').innerHTML),
    legendHeight = (document
        .getElementById('container')
        .getBoundingClientRect()
        .height / 12
    ),
    scoreData = data[3],
    countries = ['Ulambaator', 'Sofia', 'Asmara'],
    primaryTeamColor = new Highcharts.Color(colors[1]),
    teamColors = [
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[4]), 0.5),
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[7]), 0.5),
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[3]), 0.5)

    ],
    asColFieldStr = str => (
        '<span class=\"col-display-fieldwrap\">' +
        '<span style=\"color:{point.color}; font-size: 1rem;\">●</span> ' +
        str + '</span>'
    ),
    teamSeries = Array(3).fill({
        type: 'bubble',
        shadow: true,
        maxSize: '4%',
        minSize: '1%',
        point: { events: bubbleEvents },
        colorKey: 't',
        tooltip: {
            headerFormat: (
                '<div class="team-day-display center">' +
                '<span style="margin-bottom:8rem;"><b style="' +
                'font-size: 2rem; color:' +
                new Highcharts.Color(colors[7]).brighten(0.5).get('rgba') +
                '; height:12vh;">' +
                'Day: {point.x}</b></span><span style="width:100%;' +
                'position: absolute; margin:1.5rem; background: #FFFFFF; ' +
                'border-radius:50%;font-size: 1rem; padding: 0.8rem;' +
                'border: 0.2rem outset {series.color}; border-block-end:' +
                '0.2rem outset {series.color};"><b style="color: ' +
                '{series.color};">●</b> <b>{series.name}</b></span>'
            ),
            pointFormat: (
                '<span style="margin-top:12rem; position: absolute;' +
                'font-size: 1.25rem;"><b style="width:100%;' +
                'text-align:center;">Daily Sales:</b> {point.z}</span>'
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
            fillOpacity: 1
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
                    textOutline: undefined
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
    chart = Highcharts.chart('container', {
        chart: {
            polar: true
        },
        title: {
            text: 'Advanced Polar Chart'
        },
        tooltip: {
            backgroundColor: undefined,
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
                new Highcharts.Color(colors[6]).brighten(0.3).get('rgba')
            ),
            maxColor: (
                new Highcharts.Color(colors[0]).brighten(0.3).get('rgba')
            ),
            showInLegend: false,
            ...weekExtremes
        },
        {
            minColor: new Highcharts.Color(colors[6]).tweenTo(
                new Highcharts.Color(colors[0]),
                0.5
            ),
            maxColor: new Highcharts.Color(colors[3]).tweenTo(
                new Highcharts.Color(colors[5]),
                0.5
            ),
            showInLegend: false,
            ...monthExtremes
        }],
        pane: [{
            size: '95%',
            innerSize: '60%',
            ...paneOpeningAngles,
            background: {
                backgroundColor: (
                    new Highcharts.Color(colors[4]).brighten(0.5).get('rgba')
                ),
                outerRadius: '60%'
            }
        }, {
            size: '55%',
            innerSize: '25%',
            ...paneOpeningAngles,
            background: {
                borderWidth: 16,
                borderColor: (
                    new Highcharts.Color(colors[0]).brighten(-0.2).get('rgba')
                ),
                backgroundColor: toggleableGradient,
                innerRadius: '95%'
            }
        }, {
            size: '100%',
            innerSize: '90%',
            startAngle: 16.5,
            endAngle: 343.5,
            background: {
                borderWidth: 16,
                borderColor: colors[0],
                backgroundColor: {
                    radialGradient: { cx: 0.5, cy: 0.5, r: 1.8 },
                    stops: [
                        [0, colors[0]],
                        [0.2, colors[5]],
                        [0.3, colors[1]]
                    ]
                },
                innerRadius: '55%',
                outerRadius: '100%'
            }
        }],
        xAxis: [{
            pane: 0,
            lineWidth: 8,
            lineColor: (
                new Highcharts.Color(colors[0]).brighten(0.15).get('rgba')
            ),
            tickInterval: 1,
            gridLineWidth: 0,
            min: 1,
            max: 26,
            labels: { enabled: false }
        }, {
            pane: 1,
            linkedTo: 0,
            gridLineWidth: 0,
            plotBands: Array(3).fill(7).map(
                (weekendOffset, week) => {
                    const
                        from = weekendOffset * (week + 1),
                        to = from - 1;
                    return {
                        from,
                        to,
                        color: colors[6]
                    };
                }
            ),
            ...monthExtremes,
            labels: { enabled: false }
        }, {
            pane: 2,
            tickAmount: 4,
            tickInterval: 0.5,
            gridLineWidth: 0,
            lineWidth: 8,
            lineColor: (
                new Highcharts.Color(colors[5]).brighten(0.1).get('rgba')
            ),
            ...weekExtremes,
            labels: { enabled: false }
        }],
        yAxis: [{
            pane: 0,
            tickInterval: 8,
            gridLineWidth: 1,
            max: 1800,
            min: -8,
            labels: { enabled: false }
        }, {
            pane: 1,
            reversed: true,
            gridLineWidth: 0,
            tickInterval: 100,
            min: 0,
            max: 400,
            labels: { enabled: false }
        }, {
            pane: 2,
            tickInterval: 0.25,
            gridLineWidth: 4,
            gridLineColor: (
                new Highcharts.Color(colors[4]).brighten(0.25).get('rgba')
            ),
            min: -3,
            max: 1,
            labels: { enabled: false }
        }],
        legend: {
            align: 'center',
            enabled: true,
            backgroundColor: colors[3],
            borderColor: (
                new Highcharts.Color(colors[6]).brighten(0.3).get('rgba')
            ),
            borderRadius: 16,
            floating: true,
            layout: 'vertical',
            verticalAlign: 'top',
            squareSymbol: true,
            borderWidth: 1.5,
            itemStyle: {
                fontSize: '0.8rem'
            },
            y: legendHeight,
            width: '30%',
            padding: 12,
            maxHeight: '18%',
            symbolPadding: 12,
            symbolHeight: 16
        },
        series: [
            ...teamSeries, {
                ...specialSeriesProps,
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
                name: 'Total',
                type: 'columnrange',
                data: scoreData,
                xAxis: 1,
                yAxis: 1,
                shadow: true,
                pointPlacement: 'on',
                colorAxis: 1,
                colorKey: 'x',
                pointStart: 1,
                borderColor: colors[0],
                borderWidth: 0.35,
                tooltip: {
                    headerFormat: (
                        '<span class="center"">' +
                        '<b class="col-display-header"' +
                        'style=\"text-decoration:' +
                        'underline solid {point.color} 0.2rem;\"' +
                        '>Day {point.x}</b>'
                    ),
                    pointFormat: (
                        asColFieldStr('<b>Sales: </b><span>{point.high}</span>') +
                        asColFieldStr('<b>Average: </b><span>{point.avg}</span>') +
                        asColFieldStr('<b>Highscore: </b><span>{point.highscore}</span>') +
                        asColFieldStr('<b>Top earner: </b><span>{point.topEarner}</span>')
                    ),
                    footerFormat: (
                        '<i class="col-display-footer center" style=\"' +
                        'border-top: 0.1rem solid {point.color};\">' +
                        'Week {point.week}</i></span>'
                    )
                }
            }
        ]

    });
