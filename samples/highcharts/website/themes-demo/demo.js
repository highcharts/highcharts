const chartOptions = {
    chart: {
        zoomType: 'xy'
    },
    title: {
        text: 'Average Monthly Weather Data for Tokyo',
        align: 'left'
    },
    subtitle: {
        text: 'Source: WorldClimate.com',
        align: 'left'
    },
    credits: {
        href: 'https://jkunst.com/highcharts-themes-collection/',
        text: 'Theme created by https://jkunst.com/highcharts-themes-collection/'
    },
    xAxis: [{
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        crosshair: true
    }],
    yAxis: [{ // Primary yAxis
        labels: {
            format: '{value}°C'

        },
        title: {
            text: 'Temperature'

        },
        opposite: true

    }, { // Secondary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Rainfall'

        },
        labels: {
            format: '{value} mm'

        }

    }, { // Tertiary yAxis
        gridLineWidth: 0,
        title: {
            text: 'Sea-Level Pressure'
        },
        labels: {
            format: '{value} mb'
        },
        opposite: true
    }],
    tooltip: {
        shared: true
    },
    legend: {
        layout: 'vertical',
        align: 'left',
        x: 80,
        verticalAlign: 'top',
        y: 55,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || // theme
            'rgba(255,255,255,0.25)'
    },
    series: [{
        name: 'Rainfall',
        type: 'column',
        yAxis: 1,
        data: [
            49.9,
            71.5,
            106.4,
            129.2,
            144.0,
            176.0,
            135.6,
            148.5,
            216.4,
            194.1,
            95.6,
            54.4
        ],
        tooltip: {
            valueSuffix: ' mm'
        }

    }, {
        name: 'Sea-Level Pressure',
        type: 'spline',
        yAxis: 2,
        data: [
            1016,
            1016,
            1015.9,
            1015.5,
            1012.3,
            1009.5,
            1009.6,
            1010.2,
            1013.1,
            1016.9,
            1018.2,
            1016.7],
        marker: {
            enabled: false
        },
        dashStyle: 'shortdot',
        tooltip: {
            valueSuffix: ' mb'
        }

    }, {
        name: 'Temperature',
        type: 'spline',
        data: [7.0,
            6.9,
            9.5,
            14.5,
            18.2,
            21.5,
            25.2,
            26.5,
            23.3,
            18.3,
            13.9,
            9.6],

        tooltip: {
            valueSuffix: ' °C'
        }
    }],
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    floating: false,
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom',
                    x: 0,
                    y: 0
                },
                yAxis: [{
                    labels: {
                        align: 'right',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    labels: {
                        align: 'left',
                        x: 0,
                        y: -6
                    },
                    showLastLabel: false
                }, {
                    visible: false
                }]
            }
        }]
    }
};

const theme0 = {
    colors: ['#f1c40f',
        '#2ecc71',
        '#9b59b6',
        '#e74c3c',
        '#34495e',
        '#3498db',
        '#1abc9c',
        '#f39c12',
        '#d35400'],
    chart: {
        backgroundColor: '#34495e'
    },
    xAxis: {
        gridLineDashStyle: 'Dash',
        gridLineWidth: 1,
        gridLineColor: '#cac6cd',
        lineColor: '#46627f',
        minorGridLineColor: '#BDC3C7',
        tickColor: '#46627f',
        tickWidth: 1,
        labels: {
            style: {
                color: '#cac6cd'
            }
        },
        title: {
            style: {
                color: '#FFFFFF'
            }
        }
    },
    yAxis:
    {
        gridLineDashStyle: 'Dash',
        gridLineColor: '#83798b',
        lineColor: '#BDC3C7',
        minorGridLineColor: '#BDC3C7',
        tickColor: '#46627f',
        tickWidth: 1,
        labels: {
            style: {
                color: '#cac6cd'
            }
        },
        title: {
            style: {
                color: '#FFFFFF'
            }
        }
    },
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#34495e',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)',
    title: {
        style: {
            color: '#FFFFFF'
        }
    },
    subtitle: {
        style: {
            color: '#666666'
        }
    },
    legend: {
        itemStyle: {
            color: '#C0C0C0'
        },
        itemHoverStyle: {
            color: '#C0C0C0'
        },
        itemHiddenStyle: {
            color: '#444444'
        }
    }
};
const theme1 = {
    colors: ['#6794a7',
        '#014d64',
        '#76c0c1',
        '#01a2d9',
        '#7ad2f6',
        '#00887d',
        '#adadad',
        '#7bd3f6',
        '#7c260b',
        '#ee8f71',
        '#76c0c1',
        '#a18376'],
    chart: {
        backgroundColor: '#d5e4eb',
        style: {
            fontFamily: 'Droid Sans',
            color: '#3C3C3C'
        }
    },
    title: {
        align: 'left',
        style: {
            fontWeight: 'bold',
            color: '#000'
        }
    },
    subtitle: {
        align: 'left'
    },
    yAxis: {
        gridLineColor: '#FFFFFF',
        lineColor: '#FFFFFF',
        minorGridLineColor: '#FFFFFF',
        tickColor: '#D7D7D8',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        },
        labels: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: '#FFFFFF',
        borderColor: '#76c0c1',
        style: {
            color: '#000000'
        }
    },
    legend: {
        itemStyle: {
            color: '#3C3C3C'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#D7D7D8'
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: '#F0F0F3'
        },
        activeDataLabelStyle: {
            color: '#F0F0F3'
        }
    },
    navigation: {
        buttonOptions: {
            symbolStroke: '#DDDDDD',
            theme: {
                fill: '#505053'
            }
        }
    },
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'
};
const theme2 = {
    colors: ['#FF2700', '#008FD5', '#77AB43', '#636464', '#C4C4C4'],
    chart: {
        backgroundColor: '#F0F0F0',
        plotBorderColor: '#606063',
        style: {
            fontFamily: 'Roboto',
            color: '#3C3C3C'
        }
    },
    title: {
        align: 'left',
        style: {
            fontWeight: 'bold'
        }
    },
    subtitle: {
        align: 'left'
    },
    xAxis: {
        gridLineWidth: 1,
        gridLineColor: '#D7D7D8',
        labels: {
            style: {
                fontFamily: 'Unica One, sans-serif',
                color: '#3C3C3C'
            }
        },
        lineColor: '#D7D7D8',
        minorGridLineColor: '#505053',
        tickColor: '#D7D7D8',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    yAxis: {
        gridLineColor: '#D7D7D8',
        labels: {
            style: {
                fontFamily: 'Unica One, sans-serif',
                color: '#3C3C3C'
            }
        },
        lineColor: '#D7D7D8',
        minorGridLineColor: '#505053',
        tickColor: '#D7D7D8',
        tickWidth: 1,
        title: {
            style: {
                color: '#A0A0A3'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#F0F0F0'
        }
    },
    legend: {
        itemStyle: {
            color: '#3C3C3C'
        },
        itemHiddenStyle: {
            color: '#606063'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#D7D7D8'
        }
    },
    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
    background2: '#505053',
    dataLabelsColor: '#B0B0B3',
    textColor: '#C0C0C0',
    contrastTextColor: '#F0F0F3',
    maskColor: 'rgba(255,255,255,0.3)'

};
const theme3 = {
    colors: ['#00AACC', '#FF4E00', '#B90000', '#5F9B0A', '#CD6723'],
    chart: {
        backgroundColor: {
            linearGradient: [
                0,
                0,
                0,
                150
            ],
            stops: [
                [
                    0,
                    '#CAE1F4'
                ],
                [
                    1,
                    '#EEEEEE'
                ]
            ]
        },
        style: {
            fontFamily: 'Open Sans'
        }
    },
    title: {
        align: 'left'
    },
    subtitle: {
        align: 'left'
    },
    legend: {
        align: 'right',
        verticalAlign: 'bottom'
    },
    xAxis: {
        gridLineWidth: 1,
        gridLineColor: '#F3F3F3',
        lineColor: '#F3F3F3',
        minorGridLineColor: '#F3F3F3',
        tickColor: '#F3F3F3',
        tickWidth: 1
    },
    yAxis: {
        gridLineColor: '#F3F3F3',
        lineColor: '#F3F3F3',
        minorGridLineColor: '#F3F3F3',
        tickColor: '#F3F3F3',
        tickWidth: 1
    }
};
const theme4 = {
    colors: ['#F92672', '#66D9EF', '#A6E22E', '#A6E22E'],
    chart: {
        backgroundColor: '#272822',
        style: {
            fontFamily: 'Inconsolata',
            color: '#A2A39C'
        }
    },
    title: {
        style: {
            color: '#A2A39C'
        },
        align: 'left'
    },
    subtitle: {
        style: {
            color: '#A2A39C'
        },
        align: 'left'
    },
    legend: {
        align: 'right',
        verticalAlign: 'bottom',
        itemStyle: {
            fontWeight: 'normal',
            color: '#A2A39C'
        }
    },
    xAxis: {
        gridLineDashStyle: 'Dot',
        gridLineWidth: 1,
        gridLineColor: '#A2A39C',
        lineColor: '#A2A39C',
        minorGridLineColor: '#A2A39C',
        tickColor: '#A2A39C',
        tickWidth: 1
    },
    yAxis: {
        gridLineDashStyle: 'Dot',
        gridLineColor: '#A2A39C',
        lineColor: '#A2A39C',
        minorGridLineColor: '#A2A39C',
        tickColor: '#A2A39C',
        tickWidth: 1
    }
};

const themes = [theme0, theme1, theme2, theme3, theme4];

let count = 0;
let theme = themes[count];
Highcharts.theme = theme;
Highcharts.setOptions(Highcharts.theme);
let chart = Highcharts.chart('container', chartOptions);

setInterval(function () {
    count = count + 1;
    if (count === 5) {
        count = 0;
        theme = themes[count];
        Highcharts.theme = theme;
        Highcharts.setOptions(Highcharts.theme);
        chart = Highcharts.chart('container', chartOptions);
    } else {
        chart.destroy();
        theme = themes[count];
        Highcharts.theme = theme;
        Highcharts.setOptions(Highcharts.theme);
        chart = Highcharts.chart('container', chartOptions);
    }
}, 3000);
