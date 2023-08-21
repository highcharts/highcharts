const
    monthExtremes = { min: 0, max: 26 },
    weekExtremes = { min: 1, max: 5 },
    paneOpeningAngles = { startAngle: 23.5, endAngle: 336.5 },
    toggleableGradient = {
        pattern: undefined,
        radialGradient: [1, 0.25, 0.1],
        stops: [
            [0, 'rgba(255,253,251, 1)'],
            [1, 'rgba(199, 216, 225, 0.15)']
        ]
    },
    bubbleEvents =  {
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
                            backgroundColor: '#FFFFFF',
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
    scoreData = data[3],
    countries = ['Ulambaator', 'Sofia', 'Asmara'],
    teamColors = ['#da3585', '#598EFF', '#AA91E6'],
    teamSeries = Array(3).fill({
        type: 'bubble',
        shadow: true,
        maxSize: '4%',
        minSize: '1%',
        point: { events: bubbleEvents },
        colorKey: 't',
        tooltip: {
            headerFormat: (
                '<div style="display:grid; place-items: center; height:22vh; border-radius:20%; text-align: center;">' +
                '<span style="margin-bottom:8rem;"><b style="font-size: 2rem; color:#FFFFFF; height:12vh;">Day: {point.x}</b></span>' +
                '<span style="width:100%; position: absolute; margin:1.5rem; background: #FFFFFF; border-radius:50%;font-size: 1rem; padding: 0.5rem;' +
                'border: 0.2rem outset {series.color}; border-block-end: 0.2rem outset {series.color};">' +
                '<b style="color: {series.color};">●</b> <b>{series.name}</b></span>'
            ),
            pointFormat: (
                '<span style="margin-top:8rem; position: absolute;font-size: 1.25rem;">' +
                '<b style="width:100%;text-align:center;">Daily Sales:</b> {point.z}</span>'
            ),
            footerFormat: '</div>'
        }
    }).map((seriesProps, i) => (
        {
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
        .map(
            (value, index) => ({
                dataLabels: {
                    format: 'Week {x}',
                    enabled: true,
                    inside: true,
                    style: {
                        textOutline: undefined,
                        color: '#576AFF',
                        'letter-spacing': '0.02em',
                        margin: '2rem',
                        textAlign: 'center'
                    },
                    textPath: {
                        enabled: true,
                        attributes: {
                            startOffset: index % 3 ? '75%' : '25%',
                            dy: '1.8%'
                        },
                        style: {
                            padding: '24rem'
                        }
                    }
                },
                x: index + 1,
                y: 3
            })
        ),
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
            padding: 16,
            positioner: function (labelWidth, labelHeight) {
                const { chartWidth, chartHeight } = this.chart;

                return {
                    x: (chartWidth / 2) - (labelWidth / 2),
                    y: (chartHeight / 2) - (labelHeight / 2)
                };
            }
        },
        colorAxis: [{
            minColor: '#B6F7D1',
            maxColor: '#73b0f2',
            showInLegend: false,
            ...weekExtremes
        },
        {
            minColor: '#6ED1FF',
            maxColor: '#A1A5FF',
            showInLegend: false,
            min: 0,
            max: 2
        },
        {
            minColor: '#A0FAB4',
            maxColor: '#ACB7FA',
            showInLegend: false,
            ...monthExtremes
        }
        ],
        pane: [{
            size: '95%',
            innerSize: '60%',
            ...paneOpeningAngles,
            background: {
                borderWidth: 4,
                borderColor: '#708FFF',
                backgroundColor: '#E2F4F8',
                outerRadius: '60%'
            }
        }, {
            size: '55%',
            innerSize: '25%',
            ...paneOpeningAngles,
            background: {
                borderWidth: 16,
                borderColor: '#6FC4FF',
                backgroundColor: toggleableGradient,
                innerRadius: '95%'
            }
        }, {
            size: '100%',
            innerSize: '95%',
            ...paneOpeningAngles,
            background: {
                borderWidth: 16,
                borderColor: '#F3DEF7',
                backgroundColor: {
                    radialGradient: { cx: 0.5, cy: 0.5, r: 1.8 },
                    stops: [
                        [0, 'rgba(66, 72, 179,1)'],
                        [0.2, 'rgba(232, 201, 245, 1)'],
                        [0.25, 'rgba(243, 255, 240, 1)'],
                        [0.3, 'rgba(10, 255, 226, 1)']
                    ]
                },
                innerRadius: '55%',
                outerRadius: '100%'
            }
        }],

        xAxis: [{
            pane: 0,
            lineWidth: 8,
            lineColor: '#8575BF',
            tickInterval: 1,
            gridLineWidth: 0,
            min: 1,
            max: 26,
            labels: { enabled: false }
        }, {
            pane: 1,
            linkedTo: 0,
            gridLineWidth: 0,
            lineWidth: 4,
            lineColor: '#708FFF',
            plotBands: Array(3).fill(7).map(
                (weekendOffset, week) => {
                    const
                        from = weekendOffset * (week + 1),
                        to = from - 1;
                    return {
                        from,
                        to,
                        color: '#FF7A70'
                    };
                }
            ),
            ...monthExtremes,
            labels: { enabled: false }
        }, {
            pane: 2,
            tickAmount: 5,
            tickInterval: 1,
            gridLineWidth: 0,
            lineColor: '#A69BE8',
            lineWidth: 16,
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
            gridLineColor: '#D8FDF4',
            min: -3,
            max: 1,
            labels: { enabled: false }
        }],

        legend: {
            enabled: true,
            backgroundColor: '#E2F4F8',
            borderColor: '#D2B8FA',
            borderRadius: 32,
            floating: true,
            layout: 'vertical',
            verticalAlign: 'top',
            squareSymbol: true,
            borderWidth: 4,

            itemStyle: { color: '#333333', fontSize: '0.86rem', letterSpacing: '0.032rem' },
            y: this.plotSizeY,
            width: '10%',
            padding: 16,
            maxHeight: '18%',

            title:
            {
                style: {
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    letterSpacing: '0.1rem',
                    color: '#444444'
                },
                text: 'Teams'
            }
        },

        series: [
            ...teamSeries,
            {
                name: 'Month',
                type: 'column',
                data: weekLabels,
                colorKey: 'x',
                xAxis: 2,
                yAxis: 2,
                showInLegend: false,
                pointPlacement: 'between',
                pointPadding: 0,
                groupping: false,
                centerInCategory: true,
                enableMouseTracking: false
            }, {
                name: 'Total',
                type: 'columnrange',
                data: scoreData,
                xAxis: 1,
                yAxis: 1,

                shadow: true,
                showInLegend: false,
                centerInCategory: true,
                pointPlacement: 'on',
                colorAxis: 2,
                groupPadding: 0,
                pointPadding: 0,
                colorKey: 'x',
                pointStart: 1,
                borderColor: 'blueviolet',
                borderWidth: 0.35,
                tooltip: {
                    headerFormat: (
                        '<span style=\"display:flex; justify-content: center; align-items:center; flex-direction:column;\">' +
                        '<b style=\"padding:0.4rem; font-size: 2.6rem; letter-spacing: 0.208rem; text-decoration: underline solid {point.color} 0.2rem; text-align:center;\"> Day {point.x}</b>'
                    ),

                    pointFormat: (
                        '<span style=\"font-size: 0.9rem;padding:0.3rem;width: 5rem; text-align:left\"><span style=\"color:{point.color}; font-size: 1rem;\">●</span> ' +
                        '<b>Sales: </b><span>{point.high}</span></span>' +
                        '<span style=\"font-size: 0.9rem;padding:0.3rem;width: 5rem;text-align:left\"><span style=\"color:{point.color}; font-size: 1rem;\">●</span><b> Average: </b><span>{point.avg}</span></span>' +
                        '<span style=\"font-size: 0.9rem;padding:0.3rem;width: 5rem; text-align:left\"><span style=\"color:{point.color}; font-size: 1rem;\">●</span> ' +
                        '<b>Highscore: </b><span>{point.highscore}</span></span>' +
                        '<span style=\"font-size: 0.9rem;padding:0.3rem;width: 5rem; text-align:left\"><span style=\"color:{point.color}; font-size: 1rem;\">●</span> ' +
                        '<b>Top earner: </b><span>{point.topEarner}</span></span>'
                    ),

                    footerFormat: '<i style=\"margin:0.3rem; padding:0.3rem;width: 10rem;text-align:center; border-top: 0.1rem solid {point.color};\">Week {point.week}</i></span>'
                }
            }
        ]
    }),
    resizeObserver = new ResizeObserver(() => {
        chart.legend.update({ y: chart.chartHeight / 12 });
    });

resizeObserver.observe(chart.renderTo);