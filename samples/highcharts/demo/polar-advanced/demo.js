const
    colors = Highcharts.getOptions().colors,
    paneOpeningAngles = { startAngle: 40.5, endAngle: 319.5 },
    specialSeriesProps = {
        showInLegend: false,
        groupPadding: 0,
        pointPadding: 0
    },
    monthExtremes = { min: 0, max: 26 },
    weekExtremes = { min: 1, max: 5 },
    toggleableGradient = {
        pattern: undefined,
        radialGradient: [1, 0.25, 0.1],
        stops: [
            [0, colors[2]],
            [1, colors[6]]
        ]
    },
    mouseOut = function () {
        this.series.chart.setMidPaneBg({
            backgroundColor: toggleableGradient,
            outerRadius: '75%'
        });
    },
    data = JSON.parse(document.getElementById('data').innerHTML),
    scoreData = data[3],
    countries = ['Ulambaator', 'Sofia', 'Asmara'],
    primaryTeamColor = new Highcharts.Color(colors[6]),
    teamColors = [
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[0]), 0.25),
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[5]), 0.65),
        primaryTeamColor.tweenTo(new Highcharts.Color(colors[4]), 0.85)
    ],
    teamSeries = Array(3).fill({
        type: 'bubble',
        shadow: true,
        maxSize: '4%',
        minSize: '1%',
        point: {
            events: {
                mouseOver: function () {
                    const {
                            color: bgColor,
                            chart: { chartWidth, chartHeight, setMidPaneBg }
                        } = this.series,
                        width = chartWidth / 10,
                        height = chartHeight / 2;

                    setMidPaneBg({
                        backgroundColor: {
                            pattern: {
                                opacity: 1,
                                backgroundColor: colors[1],
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
                    });
                },
                mouseOut
            }
        },
        colorKey: 't',
        tooltip: {
            headerFormat: (
                '<div class="team-day-display center">' +
                '<span style="margin-bottom: 8rem;">' +
                '<b style="font-size: 2rem; letter-spacing: 0.12rem; color:' +
                new Highcharts.Color(colors[7]).brighten(0.5).get('rgba') +
                ';">' +
                'Day: {point.x}</b></span><span style="width:100%;' +
                'position: absolute; margin:1.5rem; background: #FFFFFF; ' +
                'border-radius:50%;font-size: 1rem; padding: 0.8rem;' +
                'border: 0.2rem outset {series.color}; border-block-end:' +
                '0.2rem outset {series.color};"><b style="color: ' +
                '{series.color};">●</b> <b>{series.name}</b></span>'
            ),
            pointFormat: (
                '<span style="margin-top:10rem; position: absolute;' +
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
                    textOutline: undefined,
                    fontSize: '0.7rem',
                    fontWeight: '500',
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
        events: {
            load: function () {
                const midPane = this.pane[1];

                this.setMidPaneBg = function (bg) {
                    midPane.update({ background: bg });
                };
            }
        }
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
                new Highcharts.Color(colors[7]).brighten(0.2).get('rgba')
            ),
            outerRadius: '60%'
        }
    }, {
        size: '55%',
        innerSize: '25%',
        ...paneOpeningAngles,
        background: {
            borderWidth: 4,
            borderColor: (
                new Highcharts.Color(colors[6]).brighten(0.35).get('rgba')
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
            borderWidth: 16,
            borderColor: (
                new Highcharts.Color(colors[5])
                    .brighten(0.25)
                    .get('rgba')
            ),
            backgroundColor: {
                radialGradient: { cx: 0.5, cy: 0.5, r: 1.8 },
                stops: [
                    [0, colors[3]],
                    [1, colors[0]]
                ]
            },
            innerRadius: '55%',
            outerRadius: '100%'
        }
    }],
    xAxis: [{
        pane: 0,
        lineWidth: 0,
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
            new Highcharts.Color(colors[1]).brighten(-0.1).get('rgba')
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
            new Highcharts.Color(colors[1]).brighten(0.05).get('rgba')
        ),
        min: -3,
        max: 1,
        labels: { enabled: false }
    }],
    legend: {
        align: 'center',
        enabled: true,
        backgroundColor: (
            new Highcharts.Color(colors[7])
                .brighten(-0.25)
                .get('rgba')
        ),
        borderColor: (
            colors[1]
        ),
        itemStyle: {
            fontSize: '0.8rem'
        },
        borderRadius: 16,
        floating: true,
        layout: 'vertical',
        verticalAlign: 'top',
        squareSymbol: true,
        borderWidth: 1.5,
        y: (
            document
                .getElementById('container')
                .getBoundingClientRect()
                .height / 12
        ),
        width: '24%',
        padding: 10,
        maxHeight: '14%',
        symbolPadding: 12,
        symbolHeight: 12
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
            borderColor: (
                new Highcharts
                    .Color(colors[6])
                    .brighten(0.25)
                    .get('rgba')
            ),
            borderWidth: 0.35,
            point: {
                events: {
                    mouseOver: function () {
                        this.series.chart.setMidPaneBg({
                            backgroundColor: colors[3],
                            outerRadius: '75%'
                        });
                    },
                    mouseOut
                }
            },
            tooltip: {
                headerFormat: (
                    '<span class="team-day-display center">' +
                    '<span style="margin-bottom:1.1rem;"><b style="' +
                    'font-size: 2rem; letter-spacing: 0.12rem; color:' +
                    (
                        new Highcharts.Color(colors[7])
                            .brighten(0.5)
                            .get('rgba')
                    ) +
                    ';">Day: {point.x}</b></span>'
                ),
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
                    '<i class="col-display-footer center" style=\"' +
                    'border-top: 0.15rem solid {point.color};\">' +
                    'Week {point.week}</i></span>'
                )
            }
        }
    ]
});