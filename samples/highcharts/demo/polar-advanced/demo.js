const
    paneOpeningAngles = { startAngle: 40.5, endAngle: 319.5 },
    toggleableGradient = {
        pattern: undefined,
        radialGradient: [1, 0.25, 0.1],
        stops: [
            [0, 'rgba(255,253,251, 1)'],
            [1, 'rgba(199, 216, 225, 0.2)']
        ]
    },
    specialSeriesProps = {
        showInLegend: false,
        groupPadding: 0,
        pointPadding: 0
    },
    monthExtremes = { min: 0, max: 26 },
    weekExtremes = { min: 1, max: 5 },
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
    legendHeight = (document
        .getElementById('container')
        .getBoundingClientRect()
        .height / 12
    ),
    scoreData = data[3],
    countries = ['Ulambaator', 'Sofia', 'Asmara'],
    teamColors = ['#FF8076', '#4E94C9', '#ADFFA6'],
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
                'font-size: 2rem; color:#FFFFFF; height:12vh;">' +
                'Day: {point.x}</b></span><span style="width:100%;' +
                'position: absolute; margin:1.5rem; background: #FFFFFF; ' +
                'border-radius:50%;font-size: 1rem; padding: 0.5rem;' +
                'border: 0.2rem outset {series.color}; border-block-end:' +
                '0.2rem outset {series.color};"><b style="color: ' +
                '{series.color};">●</b> <b>{series.name}</b></span>'
            ),
            pointFormat: (
                '<span style="margin-top:8rem; position: absolute;' +
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
        .map(
            (value, index) => ({
                dataLabels: {
                    format: 'Week {x}',
                    enabled: true,
                    inside: true,
                    style: {
                        textOutline: undefined,
                        color: '#707099'
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
            positioner: function (labelWidth, labelHeight) {
                console.log(this);
                const { chartWidth, chartHeight } = this.chart;
                return {
                    x: (chartWidth / 2) - (labelWidth / 2),
                    y: (chartHeight / 2) - (labelHeight / 2)
                };
            }
        },
        colorAxis: [{
            minColor: 'rgb(226, 214, 255)',
            maxColor: '#D9E0FF',
            showInLegend: false,
            ...weekExtremes
        },
        {
            minColor: '#A0FAB4',
            maxColor: '#ACB7FA',
            showInLegend: false,
            ...monthExtremes
        }],
        pane: [{
            size: '95%',
            innerSize: '60%',
            ...paneOpeningAngles,
            background: {
                backgroundColor: '#C8F9D3',
                outerRadius: '60%'
            }
        }, {
            size: '55%',
            innerSize: '25%',
            ...paneOpeningAngles,
            background: {
                borderWidth: 16,
                borderColor: '#A8C4FF',
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
                borderColor: '#F3DEF7',
                backgroundColor: {
                    radialGradient: { cx: 0.5, cy: 0.5, r: 1.8 },
                    stops: [
                        [0, 'rgba(228, 236, 251,1)'],
                        [0.2, 'rgba(242, 231, 255, 1)'],
                        [0.25, 'rgba(243,245, 240, 1)'],
                        [0.3, 'rgba(156, 245, 245,1)']
                    ]
                },
                innerRadius: '55%',
                outerRadius: '100%'
            }
        }],
        xAxis: [{
            pane: 0,
            lineWidth: 8,
            lineColor: '#A4B4FC',
            tickInterval: 1,
            gridLineWidth: 0,
            min: 1,
            max: 26,
            labels: { enabled: false }
        }, {
            pane: 1,
            linkedTo: 0,
            gridLineWidth: 0,
            lineColor: '#A8C4FF',
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
            tickAmount: 4,
            tickInterval: 0.5,
            gridLineWidth: 0,
            lineColor: '#B1E6FC',
            lineWidth: 8,
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
            gridLineColor: '#727EB0',
            min: -3,
            max: 1,
            labels: { enabled: false }
        }],
        legend: {
            enabled: true,
            backgroundColor: '#EAFAEF',
            borderColor: '#A8C4FF',
            borderRadius: 16,
            floating: true,
            layout: 'vertical',
            verticalAlign: 'top',
            squareSymbol: true,
            borderWidth: 1.5,
            itemStyle: {
                color: '#333333',
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
                borderColor: 'blueviolet',
                borderWidth: 0.35,
                tooltip: {
                    headerFormat: (
                        '<span class="center">' +
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
                        '<i class="col-display-footer" style=\"' +
                        'border-top: 0.1rem solid {point.color};\">' +
                        'Week {point.week}</i></span>'
                    )
                }
            }
        ]
    });